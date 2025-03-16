import { useErrorNotification } from "@/hooks/useErrorToast";
import { TodoItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";

export const useTodo = () => {
  //get todos
  const {
    data: todos = [],
    isLoading: todoLoading,
    isError,
    error,
  } = useQuery<TodoItemType[]>({
    queryKey: ["todo"],
    queryFn: async () => {
      const res = await fetch(`/api/todo`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.message || `error ${res.status}: failed to get Todos`
        );
      const { todos }: { todos: TodoItemType[] } = data;
      if (!todos) {
        throw new Error(
          data.message || `bad server response: Did not recieve todo`
        );
      }

      const todoWithFormattedDates = todos.map((todo) => {
        return {
          ...todo,
          startedAt: new Date(todo.startedAt),
          createdAt: new Date(todo.createdAt),
          expiresAt: new Date(todo.expiresAt),
        };
      });
      return todoWithFormattedDates;
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { todos, todoLoading };
};
