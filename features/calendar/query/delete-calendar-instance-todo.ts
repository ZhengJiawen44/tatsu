import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
export const useDeleteCalendarInstanceTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteInstanceMutate, isPending: deleteInstancePending } =
    useMutation({
      mutationFn: async (todo: TodoItemType) => {
        await api.DELETE({
          url: `/api/calendar/todo/instance/${todo.id.split(":")[0]}?instanceDate=${todo.instanceDate!.getTime()}`,
        });
      },
      onMutate: async (todo: TodoItemType) => {
        await queryClient.cancelQueries({
          queryKey: ["calendarTodo"],
        });
        const oldTodos = queryClient.getQueriesData({
          queryKey: ["calendarTodo"],
        });

        queryClient.setQueriesData<TodoItemType[]>(
          { queryKey: ["calendarTodo"] },
          (old) =>
            old?.filter(
              (oldTodo) => todo.instanceDate !== oldTodo.instanceDate,
            ),
        );
        return { oldTodos };
      },
      mutationKey: ["calendarTodo"],
      onError: (error, _, context) => {
        queryClient.setQueryData(["todo"], context?.oldTodos);
        toast({
          description:
            error.message === "Failed to fetch"
              ? "failed to connect to server"
              : error.message,
          variant: "destructive",
        });
      },
      onSettled: () => {
        toast({ description: "todo deleted" });
        queryClient.invalidateQueries({
          queryKey: ["todo"],
        });
        queryClient.invalidateQueries({
          queryKey: ["calendarTodo"],
        });
      },
    });
  return { deleteInstanceMutate, deleteInstancePending };
};
