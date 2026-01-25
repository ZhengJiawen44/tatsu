import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";
export const useCompleteCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutateComplete, isPending } = useMutation({
    mutationFn: async ({ todoItem }: { todoItem: TodoItemType }) => {
      const todoId = todoItem.id.split(":")[0];
      const url = `/api/todo/${todoItem.id.split(":")[0]}/complete`;
      await api.PATCH({
        url,
        body: JSON.stringify({ ...todoItem, id: todoId }),
      });
    },
    onMutate: async ({ todoItem }: { todoItem: TodoItemType }) => {
      await queryClient.cancelQueries({ queryKey: ["todoCalendar"] });
      const oldTodos = queryClient.getQueryData(["todoCalendar"]);
      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["calendarTodo"] },
        (old) => old?.filter((todo) => todo.id !== todoItem.id),
      );
      return { oldTodos };
    },
    onError: (error, newTodo, context) => {
      toast({ description: error.message, variant: "destructive" });
      queryClient.setQueryData(["todo"], context?.oldTodos);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["completedTodo"],
      });
    },
  });

  return { mutateComplete, isPending };
};
