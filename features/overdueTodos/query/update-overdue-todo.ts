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

export const useEditOverdueTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoMutateFn, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoFormItemType) => patchTodo({ todo: params }),
    onMutate: async (updatedOverdueTodo) => {
      await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });
      const oldTodos = queryClient.getQueryData<TodoItemType[]>([
        "overdueTodo",
      ]);

      queryClient.setQueryData(["overdueTodo"], (oldTodos: TodoItemType[]) =>
        oldTodos.flatMap((oldTodo) => {
          if (oldTodo.id === updatedOverdueTodo.id) {
            // if todo is in the future, remove todo from overdue todos
            if (updatedOverdueTodo.dtstart && updatedOverdueTodo.dtstart > endOfDay(new Date())) {
              return [];
            }
            // if todo is today, remove todo from overdue todos
            if (updatedOverdueTodo.dtstart && updatedOverdueTodo.dtstart >= startOfDay(new Date())) {
              return [];
            }
            return {
              completed: updatedOverdueTodo.completed,
              order: updatedOverdueTodo.order,
              pinned: updatedOverdueTodo.pinned,
              userID: updatedOverdueTodo.userID,
              id: updatedOverdueTodo.id,
              title: updatedOverdueTodo.title,
              description: updatedOverdueTodo.description,
              priority: updatedOverdueTodo.priority,
              due: updatedOverdueTodo.due,
              dtstart: updatedOverdueTodo.dtstart,
              rrule: updatedOverdueTodo.rrule,
              createdAt: new Date(),
              projectID: updatedOverdueTodo.projectID,
            };
          }
          return oldTodo;
        }),
      );

      // if todo is today, remove todo from overdue todos
      if (updatedOverdueTodo.dtstart && updatedOverdueTodo.dtstart >= startOfDay(new Date()) &&
         updatedOverdueTodo.dtstart <= endOfDay(new Date())
        ) 
      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) => [...oldTodos, updatedOverdueTodo])
        
      return { oldTodos };

    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["overdueTodo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editTodoMutateFn, editTodoStatus };
};
