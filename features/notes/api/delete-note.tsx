import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { deleteNote } from "@/lib/note/deleteNote";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useDeleteNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: deleteMutate,
    isPending: deleteLoading,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: { id: string }) => deleteNote({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { deleteMutate, deleteLoading, isSuccess };
};
