import { ProjectItemMetaType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { ProjectItemMetaMapType } from "@/types";

export const useProjectMetaData = () => {
  const { toast } = useToast();
  const {
    data: projectMetaData = {},
    isLoading: projectMetaLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<ProjectItemMetaMapType>({
    queryKey: ["projectMetaData"],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { projects }: { projects: ProjectItemMetaType[] } = await api.GET({
        url: `/api/project`,
      });

      const projectMap = Object.fromEntries(
        projects.map(({ id, ...rest }) => [id, rest]),
      );
      return projectMap;
    },
  });

  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);
  return { projectMetaData, projectMetaLoading, isFetching, isPending };
};
