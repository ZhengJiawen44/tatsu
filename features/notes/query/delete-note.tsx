import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function deleteNote({ id }: { id: string }) {
  await api.DELETE({ url: `/api/note/${id}` });
}

export const useDeleteNote = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutate,
    isPending: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { id: string }) => deleteNote({ ...params }),
    onSuccess: () => {
      toast({ description: "note deleted" });
      queryClient.invalidateQueries({ queryKey: ["note"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  return { deleteMutate, deleteLoading, isSuccess };
};
