import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { CalendarTodoItemType } from "@/types";

async function patchTodo({
  todoWithInstanceDate,
}: {
  todoWithInstanceDate: CalendarTodoItemType;
}) {
  if (!todoWithInstanceDate.id) {
    throw new Error("this todo is missing");
  }
  const { instanceDate } = todoWithInstanceDate;

  //validate input
  const parsedObj = todoSchema.safeParse({
    title: todoWithInstanceDate.title,
    description: todoWithInstanceDate.description,
    priority: todoWithInstanceDate.priority,
    dtstart: todoWithInstanceDate.dtstart,
    due: todoWithInstanceDate.due,
    rrule: todoWithInstanceDate.rrule,
  });
  if (!parsedObj.success) {
    console.error(parsedObj.error.errors[0]);
    return;
  }
  if (!instanceDate) {
    console.error("instance date is required for todo instance override!");
    return;
  }

  await api.PATCH({
    url: `/api/todo/instance/${todoWithInstanceDate.id}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...parsedObj.data, instanceDate }),
  });
}

export const useEditCalendarTodoInstance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: editCalendarTodoInstance, status: editTodoInstanceStatus } =
    useMutation({
      mutationFn: (params: CalendarTodoItemType) =>
        patchTodo({ todoWithInstanceDate: params }),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      },

      onError: (error) => {
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  return { editCalendarTodoInstance, editTodoInstanceStatus };
};
