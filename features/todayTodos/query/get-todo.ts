import { TodoItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { startOfToday, endOfToday } from "date-fns";

export const getTodo = async () => {
  const data = await api.GET({
    url: `/api/todo?start=${startOfToday().getTime()}&end=${endOfToday().getTime()}`,
  });
  const { todos }: { todos: TodoItemType[] } = data;
  if (!todos) {
    throw new Error(
      data.message || `bad server response: Did not recieve todo`,
    );
  }
  const todoWithFormattedDates = todos.map((todo) => {
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
};

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

    queryFn: getTodo,
  });
  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);

  return { todos, todoLoading };
};
