import { useErrorNotification } from "@/hooks/useErrorToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const usePrioritizeTodo = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutatePrioritize,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      id,
      level,
    }: {
      id: string;
      level: "Low" | "Medium" | "High";
    }) => {
      const res = await fetch(`/api/todo/${id}?priority=${level}`, {
        method: "PATCH",
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "server responded with error");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { mutatePrioritize, isPending };
};
