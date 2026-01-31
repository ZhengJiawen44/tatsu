import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { InfiniteQueryTodoData } from "./get-overdue-todo";
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
                if (todo.id === todoItem.id) {
                  return {
                    ...todo,
                    pinned: !todoItem.pinned,
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
  });

  return { pinMutateFn, pinPending };
}
