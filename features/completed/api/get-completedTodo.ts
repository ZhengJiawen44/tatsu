import { CompletedTodoItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

export const useCompletedTodo = () => {
  const { toast } = useToast();
  //get todos
  const {
    data: completedTodos = [],
    isLoading: todoLoading,
    isError,
    error,
  } = useQuery<CompletedTodoItemType[]>({
    queryKey: ["completedTodo"],
    retry: 2,
    queryFn: async () => {
      const data = await api.GET({ url: `/api/completedTodo` });
      const { completedTodos }: { completedTodos: CompletedTodoItemType[] } = data;
      if (!completedTodos) {
        throw new Error(
          data.message || `bad server response: Did not recieve todo`
        );
      }

      const completedTodoWithFormattedDates = completedTodos.map((todo) => {
        return {
          ...todo,
          startedAt: new Date(todo.startedAt),
          createdAt: new Date(todo.createdAt),
          expiresAt: new Date(todo.expiresAt),
          completedAt: new Date(todo.completedAt)
        };
      });

      return completedTodoWithFormattedDates;
    },
  });
  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);

  return { completedTodos, todoLoading };
};

