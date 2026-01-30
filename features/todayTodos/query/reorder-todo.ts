import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";

export type changeMapType = {
  id: string;
  order: number;
};

export const useReorderTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: reorderMutateFn, isPending: reorderPending } = useMutation({
    mutationFn: async (changeMap: changeMapType[]) => {
      changeMap = changeMap.map(({ id, order }) => {
        const todoId = id.split(":")[0];
        return { id: todoId, order };
      });

      await api.PATCH({
        url: "/api/todo/reorder",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changeMap),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { reorderMutateFn, reorderPending };
};
