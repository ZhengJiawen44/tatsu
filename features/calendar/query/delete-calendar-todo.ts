import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
export const useDeleteCalendarTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
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
      queryClient.invalidateQueries({
        queryKey: ["todo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendarTodo"],
      });
    },
  });
  return { deleteMutate, deletePending };
};
