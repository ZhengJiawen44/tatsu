import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function renameNote({ id, name }: { id: string; name: string }) {
  if (!id) {
    throw new Error("this Note is missing");
  }
  //final line of defense
  if (name.trim().length <= 0) {
    throw new Error("note name cannot be empty");
  }

  await api.PATCH({ url: `/api/note/${id}?rename=${name}` });
}

export const useRenameNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: renameMutate,
    isPending: renameLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { id: string; name: string }) =>
      renameNote({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  return { renameMutate, renameLoading, isSuccess };
};
