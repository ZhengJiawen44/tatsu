import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export type changeMapType = {
  id: string;
  order: number;
};

export const useReorderProjectTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: reorderMutateFn, isPending: reorderPending } = useMutation({
    mutationFn: async (changeMap: changeMapType[]) => {
      const payload = changeMap.map(({ id, order }) => {
        const todoId = id.split(":")[0];
        return { id: todoId, order };
      });

      await api.PATCH({
        url: "/api/todo/reorder",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    },

    onMutate: async (changeMap) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      await queryClient.cancelQueries({ queryKey: ["project"] });

      const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);
      const oldProjectTodos = queryClient.getQueryData<TodoItemType[]>([
        "project",
      ]);

      const orderMap = new Map(changeMap.map(({ id, order }) => [id, order]));

      const applyOrder = (todos?: TodoItemType[]) =>
        todos
          ?.map((todo) =>
            orderMap.has(todo.id)
              ? { ...todo, order: orderMap.get(todo.id)! }
              : todo,
          )
          .sort((a, b) => a.order - b.order);

      queryClient.setQueryData<TodoItemType[]>(["todo"], applyOrder);
      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["project"] },
        applyOrder,
      );

      return { oldTodos, oldProjectTodos };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(["todo"], context?.oldTodos);
      queryClient.setQueryData(["project"], context?.oldProjectTodos);

      toast({
        description:
          error.message === "Failed to fetch"
            ? "failed to connect to server"
            : error.message,
        variant: "destructive",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
    },
  });

  return { reorderMutateFn, reorderPending };
};
