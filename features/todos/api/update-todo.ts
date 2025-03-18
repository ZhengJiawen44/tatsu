import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { api } from "@/lib/api-client";
import { endOfDay } from "date-fns";
import { todoSchema } from "@/schema";
async function patchTodo({
  id,
  title,
  desc,
  priority,
  dateRange,
}: {
  id: string;
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

  if (!id) {
    throw new Error("this todo is missing");
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
    console.log(parsedObj.error.errors[0]);
    return;
  }
  await api.PATCH(
    `/api/todo/${id}`,
    { "Content-Type": "application/json" },
    JSON.stringify(parsedObj.data)
  );
}

export const useEditTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editTodo,
    isPending: editLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      id: string;
      title: string;
      desc?: string;
      priority: "Low" | "Medium" | "High";
      dateRange?: DateRange;
    }) => patchTodo(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message });
    },
  });
  return { editTodo, editLoading, isSuccess };
};
