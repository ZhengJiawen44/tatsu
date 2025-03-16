import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { patchNote } from "@/lib/note/patchNote";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useEditNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editNote,
    isPending: editLoading,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: { id: string; content?: string | undefined }) =>
      patchNote({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );

  return { editNote, editLoading, isSuccess, isError };
};
