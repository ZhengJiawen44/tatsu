import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";
import { endOfDay } from "date-fns";
import { InfiniteQueryTodoData } from "./get-overdue-todo";

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
  });

  if (!parsedObj.success) {
    console.log(parsedObj.error.errors[0]);
    return;
  }

  const dateChanged =
    todo.dateRangeChecksum !==
    todo.dtstart.toISOString() + todo.due.toISOString();
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

      const oldDataBackup = queryClient.getQueryData<InfiniteQueryTodoData>([
        "overdueTodo",
      ]);

      queryClient.setQueryData<InfiniteQueryTodoData>(
        ["overdueTodo"],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              todos: page.todos.flatMap((oldTodo) => {
                if (oldTodo.id === newTodo.id) {
                  // Remove if moved to future
                  if (newTodo.dtstart > endOfDay(new Date())) {
                    return [];
                  }
                  return [
                    {
                      ...oldTodo, // Keep all existing properties
                      completed: newTodo.completed,
                      order: newTodo.order,
                      pinned: newTodo.pinned,
                      title: newTodo.title,
                      description: newTodo.description,
                      priority: newTodo.priority,
                      due: newTodo.due,
                      dtstart: newTodo.dtstart,
                      rrule: newTodo.rrule,
                    },
                  ];
                }
                return [oldTodo];
              }),
            })),
          };
        },
      );

      return { oldDataBackup };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
    },
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["overdueTodo"], context?.oldDataBackup);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editTodoMutateFn, editTodoStatus };
};
