import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { InfiniteQueryTodoData } from "./get-overdue-todo";

export const useDeleteOverdueTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteMutateFn, isPending: deletePending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await api.DELETE({ url: `/api/todo/${id.split(":")[0]}` });
    },
    onMutate: async ({ id }: { id: string }) => {
      await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });
      await queryClient.cancelQueries({ queryKey: ["calendarTodo"] });

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
              todos: page.todos.filter((todo) => todo.id !== id),
            })),
          };
        },
      );

      return { oldDataBackup };
    },
    mutationKey: ["overdueTodo"],
    onError: (error, _, context) => {
      queryClient.setQueryData(["overdueTodo"], context?.oldDataBackup);
      toast({
        description:
          error.message === "Failed to fetch"
            ? "failed to connect to server"
            : error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["completedTodo"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      toast({ description: "todo deleted" });
    },
  });

  return { deleteMutateFn, deletePending };
};
