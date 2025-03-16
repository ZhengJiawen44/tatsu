import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { postNote } from "@/lib/note/postNote";
import { NoteItemType } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useCreateNote = ({
  onSuccess,
}: {
  onSuccess?: (newNote: NoteItemType) => void;
}) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createNote,
    isPending: createLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { name: string; content?: string }) =>
      postNote({ ...params, toast }),
    onSuccess: (newNote: NoteItemType) => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      onSuccess && onSuccess(newNote);
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { createNote, createLoading, isSuccess };
};
