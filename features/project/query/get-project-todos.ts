import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
import { endOfToday, startOfToday } from "date-fns";

export const useProject = ({ id }: { id: string }) => {
  const { toast } = useToast();
  //get Notes
  const {
    data: projectTodos = [],
    isLoading: projectTodosLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<TodoItemType[]>({
    queryKey: ["project", id],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async ({ queryKey }) => {
      const [, id] = queryKey;
      const { todos } = await api.GET({ url: `/api/project/${id}?start=${startOfToday().getTime()}&end=${endOfToday().getTime()}` });

      const todoWithFormattedDates = todos.map((todo: TodoItemType) => {
        // id needs to be todo id + instance date, so that ghost todos of the same parent can have unique ids
        const todoInstanceDate = todo.instanceDate
          ? new Date(todo.instanceDate)
          : null;
        const todoInstanceDateTime = todoInstanceDate?.getTime();
        const todoId = `${todo.id}:${todoInstanceDateTime}`;
        return {
          ...todo,
          id: todoId,
          createdAt: new Date(todo.createdAt),
          dtstart: new Date(todo.dtstart),
          due: new Date(todo.due),
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
  return { projectTodos, projectTodosLoading, isFetching, isPending };
};

