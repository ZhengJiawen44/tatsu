import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ProjectItemMetaMapType, ProjectItemMetaType } from "@/types";

async function postProject({ name }: { name: string }) {
  const { project } = await api.POST({
    url: "/api/project",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name }),
  });
  return project;
}

export const useCreateProject = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createMutateFn,
    isPending: createLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { name: string; content?: string }) =>
      postProject({ ...params }),
    onMutate: (newProjectMeta: Omit<ProjectItemMetaType, "id">) => {
      queryClient.cancelQueries({ queryKey: "projectMetaData" });
      const backupProjectMeta = queryClient.getQueryData([
        "projectMetaDataData",
      ]);

      queryClient.setQueryData(
        ["projectMeta"],
        (projectMetaMap: ProjectItemMetaMapType) => {
          return {
            ...projectMetaMap,
            "-1": { ...newProjectMeta, createdAt: new Date() },
          };
        },
      );

      return backupProjectMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectMetaData"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { createMutateFn, createLoading, isSuccess };
};
