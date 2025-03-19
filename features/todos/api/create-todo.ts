import { useToast } from "@/hooks/use-toast";
import { useErrorNotification } from "@/hooks/useErrorToast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { endOfDay } from "date-fns";
import { todoSchema } from "@/schema";
import { api } from "@/lib/api-client";

async function postTodo({
  title,
  desc,
  priority,
  dateRange,
}: {
  title: string;
  desc?: string;
  priority: "Low" | "Medium" | "High";
  dateRange?: DateRange;
}) {
  // if date picker value is undefined.
  if (!dateRange) {
    const today = new Date();
    dateRange = { to: today, from: endOfDay(today) };
  }

  //if end date is undefined
  if (!dateRange.to && dateRange.from) {
    dateRange.to = endOfDay(dateRange.from);
  }

  //if start date is undefined
  if (!dateRange.from) {
    dateRange.from = new Date();
    dateRange.to = endOfDay(dateRange.from);
  }

  //validate input
  const parsedObj = todoSchema.safeParse({
    title,
    description: desc,
    priority,
    startedAt: dateRange.from,
    expiresAt: dateRange.to,
  });

  if (!parsedObj.success) {
    throw new Error(parsedObj.error.errors[0].message);
  }

  await api.POST({
    url: "/api/todo",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });
}

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
    }) => postTodo({ ...params }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { createTodo, createLoading, isSuccess };
};
