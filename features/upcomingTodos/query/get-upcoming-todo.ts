import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { startOfTomorrow, endOfTomorrow } from "date-fns";
import { useEffect } from "react";
import { TodoItemType } from "@/types";

export type InfiniteQueryTodoData = {
  pages: Array<{
    todos: TodoItemType[];
    nextCursor: string | null;
  }>;
  pageParams: Array<string | null>;
};

export const useUpcomingTodo = () => {
  const { toast } = useToast();

  const {
    data: todos = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["upcomingTodo"],
    queryFn: async () => {
      //get todos starting tomorrow to one year later
      const data = await api.GET({
        url: `/api/page/todo?start=${startOfTomorrow().getTime()}&end=${endOfTomorrow().getTime()+365 * 24 * 60 * 60 * 1000}`,
      });
      const { todos } = data;

      const todoWithFormattedDates: TodoItemType[] = todos.map(
        (todo: TodoItemType) => {
          const todoInstanceDate = todo.instanceDate
            ? new Date(todo.instanceDate)
            : null;
          return {
            ...todo,
            id: `${todo.id}:${todoInstanceDate?.getTime() ?? null}`,
            createdAt: new Date(todo.createdAt),
            dtstart: todo.dtstart ? new Date(todo.dtstart) : undefined,
            due: new Date(todo.due!),
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
