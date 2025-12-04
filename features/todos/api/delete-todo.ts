import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
export const useDeleteTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await api.DELETE({ url: `/api/todo/${id}` });
    },
    onMutate: async ({ id }: { id: string }) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const oldTodos = queryClient.getQueryData(["todo"]);
      queryClient.setQueryData<TodoItemType[]>(["todo"], (oldTodos = []) =>
        oldTodos.filter((todo) => todo.id != id)
      );
      return { oldTodos };
    },
    mutationKey: ["todo"],
    onError: (error, _, context) => {
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
      toast({ description: "todo deleted" });
    },
  });
  return { deleteMutate, deletePending };
};
