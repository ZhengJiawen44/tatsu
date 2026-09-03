import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoFormItemType, TodoItemType } from "@/types";
import { endOfDay } from "date-fns";

async function patchTodo({ todo }: { todo: TodoFormItemType }) {
  if (!todo.id) {
    throw new Error("this todo is missing");
  }

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

  const todoId = todo.id.split(":")[0];

  await api.PATCH({
    url: `/api/todo/${todoId}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...parsedObj.data,
      id: todoId,
      instanceDate: todo.instanceDate,
      dtstart: dtstartChanged ? todo.dtstart : undefined,
      due: dueChanged ? todo.due : undefined,
      rrule: rruleChanged ? todo.rrule : undefined,
      projectID: todo.projectID,
    }),
  });
}

export const useEditProjectTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoMutateFn, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoFormItemType) => patchTodo({ todo: params }),

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      await queryClient.cancelQueries({ queryKey: ["project"] });

      const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);
      const oldProjectTodos = queryClient.getQueryData<TodoItemType[]>([
        "project",
      ]);

      // update today/todo cache
      queryClient.setQueryData<TodoItemType[]>(["todo"], (oldTodos) =>
        oldTodos?.flatMap((oldTodo) => {
          if (oldTodo.id === newTodo.id) {
            if (newTodo.dtstart && newTodo.dtstart > endOfDay(new Date())) {
              return [];
            }
            return {
              ...oldTodo,
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
              projectID: newTodo.projectID,
              createdAt: new Date(),
            };
          }
          return oldTodo;
        }),
      );

      // update project cache
      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["project"] },
        (oldTodos) =>
          oldTodos?.map((oldTodo) => {
            if (oldTodo.id === newTodo.id) {
              return {
                ...oldTodo,
                ...newTodo,
              };
            }
            return oldTodo;
          }),
      );

      return { oldTodos, oldProjectTodos };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(["todo"], context?.oldTodos);
      queryClient.setQueryData(["project"], context?.oldProjectTodos);

      toast({
        description:
          error.message === "Failed to fetch"
            ? "failed to connect to server"
            : error.message,
        variant: "destructive",
      });
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
    },
  });

  return { editTodoMutateFn, editTodoStatus };
};
