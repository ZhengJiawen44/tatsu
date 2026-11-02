import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/lib/api-client";
import { Page } from "@/types";

export const usePage = () => {
  const { toast } = useToast();
  const {
    data: pages = [],
    isLoading: pagesLoading,
    isError,
    error,
    isFetching,
    isPending,
  } = useQuery<Page[]>({
    queryKey: ["page"],
    retry: 2,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {
      const { pages }: { pages: Page[] } = await api.GET({
        url: `/api/page`,
      });
      return pages;
    },
  });

  useEffect(() => {
    if (isError === true) {
      toast({ description: error.message, variant: "destructive" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError]);
  return { pages, pagesLoading, isFetching, isPending };
};
