import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
export const useDeleteTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await api.DELETE(`/api/todo/${id}`);
    },
    mutationKey: ["todo"],
    onError: (error) => {
      toast({
        description:
          error.message === "Failed to fetch"
            ? "failed to connect to server"
            : error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  return { deleteMutate, deletePending };
};
