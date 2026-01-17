import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CalendarTodoItemType } from "@/types";

export const useCalendarTodo = (calendarRange: { start: Date; end: Date }) => {
  const { toast } = useToast();
  //get all of today's todos
  const {
    data: todos = [],
    isLoading: todoLoading,
    isError,
    error,
  } = useQuery<CalendarTodoItemType[]>({
    queryKey: [
      "calendarTodo",
      calendarRange.start.getTime(),
      calendarRange.end.getTime(),
    ],
    staleTime: 5 * 60 * 1000,
    retry: 2,
    queryFn: async () => {
      const data = await api.GET({
        url: `/api/calendar/todo?start=${calendarRange.start.getTime()}&end=${calendarRange.end.getTime()}`,
      });
      const { todos }: { todos: CalendarTodoItemType[] } = data;
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
          dtstart: new Date(todo.dtstart),
          due: new Date(todo.due),
          instanceDate: todoInstanceDate,
          instances:
            todo.instances?.map((instance) => ({
              ...instance,
              instanceDate: new Date(instance.instanceDate),
              overriddenDtstart: instance.overriddenDtstart
                ? new Date(instance.overriddenDtstart)
                : null,
              overriddenDue: instance.overriddenDue
                ? new Date(instance.overriddenDue)
                : null,
            })) || null,
        };
      });
      console.log(todoWithFormattedDates);
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
