import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ProjectItemType } from "@/types";

async function recolorProject({
  id,
  color,
}: {
  id: string;
  color: ProjectItemType["color"];
}) {
  if (!id) {
    throw new Error("this Project is missing");
  }
  if (!color) throw new Error("Color is missing");

  if (color.trim().length <= 0) {
    throw new Error("project color cannot be empty");
  }
  await api.PATCH({
    url: `/api/project/${id}`,
    body: JSON.stringify({ color }),
  });
}

export const useRecolorProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: recolorMutateFn,
    isPending: recolorLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { id: string; color: ProjectItemType["color"] }) =>
      recolorProject({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectMetaData"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  return { recolorMutateFn, recolorLoading, isSuccess };
};
