import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function deleteProject({ id }: { id: string }) {
  await api.DELETE({ url: `/api/project/${id}` });
}

export const useDeleteProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutateFn,
    isPending: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { id: string }) => deleteProject({ ...params }),
    onSuccess: () => {
      toast({ description: "project deleted" });
      queryClient.invalidateQueries({ queryKey: ["projectMeta"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  return { deleteMutateFn, deleteLoading, isSuccess };
};
