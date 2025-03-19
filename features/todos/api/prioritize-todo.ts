import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export const usePrioritizeTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutatePrioritize, isPending } = useMutation({
    mutationFn: async ({
      id,
      level,
    }: {
      id: string;
      level: "Low" | "Medium" | "High";
    }) => {
      await api.PATCH({ url: `/api/todo/${id}?priority=${level}` });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { mutatePrioritize, isPending };
};
