import { NoteItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "./useErrorToast";
import { useMutation } from "@tanstack/react-query";
import { patchNote } from "@/lib/note/patchNote";
import { postTodo } from "@/lib/todo/postTodo";
import { useToast } from "./use-toast";
import { renameNote } from "@/lib/note/renameNote";
import { deleteNote } from "@/lib/note/deleteNote";
export const useNote = () => {
  //get Notes
  const {
    data: notes = [],
    isLoading: notesLoading,
    isError,
    error,
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
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { notes, notesLoading };
};

//patch note
// export const useEditNote = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();

//   const {
//     mutate: editNote,
//     isPending: editLoading,
//     isSuccess,
//     isError,
//     error,
//   } = useMutation({
//     mutationFn: (params: { id: string; title: string; desc?: string }) =>
//       patchNote({ ...params, toast }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["note"] });
//     },
//   });
//   useErrorNotification(
//     isError,
//     error?.message || "an unexpectedd error happened"
//   );
//   return { editNote, editLoading, isSuccess };
// };

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

// //post todo
// export const useCreateTodo = () => {
//   const { toast } = useToast();
//   const queryClient = useQueryClient();
//   const {
//     mutate: createTodo,
//     isPending: createLoading,
//     isError,
//     error,
//     isSuccess,
//   } = useMutation({
//     mutationFn: (params: { title: string; desc?: string }) =>
//       postTodo({ ...params, toast }),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["todo"] });
//     },
//   });
//   useErrorNotification(
//     isError,
//     error?.message || "an unexpectedd error happened"
//   );
//   return { createTodo, createLoading, isSuccess };
// };
