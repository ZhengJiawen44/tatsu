import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
import { usePage as usePages } from "@/components/Sidebar/CustomPage/query/get-page";

export const usePage = ({ pageId }: { pageId: string }) => {
  const { toast } = useToast();
  const { pages, pagesLoading } = usePages();
  const page = pages.find((p) => p.id === pageId);

  const {
    data: pageTodos = [],
    isLoading: pageTodosLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<TodoItemType[]>({
    queryKey: ["pageTodo", pageId],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { todos } = await api.GET({
        url: `/api/page/todo?start=${page!.from.getTime()}&end=${page!.to.getTime()}`,
      });

      const todoWithFormattedDates = todos.map((todo: TodoItemType) => {
        // id needs to be todo id + instance date, so that ghost todos of the same parent can have unique ids
        const todoInstanceDate = todo.instanceDate
          ? new Date(todo.instanceDate)
          : null;
        const todoInstanceDateTime = todoInstanceDate?.getTime() ?? null;
        const todoId = `${todo.id}:${todoInstanceDateTime}`;
        return {
          ...todo,
          id: todoId,
          createdAt: new Date(todo.createdAt),
          dtstart: todo.dtstart ? new Date(todo.dtstart) : null,
          due: todo.due ? new Date(todo.due) : null,
          instanceDate: todoInstanceDate,
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
  return {
    pageTodos,
    pageTodosLoading: pagesLoading || pageTodosLoading,
    isFetching,
    isPending,
  };
};
