import { TodoItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useTodo = () => {
  const { toast } = useToast();
  //get todos
  const {
    data: todos = [],
    isLoading: todoLoading,
    isError,
    error,
  } = useQuery<TodoItemType[]>({
    queryKey: ["todo"],
    retry: 2,
    queryFn: async () => {
      const data = await api.GET({ url: `/api/todo` });
      const { todos }: { todos: TodoItemType[] } = data;
      if (!todos) {
        throw new Error(
          data.message || `bad server response: Did not recieve todo`,
        );
      }
      const todoWithFormattedDates = todos.map((todo) => {
        return {
          ...todo,
          dtstart: new Date(todo.dtstart),
          due: new Date(todo.due),
        };
      });

      return todoWithFormattedDates;
    },
  });
  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);

  return { todos, todoLoading };
};
