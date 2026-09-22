import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export const usePrioritizePinnedTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: prioritizeMutateFn, isPending: prioritizePending } =
    useMutation({
      mutationFn: async ({
        id,
        level,
        isRecurring,
      }: {
        id: string;
        level: "Low" | "Medium" | "High";
        isRecurring: boolean;
      }) => {
        const todoId = id.split(":")[0];
        const instanceDate = id.split(":")[1];

        if (isRecurring) {
          await api.PATCH({
            url: `/api/todo/instance/${todoId}/prioritize/?priority=${level}&instanceDate=${instanceDate}`,
          });
        } else {
          await api.PATCH({
            url: `/api/todo/${todoId}`,
            body: JSON.stringify({ priority: level }),
          });
        }
      },

      onMutate: async ({
        id,
        level,
      }: {
        id: string;
        level: "Low" | "Medium" | "High";
      }) => {
        await queryClient.cancelQueries({ queryKey: ["pinnedTodo"] });
        await queryClient.cancelQueries({ queryKey: ["todo"] });

        const oldPinnedTodos = queryClient.getQueryData<TodoItemType[]>([
          "pinnedTodo",
        ]);
        const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);

        queryClient.setQueriesData<TodoItemType[]>(
          { queryKey: ["pinnedTodo"] },
          (old) => {
            return old?.map((todo) =>
              todo.id === id ? { ...todo, priority: level } : todo,
            );
          },
        );

        queryClient.setQueryData<TodoItemType[]>(["todo"], (old) => {
          return old?.map((todo) =>
            todo.id === id ? { ...todo, priority: level } : todo,
          );
        });

        return { oldPinnedTodos, oldTodos };
      },

      mutationKey: ["pinnedTodo"],

      onError: (error, _, context) => {
        queryClient.setQueryData(["pinnedTodo"], context?.oldPinnedTodos);
        queryClient.setQueryData(["todo"], context?.oldTodos);

        toast({
          description:
            error.message === "Failed to fetch"
              ? "failed to connect to server"
              : error.message,
          variant: "destructive",
        });
      },

      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
        queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
        queryClient.invalidateQueries({ queryKey: ["todo"] });
        queryClient.invalidateQueries({ queryKey: ["project"] });


      },
    });

  return { prioritizeMutateFn, prioritizePending };
};
