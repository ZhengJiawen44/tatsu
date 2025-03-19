import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
export async function deleteVault({ id }: { id: string }) {
  await api.DELETE({ url: `/api/vault/${id}` });
}

export const useDeleteFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: (params: { id: string }) => deleteVault({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  return { deleteMutate, deletePending };
};
