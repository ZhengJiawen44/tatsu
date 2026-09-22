import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoFormItemType, TodoItemType } from "@/types";
import { toValidDateRangeUpdateObject } from "@/lib/date/toValidDateRangeUpdateObject";

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

export const useEditPinnedTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoMutateFn, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoFormItemType) => patchTodo({ todo: params }),

    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      await queryClient.cancelQueries({ queryKey: ["pinnedTodo"] });

      const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);
      const oldPinnedTodos = queryClient.getQueryData<TodoItemType[]>([
        "pinnedTodo",
      ]);

      // update today/todo cache
      queryClient.setQueryData<TodoItemType[]>(["todo"], (oldTodos) =>
        oldTodos?.map((oldTodo) => {
          if (oldTodo.id === newTodo.id) {
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

      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["pinnedTodo"] },
        (oldTodos) =>
          oldTodos?.map((oldTodo) => {
            if (oldTodo.id === newTodo.id) {
              return {
                ...oldTodo,
                title: newTodo.title,
                description: newTodo.description,
                priority: newTodo.priority,
                due: newTodo.due,
                dtstart: newTodo.dtstart,
              };
            }
            return oldTodo;
          }),
        );
      return { oldTodos, oldPinnedTodos };
    },

    onError: (error, _, context) => {
      queryClient.setQueryData(["todo"], context?.oldTodos);
      queryClient.setQueryData(["pinnedTodo"], context?.oldPinnedTodos);

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
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
      queryClient.invalidateQueries({ queryKey: ["project"] });

    },
  });

  return { editTodoMutateFn, editTodoStatus };
};
