import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export function usePinOverdueTodo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: pinMutateFn, isPending: pinPending } = useMutation({
    mutationFn: async (todoItem: TodoItemType) => {
      await api.PATCH({
        url: `/api/todo/${todoItem.id.split(":")[0]}`,
        body: JSON.stringify({ pinned: !todoItem.pinned }),
      });
    },

    onMutate: async (todoItem: TodoItemType) => {
      await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });

      const oldTodos = queryClient.getQueryData(["overdueTodo"]);
      queryClient.setQueryData(["overdueTodo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === todoItem.id) {
            return {
              ...todoItem,
              pinned: !todoItem.pinned,
            };
          }
          return oldTodo;
        }),
      );
      return { oldTodos };
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { pinMutateFn, pinPending };
}
