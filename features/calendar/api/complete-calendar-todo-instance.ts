import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { CalendarTodoItemType } from "@/types";
export const useCompleteCalendarTodoInstance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async ({ todoItem }: { todoItem: CalendarTodoItemType }) => {
      const url = `/api/calendar/todo/instance/complete/${todoItem.id}?instanceDate=${todoItem.instanceDate!.getTime()}`;
      await api.PATCH({ url, body: JSON.stringify(todoItem) });
    },

    onMutate: async ({ todoItem }: { todoItem: CalendarTodoItemType }) => {
      await queryClient.cancelQueries({ queryKey: ["calendarTodo"] });

      const oldTodos = queryClient.getQueryData<CalendarTodoItemType[]>([
        "calendarTodo",
      ]);

      if (todoItem.instanceDate) {
        queryClient.setQueriesData<CalendarTodoItemType[]>(
          {
            queryKey: ["calendarTodo"],
          },
          (old) =>
            old?.filter(
              (todo) =>
                todo.instanceDate?.getTime() !==
                todoItem.instanceDate!.getTime(),
            ),
        );
      }

      return { oldTodos };
    },

    onError: (error, _vars, context) => {
      toast({ description: error.message, variant: "destructive" });
      queryClient.setQueryData(["calendarTodo"], context?.oldTodos);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
    },
  });

  return { mutateComplete: mutate, isPending };
};
