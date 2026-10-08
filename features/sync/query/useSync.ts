import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

async function syncCalDavAccount(service: string) {
  const res = await fetch(`/api/calDav/sync?service=${service}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
  });

  const body = await res.json();

  if (!res.ok) {
    throw new Error(body.message || "Sync failed");
  }

  return body;
}

export const useSyncCalDavAccount = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutateAsync: syncMutateAsync,
    status: syncStatus,
    error,
  } = useMutation({
    mutationFn: ({ service }: { service: string }) =>
      syncCalDavAccount(service),

    onSuccess: () => {
      toast({ description: "Synced successfully" });
    },
    onSettled:()=>{
      queryClient.invalidateQueries({queryKey: ["todo"]})
      queryClient.invalidateQueries({queryKey: ["overdueTodo"]})
      queryClient.invalidateQueries({queryKey: ["calendarTodo"]})
      queryClient.invalidateQueries({queryKey: ["project"]})
      queryClient.invalidateQueries({queryKey: ["caldavCalendar"]})

    },

    onError: (error: Error) => {
      toast({
        variant: "destructive",
        description: error.message,
      });
    },
  });

  return { syncMutateAsync, syncStatus, error };
};
