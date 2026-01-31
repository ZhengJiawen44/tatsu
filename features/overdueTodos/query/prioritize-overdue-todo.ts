import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { InfiniteQueryTodoData } from "./get-overdue-todo";

export const usePrioritizeOverdueTodo = () => {
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
        await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });

        const oldDataBackup = queryClient.getQueryData<InfiniteQueryTodoData>([
          "overdueTodo",
        ]);

        queryClient.setQueryData<InfiniteQueryTodoData>(
          ["overdueTodo"],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                todos: page.todos.map((todo) => {
                  if (todo.id === id) {
                    return {
                      ...todo,
                      priority: level,
                    };
                  }
                  return todo;
                }),
              })),
            };
          },
        );

        return { oldDataBackup };
      },
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
      },
      onError: (error, _, context) => {
        queryClient.setQueryData(["overdueTodo"], context?.oldDataBackup);
        toast({ description: error.message, variant: "destructive" });
      },
      onSettled() {
        queryClient.invalidateQueries({ queryKey: ["completedTodo"] });
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      },
    });

  return { prioritizeMutateFn, prioritizePending };
};
