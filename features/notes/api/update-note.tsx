import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
async function patchNote({ id, content }: { id: string; content?: string }) {
  if (!id) {
    throw new Error("this Note is missing");
  }

  await api.PATCH({
    url: `/api/note/${id}`,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ content }),
  });
}

export const useEditNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editNote,
    isPending: editLoading,
    isSuccess,
    isError,
  } = useMutation({
    mutationFn: (params: { id: string; content?: string | undefined }) =>
      patchNote({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editNote, editLoading, isSuccess, isError };
};
