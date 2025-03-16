import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { renameNote } from "@/lib/note/renameNote";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useRenameNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: renameMutate,
    isPending: renameLoading,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: { id: string; name: string }) =>
      renameNote({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { renameMutate, renameLoading, isSuccess };
};
