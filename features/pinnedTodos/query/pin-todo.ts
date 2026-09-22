import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export function usePinTodo() {
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
      await queryClient.cancelQueries({ queryKey: ["pinnedTodo"] });
      await queryClient.cancelQueries({ queryKey: ["todo"] });

      const oldPinnedTodos = queryClient.getQueryData<TodoItemType[]>([
        "pinnedTodo",
      ]);
      const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);

      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["pinnedTodo"] },
        (oldPinnedTodos) => {
          return oldPinnedTodos?.flatMap((oldPinnedTodo) => {
            if (oldPinnedTodo.id === todoItem.id && todoItem.pinned === true){
              return []
            }
            return [oldPinnedTodo];
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

      if(todoItem.projectID)
      queryClient.setQueryData<TodoItemType[]>(["project",todoItem.projectID], (old) => {
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

      queryClient.setQueryData<TodoItemType[]>(["overdueTodo"], (old) => {
        return old?.map((oldTodo) => {
            console.log(oldTodo.id, todoItem.id)
          if (oldTodo.id === todoItem.id) {
            return {
              ...oldTodo,
              pinned: !todoItem.pinned,
            };
          }
          return oldTodo;
        });
      });

      return { oldPinnedTodos, oldTodos };
    },

    mutationKey: ["pinnedTodo"],

    onError: (error, _, context) => {
      queryClient.setQueryData(["pinnedTodo"], context?.oldPinnedTodos);
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
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });
      queryClient.invalidateQueries({ queryKey: ["pinnedTodo"] });

    },
  });

  return { pinMutateFn, pinPending };
}
