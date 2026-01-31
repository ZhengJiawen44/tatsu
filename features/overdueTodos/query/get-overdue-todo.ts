import { useInfiniteQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { startOfToday } from "date-fns";
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
  const count = 3;

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["overdueTodo"],
    initialPageParam: null as string | null,
    queryFn: async ({ pageParam }) => {
      const data = await api.GET({
        url: `/api/todo/overdue?referenceDateString=${startOfToday().getTime()}${
          pageParam ? `&cursor=${pageParam}` : ""
        }&count=${count}`,
      });

      const { todos, nextCursor } = data;

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

      return {
        todos: todoWithFormattedDates,
        nextCursor,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  useEffect(() => {
    if (isError) {
      toast({ description: (error as Error).message, variant: "destructive" });
    }
  }, [isError]);

  const todos = data?.pages.flatMap((p) => p.todos) ?? [];

  return {
    todos,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
};
