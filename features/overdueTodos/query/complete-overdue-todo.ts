import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";
import { InfiniteQueryTodoData } from "./get-overdue-todo";

export const useCompleteOverdueTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: completeMutateFn, isPending: completePending } = useMutation({
    mutationFn: async (todoItem: TodoItemType) => {
      const todoId = todoItem.id.split(":")[0];
      if (todoItem.rrule) {
        await api.PATCH({
          url: `/api/todo/instance/${todoId}/complete`,
          body: JSON.stringify({
            ...todoItem,
            id: todoId,
            completed: !todoItem.completed,
          }),
        });
      } else {
        await api.PATCH({
          url: `/api/todo/${todoId}/complete`,
          body: JSON.stringify({
            ...todoItem,
            id: todoId,
            completed: !todoItem.completed,
          }),
        });
      }
    },
    onMutate: async (todoItem: TodoItemType) => {
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
              todos: page.todos.filter((todo) => todo.id !== todoItem.id),
            })),
          };
        },
      );

      return { oldDataBackup };
    },
    onError: (error, newTodo, context) => {
      toast({ description: error.message, variant: "destructive" });
      queryClient.setQueryData(["overdueTodo"], context?.oldDataBackup);
    },
    onSuccess: () => {},
    onSettled: () => {
      //optimistically update calendar todos
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({ queryKey: ["completedTodo"] });
    },
  });

  return { completeMutateFn, completePending };
};
