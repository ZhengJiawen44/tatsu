import { useErrorNotification } from "@/hooks/useErrorToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useCompleteTodo = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateCompleted,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      id,
      completed,
    }: {
      id: string;
      completed: boolean;
    }) => {
      const res = await fetch(`/api/todo/${id}?completed=${completed}`, {
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
  return { mutateCompleted, isPending };
};
