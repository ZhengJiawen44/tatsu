import { useQueryClient, useMutation } from "@tanstack/react-query";
import { todoSchema } from "@/schema";
import { api } from "@/lib/api-client";
import { TodoItemType } from "@/types";

type CreateTodoInput = Pick<
  TodoItemType,
  | "title"
  | "description"
  | "rrule"
  | "dtstart"
  | "due"
  | "priority"
  | "projectID"
>;

async function postTodo({ todo }: { todo: CreateTodoInput }) {
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

export const useCreateCalendarTodo = () => {
  const queryClient = useQueryClient();

  const { mutate: createCalendarTodo, status: createTodoStatus } = useMutation({
    mutationFn: (todo: CreateTodoInput) => postTodo({ todo }),
    //if fetch error then revert optimistic updates including form states
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      //calendarTodo is invalidated
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
    },
  });

  return { createCalendarTodo, createTodoStatus };
};
