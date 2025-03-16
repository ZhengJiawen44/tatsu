import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { deleteVault } from "@/lib/vault/deleteVault";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutate,
    isPending: deletePending,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: { id: string }) => deleteVault({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { deleteMutate, deletePending };
};
