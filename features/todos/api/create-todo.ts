import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
import { endOfDay } from "date-fns";
import { todoSchema } from "@/schema";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";
import { SetStateAction } from "react";

interface useCreateTodoProps {
  setTitle: React.Dispatch<SetStateAction<string>>;
  setDesc: React.Dispatch<SetStateAction<string>>;
  setDateRange: React.Dispatch<SetStateAction<DateRange | undefined>>;
  setPriority: React.Dispatch<SetStateAction<"Low" | "Medium" | "High">>;
  clearInput: Function;
}

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

export const useCreateTodo = ({
  setTitle,
  setDesc,
  setDateRange,
  setPriority,
  clearInput,
}: useCreateTodoProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {
    mutate: createTodo,
    isPending: createLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: {
      title: string;
      desc?: string;
      priority: "Low" | "Medium" | "High";
      dateRange?: DateRange;
    }) => postTodo({ ...params }),
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const oldTodos = queryClient.getQueryData(["todo"]);

      queryClient.setQueryData(["todo"], (old: TodoItemType[]) => [
        ...old,
        {
          id: crypto.randomUUID(),
          title: newTodo.title,
          description: newTodo.desc,
          priority: newTodo.priority,
          createdAt: new Date(),
          startedAt: newTodo.dateRange!.from,
          expiresAt: newTodo.dateRange!.to,
        },
      ]);
      //clear form inputs
      clearInput();
      return { oldTodos };
    },
    //if fetch error then revert optimistic updates including form states
    onError: (error, newTodo, context) => {
      setTitle(newTodo.title);
      setDesc(newTodo.desc || "");
      setPriority(newTodo.priority);
      setDateRange(newTodo.dateRange);
      queryClient.setQueryData(["todo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  return { createTodo, createLoading, isSuccess };
};
