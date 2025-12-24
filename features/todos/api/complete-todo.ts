import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";
export const useCompleteTodo = (todoItem: TodoItemType) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutateCompleted, isPending } = useMutation({
    mutationFn: async () => {
      await api.PATCH({
        url: `/api/todo/${todoItem.id}/completeTodo`,
        body: JSON.stringify({ todoItem }),
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const oldTodos = queryClient.getQueryData(["todo"]) as TodoItemType[];
      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === todoItem.id) {
            return {
              ...todoItem,
              completed: true,
            };
          }
          return oldTodo;
        }),
      );
      return { oldTodos };
    },
    onError: (error, newTodo, context) => {
      toast({ description: error.message, variant: "destructive" });
      queryClient.setQueryData(["todo"], context?.oldTodos);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });

  return { mutateCompleted, isPending };
};
