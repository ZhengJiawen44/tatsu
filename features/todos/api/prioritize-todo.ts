import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { TodoItemType } from "@/types";

export const usePrioritizeTodo = (todoItem: TodoItemType) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutatePrioritize, isPending } = useMutation({
    mutationFn: async ({ level }: { level: "Low" | "Medium" | "High" }) => {
      await api.PATCH({ url: `/api/todo/${todoItem.id}?priority=${level}` });
    },
    onMutate: async ({ level }) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });

      const oldTodos = queryClient.getQueryData(["todo"]);
      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === todoItem.id) {
            return {
              ...todoItem,
              priority: level,
            };
          }
          return oldTodo;
        })
      );

      console.log(queryClient.getQueryData(["todo"]));

      return { oldTodos };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { mutatePrioritize, isPending };
};
