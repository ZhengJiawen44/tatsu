import { TodoItemType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import { useErrorNotification } from "./useErrorToast";
import { useMutation } from "@tanstack/react-query";
import { patchTodo } from "@/lib/todo/patchTodo";
import { postTodo } from "@/lib/todo/postTodo";
import { useToast } from "./use-toast";

export const useTodo = () => {
  //get todos
  const {
    data: todos = [],
    isLoading: todoLoading,
    isError,
    error,
  } = useQuery<TodoItemType[]>({
    queryKey: ["todo"],
    queryFn: async () => {
      const res = await fetch(`/api/todo`);
      const data = await res.json();

      if (!res.ok)
        throw new Error(
          data.message || `error ${res.status}: failed to get Todos`
        );
      const { todos } = data;
      if (!todos) {
        throw new Error(
          data.message || `bad server response: Did not recieve todo`
        );
      }
      return todos;
    },
  });
  useErrorNotification(
    isError,
    error?.message || "an unexpectedd error happened"
  );
  return { todos, todoLoading };
};

//patch todo
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
    mutationFn: (params: { id: string; title: string; desc?: string }) =>
      patchTodo({ ...params, toast }),
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

//post todo
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
    mutationFn: (params: { title: string; desc?: string }) =>
      postTodo({ ...params, toast }),
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
