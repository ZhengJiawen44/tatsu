import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { ProjectItemMetaType } from "@/types";

async function postProject({
  name,
  content,
}: {
  name: string;
  content?: string;
}) {
  const { project } = await api.POST({
    url: "/api/project",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ name, content }),
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
      queryClient.cancelQueries({ queryKey: "projectMeta" });
      const backupProjectMeta = queryClient.getQueryData(["projectMeta"]);

      queryClient.setQueryData(
        ["projectMeta"],
        (projectMetaList: ProjectItemMetaType[]) => {
          return [...projectMetaList, newProjectMeta];
        },
      );

      return backupProjectMeta;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projectMeta"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { createMutateFn, createLoading, isSuccess };
};
