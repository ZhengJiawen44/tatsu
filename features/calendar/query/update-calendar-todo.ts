import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";

interface TodoItemTypeWithChecksum extends TodoItemType {
  dateRangeChecksum?: string;
  rruleChecksum?: string;
}

async function patchCalendarTodo({
  dateRangeChecksum,
  rruleChecksum,
  ...todo
}: TodoItemTypeWithChecksum) {
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

  const rruleChanged = rruleChecksum !== todo.rrule;
  const dateChanged =
    dateRangeChecksum !==
    todo.dtstart.toISOString() + "" + todo.due.toISOString();

  await api.PATCH({
    url: `/api/todo/${todo.id.split(":")[0]}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...parsedObj.data,
      instanceDate: todo.instanceDate?.getTime(),
      rruleChanged,
      dateChanged,
    }),
  });
}

export const useEditCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editCalendarTodo, status: editTodoStatus } = useMutation({
    mutationFn: (params: TodoItemTypeWithChecksum) => patchCalendarTodo(params),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({
        queryKey: ["calendarTodo"],
      });
      const oldTodos = queryClient.getQueriesData({
        queryKey: ["calendarTodo"],
      });
      queryClient.setQueriesData<TodoItemType[]>(
        {
          queryKey: ["calendarTodo"],
        },
        (oldTodos) =>
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
                createdAt: new Date(),
              };
            }
            return oldTodo;
          }),
      );
      return { oldTodos };
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["calendarTodo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
    },
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["calendarTodo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editCalendarTodo, editTodoStatus };
};
