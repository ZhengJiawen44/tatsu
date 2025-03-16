import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { patchTodo } from "@/lib/todo/patchTodo";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export const useEditTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editTodo,
    isPending: editLoading,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: (params: {
      id: string;
      title: string;
      desc?: string;
      priority: "Low" | "Medium" | "High";
      dateRange?: DateRange;
    }) => patchTodo({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { editTodo, editLoading, isSuccess };
};
