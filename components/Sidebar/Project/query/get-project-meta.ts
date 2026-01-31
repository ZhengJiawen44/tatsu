import { NoteItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";

export const useProjectMeta = () => {
  const { toast } = useToast();
  const {
    data: projectMeta = [],
    isLoading: projectMetaLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<NoteItemType[]>({
    queryKey: ["projectMeta"],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { projects } = await api.GET({ url: `/api/project` });
      return projects;
    },
  });

  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
  }, [isError]);
  return { projectMeta, projectMetaLoading, isFetching, isPending };
};
