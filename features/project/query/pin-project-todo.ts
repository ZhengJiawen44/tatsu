import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export function usePinProjectTodo() {
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
      await queryClient.cancelQueries({ queryKey: ["project"] });
      await queryClient.cancelQueries({ queryKey: ["todo"] });

      const oldProjectTodos = queryClient.getQueryData<TodoItemType[]>([
        "project",
      ]);
      const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);

      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["project"] },
        (old) => {
          return old?.map((oldTodo) => {
            if (oldTodo.id === todoItem.id) {
              return {
                ...oldTodo,
                pinned: !todoItem.pinned,
              };
            }
            return oldTodo;
          });
        },
      );

      queryClient.setQueryData<TodoItemType[]>(["todo"], (old) => {
        return old?.map((oldTodo) => {
          if (oldTodo.id === todoItem.id) {
            return {
              ...oldTodo,
              pinned: !todoItem.pinned,
            };
          }
          return oldTodo;
        });
      });

      return { oldProjectTodos, oldTodos };
    },

    mutationKey: ["project"],

    onError: (error, _, context) => {
      queryClient.setQueryData(["project"], context?.oldProjectTodos);
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
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
    },
  });

  return { pinMutateFn, pinPending };
}
