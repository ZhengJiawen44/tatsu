import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { Page } from "@/types";

async function postPage({ title, from, to }: { title: string, from: Date, to: Date }) {
  const { page } = await api.POST({
    url: "/api/page",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title, from, to }),
  });
  return page;
}

export const useCreatePage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createMutateFn,
    isPending: createLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { title: string; from: Date, to:Date }) =>
      postPage({ ...params }),
    onMutate: (newPage: Omit<Page,"id">) => {
      queryClient.cancelQueries({ queryKey: "page" });
      const backupPage = queryClient.getQueryData([
        "page",
      ]);

      queryClient.setQueryData<Page[]>(
        ["page"],
        (page) => {
          if(!page)
            return page
          return [...page, {...newPage, id:crypto.randomUUID()}]
        },
      );

      return backupPage;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["page"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { createMutateFn, createLoading, isSuccess };
};
