import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  const { mutate: deleteMutate, isPending: deletePending } = useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const res = await fetch(`/api/todo/${id}`, { method: "DELETE" });
    },
    mutationKey: ["todo"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  return { deleteMutate, deletePending };
};
