import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { DateRange } from "react-day-picker";
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

async function postTodo({ todo }: { todo: TodoItemType }) {
  //validate input
  const parsedObj = todoSchema.safeParse({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    startedAt: todo.startedAt,
    expiresAt: todo.expiresAt,
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
    mutationFn: (todo: TodoItemType) => postTodo({ todo }),
    onMutate: async (newTodo) => {
      console.log(newTodo);

      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const oldTodos = queryClient.getQueryData(["todo"]);

      queryClient.setQueryData(["todo"], (old: TodoItemType[]) => [
        ...old,
        newTodo,
      ]);
      //clear form inputs
      clearInput();
      return { oldTodos };
    },
    //if fetch error then revert optimistic updates including form states
    onError: (error, newTodo, context) => {
      setTitle(newTodo.title);
      setDesc(newTodo.description || "");
      setPriority(newTodo.priority);
      setDateRange({ from: newTodo.startedAt, to: newTodo.expiresAt });
      queryClient.setQueryData(["todo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
  });
  return { createTodo, createLoading, isSuccess };
};
