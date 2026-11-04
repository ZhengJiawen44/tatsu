import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Page } from "@/types";

async function patchPage({
  id,
  title,
  from,
  to,
}: {
  id: string;
  title?: string;
  from?: Date;
  to?: Date;
}) {
  const { page } = await api.PATCH({
    url: `/api/page/${id}`,
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title, from, to }),
  });
  return page;
}

export const useUpdatePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: updateMutateFn,
    isPending: updateLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      id: string;
      title?: string;
      from?: Date;
      to?: Date;
    }) => patchPage({ ...params }),
    onMutate: (newPage: Partial<Page>) => {
      queryClient.cancelQueries({ queryKey: "page" });
      const backupPage = queryClient.getQueryData(["page"]);

      queryClient.setQueryData<Page[]>(["page"], (pages) => {
        if (!pages) return pages;
        return pages.map((page: Page) => {
          if (page.id !== newPage.id) return page;
          const patch = Object.fromEntries(
            Object.entries(newPage).filter(([, v]) => v !== undefined),
          );
          return { ...page, ...patch };
        });
      });

      return backupPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page"] });
      queryClient.invalidateQueries({ queryKey: ["pageTodos"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { updateMutateFn, updateLoading, isSuccess };
};
