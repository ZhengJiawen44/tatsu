import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
export const useDeleteCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationKey: ["deleteCalendarTodo"],
    mutationFn: async ({ id }: { id: string }) => {
      await api.DELETE({ url: `/api/todo/${id.split(":")[0]}` });
    },
    onMutate: async ({ id }: { id: string }) => {
      await queryClient.cancelQueries({
        queryKey: ["calendarTodo"],
      });
      const oldTodos = queryClient.getQueriesData({
        queryKey: ["calendarTodo"],
      });

      queryClient.setQueriesData<TodoItemType[]>(
        { queryKey: ["calendarTodo"] },
        (old) =>
          old?.filter((todo) => todo.id.split(":")[0] !== id.split(":")[0]),
      );
      return { oldTodos };
    },
    onError: (error, _, context) => {
      context?.oldTodos?.forEach(([key, data]) => {
        queryClient.setQueryData(key, data);
      });
      toast({
        description:
          error.message === "Failed to fetch"
            ? "failed to connect to server"
            : error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      // This mutation is still pending inside onSettled, so 1 means it is the last create in flight.
      if (queryClient.isMutating({ mutationKey: ["deleteCalendarTodo"] }) !== 1)
        return;
      toast({ description: "todo deleted" });
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendarTodo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["overdueTodo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
    },
  });
  return { deleteMutate, deletePending };
};
