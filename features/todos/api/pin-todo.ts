import { useErrorNotification } from "@/hooks/useErrorToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export function usePinTodo() {
  const queryClient = useQueryClient();
  const {
    mutate: pinMutate,
    isPending: pinPending,
    error,
    isError,
  } = useMutation({
    mutationFn: async ({ id, pin }: { id: string; pin: boolean }) => {
      await fetch(`/api/todo/${id}?pin=${pin}`, { method: "PATCH" });
    },
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { pinMutate, pinPending };
}
