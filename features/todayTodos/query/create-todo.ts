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
    mutationKey: ["createTodo"],
    mutationFn: async (todo: TodoItemType) => {
      const res = await postTodo({ todo });
      return res;
    },
    onMutate: async (newTodo) => {
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      await queryClient.cancelQueries({ queryKey: ["projectTodo"] });

      const oldTodos = queryClient.getQueryData(["todo"]);
      const oldPageTodos = queryClient.getQueryData(["pageTodo"]);
      const oldProjectTodos = queryClient.getQueryData<TodoItemType[]>([
        "project",
        newTodo.projectID,
      ]);

      queryClient.setQueryData(["todo"], (old: TodoItemType[]) => [
        ...old,
        newTodo,
      ]);
      queryClient.setQueriesData(
        { queryKey: ["pageTodo"] },
        (old: TodoItemType[]) => [...old, newTodo],
      );

      if (newTodo.projectID) {
        queryClient.setQueriesData(
          { queryKey: ["projectTodo", newTodo.projectID] },
          (old: TodoItemType[]) => {
            return [...old, newTodo];
          },
        );
      }

      return { oldTodos, oldPageTodos, oldProjectTodos };
    },
    //if fetch error then revert optimistic updates including form states
    onError: (error, newTodo, context) => {
      queryClient.setQueryData(["todo"], context?.oldTodos);
      queryClient.setQueryData(["pageTodo"], context?.oldPageTodos);
      queryClient.setQueryData(["projectTodo"], context?.oldProjectTodos);

      toast({ description: error.message, variant: "destructive" });
    },
    onSuccess: (createdTodo: TodoItemType, newTodo) => {
      const formattedTodo = {
        ...createdTodo,
        createdAt: new Date(createdTodo.createdAt),
        dtstart: createdTodo.dtstart
          ? new Date(createdTodo.dtstart)
          : undefined,
        due: createdTodo.due ? new Date(createdTodo.due) : undefined,
        instanceDate: newTodo.instanceDate,
        id: `${createdTodo.id}:${newTodo.instanceDate?.getTime()}`,
      };

      queryClient.setQueryData(["todo"], (old: TodoItemType[] = []) =>
        old.map((t) => (t.id === newTodo.id ? formattedTodo : t)),
      );

      queryClient.setQueryData(["pageTodo"], (old: TodoItemType[] = []) =>
        old.map((t) => (t.id === newTodo.id ? formattedTodo : t)),
      );

      if (createdTodo.projectID) {
        queryClient.setQueryData(
          ["projectTodo", createdTodo.projectID],
          (old: TodoItemType[] = []) =>
            old.map((t) => (t.id === newTodo.id ? formattedTodo : t)),
        );
      }
    },
    onSettled: (_, error, newTodo) => {
      if (queryClient.isMutating({ mutationKey: ["createTodo"] }) !== 1) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      queryClient.invalidateQueries({
        queryKey: ["projectTodo", newTodo.projectID],
      });
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
      queryClient.invalidateQueries({ queryKey: ["projectTodo"] });
      queryClient.invalidateQueries({ queryKey: ["pageTodo"] });
    },
  });
  return { createMutateFn, createStatus };
};
