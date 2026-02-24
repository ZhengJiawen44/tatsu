import { useToast } from "@/hooks/use-toast";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { todoSchema } from "@/schema";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";

async function postTodo({ todo }: { todo: TodoItemType }) {
  //validate input
  const parsedObj = todoSchema.safeParse({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    dtstart: todo.dtstart,
    due: todo.due,
    rrule: todo.rrule,
    projectID: todo.projectID,
  });

  if (!parsedObj.success) {
    console.log(todo);
    throw new Error(parsedObj.error.errors[0].message);
  }

  const res = await api.POST({
    url: "/api/todo",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });

  //convert todo due from string to time
  res.todo.due = new Date(res.todo.due);
  res.todo.dtstart = new Date(res.todo.dtstart);

  return res.todo;
}

export const useCreateTodo = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: createMutateFn, status: createStatus } = useMutation({
    mutationFn: (todo: TodoItemType) => postTodo({ todo }),
    onMutate: async (newTodo) => {
      console.log(newTodo);

      await queryClient.cancelQueries({ queryKey: ["todo"] });
      await queryClient.cancelQueries({ queryKey: ["project"] });

      const oldTodos = queryClient.getQueryData(["todo"]);
      const oldProjectTodos = queryClient.getQueryData<TodoItemType[]>([
        "project",
        newTodo.projectID,
      ]);

      queryClient.setQueryData(["todo"], (old: TodoItemType[]) => [
        ...old,
        newTodo,
      ]);

      if (newTodo.projectID) {
        queryClient.setQueriesData(
          { queryKey: ["project", newTodo.projectID] },
          (old: TodoItemType[]) => {
            return [...old, newTodo];
          },
        );
      }

      return { oldTodos, oldProjectTodos };
    },
    //if fetch error then revert optimistic updates including form states
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["todo"], context?.oldTodos);
      queryClient.setQueryData(["project"], context?.oldProjectTodos);
      toast({ description: error.message, variant: "destructive" });
    },
    onSettled: (_, error, newTodo) => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({
        queryKey: ["project", newTodo.projectID],
      });
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
    },
    // onSuccess: (createdTodo: TodoItemType, newTodo) => {
    //   queryClient.setQueryData(["todo"], (old: TodoItemType[] = []) =>
    //     old.map((t) => (t.id === newTodo.id ? createdTodo : t)),
    //   );
    //   if (createdTodo.projectID) {
    //     queryClient.setQueryData(
    //       ["project", createdTodo.projectID],
    //       (old: TodoItemType[] = []) =>
    //         old.map((t) => (t.id === newTodo.id ? createdTodo : t)),
    //     );
    //   }
    // },
  });
  return { createMutateFn, createStatus };
};
