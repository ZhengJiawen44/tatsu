import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { postVault } from "@/lib/vault/postVault";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateFile = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createFile,
    isPending: createLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      file: File;
      symKey?: string;
      enableEncryption: boolean;
    }) => postVault({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
      queryClient.invalidateQueries({ queryKey: ["storageMetric"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { createFile, createLoading, isSuccess };
};
