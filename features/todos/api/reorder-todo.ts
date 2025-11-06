import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export const useReorderTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutateReorder, isPending } = useMutation({
    mutationFn: async ({
      body,
    }: {
      body: Record<"changedTodos", { id: string; order: number }[]>;
    }) => {
      await api.PATCH({
        url: "/api/todo/reorder",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { mutateReorder, isPending };
};
