import { useErrorNotification } from "@/hooks/useErrorToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";

export const useReorderTodo = () => {
  const queryClient = useQueryClient();
  const {
    mutate: mutateReorder,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({
      body,
    }: {
      body: Record<"changedTodos", { id: string; order: number }[]>;
    }) => {
      const res = await fetch("/api/todo/reorder", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const body = await res.json();
        throw new Error(body.message || "server responded with error");
      }
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { mutateReorder, isPending };
};
