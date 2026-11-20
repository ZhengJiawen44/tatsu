import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Page } from "@/types";

async function deletePage({ id }: { id: string }) {
  const { page } = await api.DELETE({
    url: `/api/page/${id}`,
  });
  return page;
}

export const useDeletePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: deleteMutateFn,
    isPending: deleteLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { id: string }) => deletePage({ ...params }),
    onMutate: (newPage: Partial<Page>) => {
      queryClient.cancelQueries({ queryKey: "page" });
      const backupPage = queryClient.getQueryData(["page"]);

      queryClient.setQueryData<Page[]>(["page"], (pages) => {
        if (!pages) return pages;
        return pages.flatMap((page: Page) => {
          if (page.id !== newPage.id) return [page];
          return [];
        });
      });

      return backupPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { deleteMutateFn, deleteLoading, isSuccess };
};
