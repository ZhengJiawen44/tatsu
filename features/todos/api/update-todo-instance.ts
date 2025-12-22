import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";

async function patchTodo({ todo }: { todo: TodoItemType }) {
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
    url: `/api/todo/instance/${todo.id}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });
}

export const useEditTodoInstance = (
  setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editTodoInstance,
    isPending: editLoading,
    isError,
  } = useMutation({
    mutationFn: (params: TodoItemType) => patchTodo({ todo: params }),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const oldTodos = queryClient.getQueryData(["todo"]);

      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === newTodo.id) {
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
    onSettled: () => {
      setEditInstanceOnly(false);
      // queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["todo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editTodoInstance, editLoading, isError };
};
