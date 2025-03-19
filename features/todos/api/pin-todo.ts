import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export function usePinTodo() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: pinMutate, isPending: pinPending } = useMutation({
    mutationFn: async ({ id, pin }: { id: string; pin: boolean }) => {
      await api.PATCH({ url: `/api/todo/${id}?pin=${pin}` });
    },
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { pinMutate, pinPending };
}
