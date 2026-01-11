import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { CalendarTodoItemType } from "@/types";
export const useDeleteCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await api.DELETE({ url: `/api/calendar/todo/${id}` });
    },
    onMutate: async ({ id }: { id: string }) => {
      await queryClient.cancelQueries({
        queryKey: ["calendarTodo"],
      });
      const oldTodos = queryClient.getQueriesData({
        queryKey: ["calendarTodo"],
      });

      queryClient.setQueriesData<CalendarTodoItemType[]>(
        { queryKey: ["calendarTodo"] },
        (old) => old?.filter((todo) => todo.id !== id),
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
    },
  });
  return { deleteMutate, deletePending };
};
