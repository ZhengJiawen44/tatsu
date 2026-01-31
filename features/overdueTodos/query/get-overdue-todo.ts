import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { endOfYesterday, sub } from "date-fns";
import { useEffect } from "react";
import { TodoItemType } from "@/types";

export type InfiniteQueryTodoData = {
  pages: Array<{
    todos: TodoItemType[];
    nextCursor: string | null;
  }>;
  pageParams: Array<string | null>;
};

export const useOverdueTodo = () => {
  const { toast } = useToast();

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["overdueTodo"],
    queryFn: async () => {
      const data = await api.GET({
        url: `/api/todo/overdue?start=${sub(endOfYesterday(), { days: 30 }).getTime()}&end=${endOfYesterday().getTime()}`,
      });

      const { todos } = data;

      const todoWithFormattedDates: TodoItemType[] = todos.map(
        (todo: TodoItemType) => {
          const todoInstanceDate = todo.instanceDate
            ? new Date(todo.instanceDate)
            : null;
          return {
            ...todo,
            id: `${todo.id}:${todoInstanceDate?.getTime()}`,
            createdAt: new Date(todo.createdAt),
            dtstart: new Date(todo.dtstart),
            due: new Date(todo.due),
            instanceDate: todoInstanceDate,
          };
        },
      );

      return todoWithFormattedDates;
    },
  });

  useEffect(() => {
    if (isError) {
      toast({ description: (error as Error).message, variant: "destructive" });
    }
  }, [isError]);

  return {
    todos,
    isLoading,
  };
};
