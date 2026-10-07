import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";
export const useCompleteCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutateComplete, isPending } = useMutation({
    mutationKey: ["completeCalendarTodo"],
    mutationFn: async ({ todoItem }: { todoItem: TodoItemType }) => {
      const todoId = todoItem.id.split(":")[0];
      const url = `/api/todo/${todoItem.id.split(":")[0]}/complete`;
      await api.PATCH({
        url,
        body: JSON.stringify({ ...todoItem, id: todoId }),
      });
    },
    onMutate: async ({ todoItem }: { todoItem: TodoItemType }) => {
      await queryClient.cancelQueries({ queryKey: ["calendarTodo"] });
      const oldTodos = queryClient.getQueriesData({queryKey:["calendarTodo"]});
      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["calendarTodo"] },
        (old) => old?.filter((todo) => todo.id !== todoItem.id),
      );
      return { oldTodos };
    },
    onError: (error, newTodo, context) => {
      toast({ description: error.message, variant: "destructive" });
      context?.oldTodos?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
    },
    onSettled: () => {
      if (queryClient.isMutating({ mutationKey: ["completeCalendarTodo"] }) !== 1) 
        return;
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["completedTodo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["overdueTodo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
    },
  });

  return { mutateComplete, isPending };
};
