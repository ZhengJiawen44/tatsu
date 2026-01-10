import { useQueryClient, useMutation } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { useToast } from "@/hooks/use-toast";
import { CalendarTodoItemType, TodoItemType } from "@/types";

export const usePrioritizeTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: mutatePrioritize, isPending } = useMutation({
    mutationFn: async ({
      id,
      level,
    }: {
      id: string;
      level: "Low" | "Medium" | "High";
    }) => {
      await api.PATCH({ url: `/api/todo/${id}?priority=${level}` });
    },
    onMutate: async ({
      id,
      level,
    }: {
      id: string;
      level: "Low" | "Medium" | "High";
    }) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });

      const oldTodos = queryClient.getQueryData(["todo"]);
      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === id) {
            return {
              ...oldTodo,
              priority: level,
            };
          }
          return oldTodo;
        }),
      );

      console.log(queryClient.getQueryData(["todo"]));

      return { oldTodos };
    },
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error) => {
      toast({ description: error.message, variant: "destructive" });
    },
    onSettled(data, error, { id, level }) {
      //optimistically update calendar todos
      queryClient.setQueryData(
        ["calendarTodo"],
        (oldTodos: CalendarTodoItemType[]) => {
          if (!oldTodos) return oldTodos;
          return oldTodos.flatMap((todo) => {
            if (todo.id == id) return { ...todo, priority: level };
            return todo;
          });
        },
      );
    },
  });

  return { mutatePrioritize, isPending };
};
