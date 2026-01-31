import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { InfiniteQueryTodoData } from "./get-overdue-todo";

export type changeMapType = {
  id: string;
  order: number;
};

export const useReorderOverdueTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: reorderMutateFn, isPending: reorderPending } = useMutation({
    mutationFn: async (changeMap: changeMapType[]) => {
      changeMap = changeMap.map(({ id, order }) => {
        const todoId = id.split(":")[0];
        return { id: todoId, order };
      });
      await api.PATCH({
        url: "/api/todo/reorder",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changeMap),
      });
    },
    onMutate: async (changeMap: changeMapType[]) => {
      await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });

      const oldDataBackup = queryClient.getQueryData<InfiniteQueryTodoData>([
        "overdueTodo",
      ]);

      queryClient.setQueryData<InfiniteQueryTodoData>(
        ["overdueTodo"],
        (oldData) => {
          if (!oldData) return oldData;

          // Create order map for quick lookup
          const orderMap = new Map(
            changeMap.map(({ id, order }) => [id, order]),
          );

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              todos: page.todos.map((todo) => {
                const newOrder = orderMap.get(todo.id);
                if (newOrder !== undefined) {
                  return { ...todo, order: newOrder };
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
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
    },
    onError: (error, _, context) => {
      queryClient.setQueryData(["overdueTodo"], context?.oldDataBackup);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { reorderMutateFn, reorderPending };
};
