import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";

async function postFeedback({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  await api.POST({
    url: "/api/feedback",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ title, description }),
  });
}
export const useCreateFeedback = () => {
  const { toast } = useToast();
  const {
    mutate: createMutateFn,
    isPending: createLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: { title: string; description?: string }) =>
      postFeedback({ ...params }),
    onSuccess: () => {
      toast({ description: "Feedback Sent!" });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { createMutateFn, createLoading, isSuccess };
};
