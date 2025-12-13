import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export function usePinTodo(todoItem: TodoItemType) {
  // console.log(todoItem);

  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: pinMutate, isPending: pinPending } = useMutation({
    mutationFn: async () => {
      await api.PATCH({
        url: `/api/todo/${todoItem.id}?pin=${!todoItem.pinned}`,
      });
    },

    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });

      const oldTodos = queryClient.getQueryData(["todo"]);
      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === todoItem.id) {
            return {
              ...todoItem,
              pinned: !todoItem.pinned,
            };
          }
          return oldTodo;
        })
      );
      return { oldTodos };
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { pinMutate, pinPending };
}
