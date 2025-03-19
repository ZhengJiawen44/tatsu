import { useToast } from "@/hooks/use-toast";
import { NoteItemType } from "@/types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function postNote({ name, content }: { name: string; content?: string }) {
  const { note } = await api.POST({
    url: "/api/note",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, content }),
  });
  return note;
}

export const useCreateNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createNote,
    isPending: createLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { name: string; content?: string }) =>
      postNote({ ...params }),
    onSuccess: (newNote: NoteItemType) => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { createNote, createLoading, isSuccess };
};
