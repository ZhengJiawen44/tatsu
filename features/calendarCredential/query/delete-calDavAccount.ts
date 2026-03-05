import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function deleteCalDavAccount() {
  const res = await api.DELETE({
    url: `/api/calDav/account`,
  });
  return res;
}

export const useDeleteCalDavAccount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: deleteMutateFn, status: deleteStatus } = useMutation({
    mutationFn: () => deleteCalDavAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calDavAccount"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { deleteMutateFn, deleteStatus };
};
