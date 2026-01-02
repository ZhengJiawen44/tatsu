import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { CalendarTodoItemType } from "@/types";

export const useCalendarTodo = () => {
  const { toast } = useToast();
  //get all of today's todos
  const {
    data: todos = [],
    isLoading: todoLoading,
    isError,
    error,
  } = useQuery<CalendarTodoItemType[]>({
    queryKey: ["calendarTodo"],
    retry: 2,
    queryFn: async () => {
      const data = await api.GET({ url: `/api/calendar/todo` });
      const { todos }: { todos: CalendarTodoItemType[] } = data;
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
          instances: todo.instances.map((instance) => ({
            ...instance,
            instanceDate: new Date(instance.instanceDate),
            overriddenDtstart: instance.overriddenDtstart
              ? new Date(instance.overriddenDtstart)
              : null,
            overriddenDue: instance.overriddenDue
              ? new Date(instance.overriddenDue)
              : null,
          })),
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
