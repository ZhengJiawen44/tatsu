import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";
import { endOfDay } from "date-fns";

export interface TodoItemTypeWithDateChecksum extends TodoItemType {
  dateRangeChecksum: string;
  rruleChecksum: string | null;
}
async function patchTodo({ todo }: { todo: TodoItemTypeWithDateChecksum }) {
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
  const dateChanged =
    todo.dateRangeChecksum !==
    `${todo.dtstart?.toISOString() ?? "null"}-${todo.due?.toISOString() ?? "null"}`;

  const rruleChanged = todo.rruleChecksum !== todo.rrule;

  const todoId = todo.id.split(":")[0];
  await api.PATCH({
    url: `/api/todo/${todoId}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...parsedObj.data,
      id: todoId,
      instanceDate: todo.instanceDate,
      dateChanged,
      rruleChanged,
      projectID: todo.projectID,
    }),
  });
}

export const useEditOverdueTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoMutateFn, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoItemTypeWithDateChecksum) =>
      patchTodo({ todo: params }),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });
      const oldTodos = queryClient.getQueryData<TodoItemType[]>([
        "overdueTodo",
      ]);

      queryClient.setQueryData(["overdueTodo"], (oldTodos: TodoItemType[]) =>
        oldTodos.flatMap((oldTodo) => {
          if (oldTodo.id === newTodo.id) {
            if (newTodo.dtstart && newTodo.dtstart > endOfDay(new Date())) {
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
              projectID: newTodo.projectID,
            };
          }
          return oldTodo;
        }),
      );
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
