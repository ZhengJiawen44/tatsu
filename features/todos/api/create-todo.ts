import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { postTodo } from "@/lib/todo/postTodo";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";

export const useCreateTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createTodo,
    isPending: createLoading,
    isError,
    error,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      title: string;
      desc?: string;
      priority: "Low" | "Medium" | "High";
      dateRange?: DateRange;
    }) => postTodo({ ...params, toast }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { createTodo, createLoading, isSuccess };
};
