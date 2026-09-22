import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { todoInstanceSchema } from "@/schema";
import { TodoItemType } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";


async function patchTodo({ ghostTodo }: { ghostTodo: TodoItemType }) {
  //validate input for the ghost todo
  const parsedObj = todoInstanceSchema.safeParse({
    title: ghostTodo.title,
    description: ghostTodo.description,
    priority: ghostTodo.priority,
    dtstart: ghostTodo.dtstart,
    due: ghostTodo.due,
    // instances cannot have different rrule from master
    rrule: null,
    instanceDate: ghostTodo.instanceDate,
  });
  if (!parsedObj.success) {
    console.error(parsedObj.error.errors[0]);
    return;
  }
  const todoId = ghostTodo.id.split(":")[0];

  await api.PATCH({
    url: `/api/todo/instance/${todoId}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...parsedObj.data, id: todoId }),
  });
}

export const useEditPinnedTodoInstance = (
  setEditInstanceOnly:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined,
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoInstanceMutateFn, status: editTodoInstanceStatus } =
    useMutation({
      mutationFn: (ghostTodo: TodoItemType) => patchTodo({ ghostTodo }),

      onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ["todo"] });
        await queryClient.cancelQueries({ queryKey: ["pinnedTodo"] });

        const oldTodos = queryClient.getQueryData<TodoItemType[]>(["todo"]);
        const oldPinnedTodos = queryClient.getQueryData<TodoItemType[]>([
          "pinnedTodo",
        ]);

        // update todo cache
        queryClient.setQueryData<TodoItemType[]>(["todo"], (oldTodos) =>
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

      onSettled: () => {
        if (setEditInstanceOnly) setEditInstanceOnly(false);
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
        queryClient.invalidateQueries({ queryKey: ["todo"] });
        queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
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
    });

  return { editTodoInstanceMutateFn, editTodoInstanceStatus };
};
