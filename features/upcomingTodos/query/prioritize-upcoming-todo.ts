import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export const usePrioritizeUpcomingTodo = () => {
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
        await queryClient.cancelQueries({ queryKey: ["upcomingTodo"] });

        const oldTodos = queryClient.getQueryData<TodoItemType[]>([
          "upcomingTodo",
        ]);
        queryClient.setQueryData(["upcomingTodo"], (oldTodos: TodoItemType[]) =>
          oldTodos.map((oldTodo) => {
            if (oldTodo.id === id) {
              return {
                ...oldTodo,
                priority: level,
              };
            }
            return oldTodo;
          }),
        );

        return { oldTodos };
      },
      onSuccess: () => {
        // queryClient.invalidateQueries({ queryKey: ["upcomingTodo"] });
      },
      onError: (error) => {
        toast({ description: error.message, variant: "destructive" });
      },
      onSettled() {
        //optimistically update calendar todos
        queryClient.invalidateQueries({ queryKey: ["completedTodo"] });
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      },
    });

  return { prioritizeMutateFn, prioritizePending };
};
