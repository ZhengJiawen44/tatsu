import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function renameProject({ id, name }: { id: string; name: string }) {
  if (!id) {
    throw new Error("this Note is missing");
  }
  if (name.trim().length <= 0) {
    throw new Error("project name cannot be empty");
  }
  await api.PATCH({
    url: `/api/project/${id}`,
    body: JSON.stringify({ name }),
  });
}

export const useRenameProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: renameMutateFn,
    isPending: renameLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { id: string; name: string }) =>
      renameProject({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectMeta"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  return { renameMutateFn, renameLoading, isSuccess };
};
