import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function resyncCalDavAccount() {
  const res = await api.POST({
    url: `/api/calDav/sync`,
  });
  return res;
}

export const useResyncCalDavAccount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: resyncMutateFn, status: resyncStatus } = useMutation({
    mutationFn: () => resyncCalDavAccount(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });

      toast({ description: "Resync successful" });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { resyncMutateFn, resyncStatus };
};
