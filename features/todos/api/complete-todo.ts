import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
export const useCompleteTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: mutateCompleted,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      await api.PATCH({ url: `/api/todo/${id}?completed=${completed}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  useEffect(() => {
    if (isError) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);
  return { mutateCompleted, isPending };
};
