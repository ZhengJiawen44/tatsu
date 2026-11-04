import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";
export const useCompleteProjectTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: completeMutateFn, isPending: completePending } = useMutation({
    mutationKey: ["completeProjectTodo"],
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
      await queryClient.cancelQueries({ queryKey: ["projectTodo"] });
      const oldTodos = queryClient.getQueryData([
        "projectTodo",
      ]) as TodoItemType[];
      queryClient.setQueryData(
        ["projectTodo", todoItem.projectID],
        (oldTodos: TodoItemType[]) => {
          return oldTodos.flatMap((oldTodo) => {
            if (oldTodo.id === todoItem.id) return [];
            return [oldTodo];
          });
        },
      );
      return { oldTodos };
    },
    onError: (error, newTodo, context) => {
      toast({ description: error.message, variant: "destructive" });
      queryClient.setQueryData(["projectTodo"], context?.oldTodos);
    },
    onSuccess: () => {},
    onSettled: () => {
      if (
        queryClient.isMutating({ mutationKey: ["completeProjectTodo"] }) !== 1
      )
        return;
      //optimistically update calendar todos
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({ queryKey: ["completedTodo"] });
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({ queryKey: ["projectTodo"] });
    },
  });

  return { completeMutateFn, completePending };
};
