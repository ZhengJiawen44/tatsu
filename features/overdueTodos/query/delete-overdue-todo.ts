import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
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
      const oldTodos = queryClient.getQueryData(["overdueTodo"]);
      //optimistically update todos
      queryClient.setQueryData<TodoItemType[]>(
        ["overdueTodo"],
        (oldTodos = []) => {
          return oldTodos.filter((todo) => todo.id != id);
        },
      );

      return { oldTodos };
    },
    mutationKey: ["overdueTodo"],
    onError: (error, _, context) => {
      queryClient.setQueryData(["overdueTodo"], context?.oldTodos);
      toast({
        description:
          error.message === "Failed to fetch"
            ? "failed to connect to server"
            : error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({ queryKey: ["completedTodo"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });

      toast({ description: "todo deleted" });
    },
  });
  return { deleteMutateFn, deletePending };
};
