import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoFormItemType, TodoItemType } from "@/types";
import { endOfDay, startOfDay } from "date-fns";
import { toValidDateRangeUpdateObject } from "@/lib/date/toValidDateRangeUpdateObject";

async function patchTodo({ todo }: { todo: TodoFormItemType }) {
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
    projectID: todo.projectID,
  });
  if (!parsedObj.success) {
    console.log(parsedObj.error.errors[0]);
    return;
  }
  const dtstartChanged =
    todo.dtstartChecksum !== `${todo.dtstart?.toISOString() ?? "null"}`;
  const dueChanged =
    todo.dueChecksum !== `${todo.due?.toISOString() ?? "null"}`;
  const rruleChanged = todo.rruleChecksum !== todo.rrule;

  const [dtstart, due] = toValidDateRangeUpdateObject({
    dtstart: todo.dtstart,
    due: todo.due,
    dtstartChanged,
    dueChanged,
  });

  const todoId = todo.id.split(":")[0];
  await api.PATCH({
    url: `/api/todo/${todoId}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...parsedObj.data,
      id: todoId,
      instanceDate: todo.instanceDate,
      dtstart,
      due,
      rrule: rruleChanged ? todo.rrule : undefined,
      projectID: todo.projectID,
    }),
  });
}

export const useEditUpcomingTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoMutateFn, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoFormItemType) => patchTodo({ todo: params }),
    onMutate: async (updatedUpcomingTodo) => {
      await queryClient.cancelQueries({ queryKey: ["upcomingTodo"] });
      const oldTodos = queryClient.getQueryData<TodoItemType[]>([
        "upcomingTodo",
      ]);

      queryClient.setQueryData(["upcomingTodo"], (oldTodos: TodoItemType[]) =>
        oldTodos.flatMap((oldTodo) => {
          if (oldTodo.id === updatedUpcomingTodo.id) {
            // if todo is in the future, remove todo from overdue todos
            if (
              updatedUpcomingTodo.dtstart &&
              updatedUpcomingTodo.dtstart > endOfDay(new Date())
            ) {
              return [];
            }
            // if todo is today, remove todo from overdue todos
            if (
              updatedUpcomingTodo.dtstart &&
              updatedUpcomingTodo.dtstart >= startOfDay(new Date())
            ) {
              return [];
            }
            return {
              completed: updatedUpcomingTodo.completed,
              order: updatedUpcomingTodo.order,
              pinned: updatedUpcomingTodo.pinned,
              userID: updatedUpcomingTodo.userID,
              id: updatedUpcomingTodo.id,
              title: updatedUpcomingTodo.title,
              description: updatedUpcomingTodo.description,
              priority: updatedUpcomingTodo.priority,
              due: updatedUpcomingTodo.due,
              dtstart: updatedUpcomingTodo.dtstart,
              rrule: updatedUpcomingTodo.rrule,
              createdAt: new Date(),
              projectID: updatedUpcomingTodo.projectID,
            };
          }
          return oldTodo;
        }),
      );

      // if todo is today, remove todo from overdue todos
      if (
        updatedUpcomingTodo.dtstart &&
        updatedUpcomingTodo.dtstart >= startOfDay(new Date()) &&
        updatedUpcomingTodo.dtstart <= endOfDay(new Date())
      )
        queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) => [
          ...oldTodos,
          updatedUpcomingTodo,
        ]);

      return { oldTodos };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({ queryKey: ["upcomingTodo"] });
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["upcomingTodo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editTodoMutateFn, editTodoStatus };
};
