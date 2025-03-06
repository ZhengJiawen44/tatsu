import { NoteItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "./useErrorToast";
import { useMutation } from "@tanstack/react-query";
import { postNote } from "@/lib/note/postNote";
import { patchNote } from "@/lib/note/patchNote";
import { useToast } from "./use-toast";
import { renameNote } from "@/lib/note/renameNote";
import { deleteNote } from "@/lib/note/deleteNote";

export const useNote = (enabled?: boolean) => {
  //get Notes
  const {
    data: notes = [],
    isLoading: notesLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<NoteItemType[]>({
    queryKey: ["note"],
    queryFn: async () => {
      const res = await fetch(`/api/note`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.message || `error ${res.status}: failed to get Ntes`
        );
      const { notes } = data;
      if (!notes) {
        throw new Error(
          data.message || `bad server response: Did not recieve notes`
        );
      }
      return notes;
    },
    enabled: enabled || false,
  });

  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { notes, notesLoading, isFetching, isPending };
};

// patch note
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

//rename note
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

//delete note
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

//post Note
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
