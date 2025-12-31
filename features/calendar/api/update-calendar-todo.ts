import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";
import { endOfDay } from "date-fns";

async function patchCalendarTodo({ todo }: { todo: TodoItemType }) {
  if (!todo.id) {
    throw new Error("this todo is missing");
  }
  //validate input
  const parsedObj = todoSchema.safeParse({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dtstart: todo.dtstart,
    due: todo.due,
    rrule: todo.rrule,
  });
  if (!parsedObj.success) {
    console.log(parsedObj.error.errors[0]);
    return;
  }

  await api.PATCH({
    url: `/api/calendar/todo/${todo.id}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...parsedObj.data }),
  });
}

export const useEditCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editCalendarTodo, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoItemType) => patchCalendarTodo({ todo: params }),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["calendarTodo"] });
      const oldTodos = queryClient.getQueryData(["calendarTodo"]);

      queryClient.setQueryData(["calendarTodo"], (oldTodos: TodoItemType[]) =>
        oldTodos.flatMap((oldTodo) => {
          if (oldTodo.id === newTodo.id) {
            if (newTodo.dtstart > endOfDay(new Date())) {
              return [];
            }
            return {
              completed: newTodo.completed,
              order: newTodo.order,
              pinned: newTodo.pinned,
              userID: newTodo.userID,
              id: newTodo.id,
              title: newTodo.title,
              description: newTodo.description,
              priority: newTodo.priority,
              due: newTodo.due,
              dtstart: newTodo.dtstart,
              rrule: newTodo.rrule,
              createdAt: new Date(),
            };
          }
          return oldTodo;
        }),
      );
      return { oldTodos };
    },
    onSettled: () => {},
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["calendarTodo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editCalendarTodo, editTodoStatus };
};
