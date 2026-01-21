import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { CalendarTodoItemType } from "@/types";

async function patchTodo({ ghostTodo }: { ghostTodo: CalendarTodoItemType }) {
  if (!ghostTodo.id) {
    throw new Error("this todo is missing");
  }
  const { instanceDate } = ghostTodo;

  //validate input
  const parsedObj = todoSchema.safeParse({
    title: ghostTodo.title,
    description: ghostTodo.description,
    priority: ghostTodo.priority,
    dtstart: ghostTodo.dtstart,
    due: ghostTodo.due,
    rrule: ghostTodo.rrule,
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
    url: `/api/todo/instance/${ghostTodo.id.split(":")[0]}`,
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
        patchTodo({ ghostTodo: params }),

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
        queryClient.invalidateQueries({
          queryKey: ["todo"],
        });
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
