import { useQueryClient, useMutation } from "@tanstack/react-query";
import { todoSchema } from "@/schema";
import { api } from "@/lib/api-client";
import { recurringTodoItemType, TodoItemType } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { expandRepeatingTodo } from "../lib/expandRepeatingTodo";
import { useCalendarRange } from "@/providers/CalenderRangeProvider";

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
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const {calendarRange} = useCalendarRange()

  const { mutate: createCalendarTodo, status: createTodoStatus } = useMutation({
    mutationKey: ["createCalendarTodo"],
    mutationFn: (todo: CreateTodoInput) => postTodo({ todo }),
    onMutate: (newTodo)=>{
      const oldCalendarTodos = queryClient.getQueriesData({ queryKey: ["calendarTodo"] });
      const hydratedNewTodo = {
              id:crypto.randomUUID(), 
              title: newTodo.title, 
              description: newTodo.description,
              dtstart: newTodo.dtstart,
              due: newTodo.due,
              rrule: newTodo.rrule,
              priority: newTodo.priority,
              projectID: newTodo.projectID,
              pinned: false,
              createdAt: new Date(),
              order: 9999,
              completed: false,
              instances:[],
              instanceDate: newTodo.dtstart!,
              timeZone:"",
              exdates:[],
              userID:"-1",
              durationMinutes: 1
            } as recurringTodoItemType
      const expandedHydratedNewTodo = (hydratedNewTodo.rrule && hydratedNewTodo.dtstart)? expandRepeatingTodo(
            hydratedNewTodo, 
            calendarRange
      ):null;

      queryClient.cancelQueries({queryKey:["calendarTodo"]});
      queryClient.setQueriesData({queryKey:["calendarTodo"]}, (oldCalendarTodo:TodoItemType[])=>{
        if(expandedHydratedNewTodo)
          return [
            ...oldCalendarTodo, 
          ...expandedHydratedNewTodo
          ]
          
        return [
            ...oldCalendarTodo, 
            hydratedNewTodo
          ]
      });
      return {oldCalendarTodos};
    },
    //if fetch error then revert optimistic updates
    onError: (error, newTodo, context) => {
      queryClient.setQueriesData({queryKey:["calendarTodo"]}, context?.oldCalendarTodos);
      toast({ description: error.message, variant: "destructive" });
    },
    //if fetch error then revert optimistic updates including form states
    onSettled: () => {
      // This mutation is still pending inside onSettled, so 1 means it is the last create in flight.
      if (queryClient.isMutating({ mutationKey: ["createCalendarTodo"] }) !== 1) {
        return;
      }
      queryClient.invalidateQueries({ queryKey: ["todo"] });
      //calendarTodo is invalidated
      queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      queryClient.invalidateQueries({
        queryKey: ["overdueTodo"],
      });
      queryClient.invalidateQueries({
        queryKey: ["project"],
      });
    },
  });

  return { createCalendarTodo, createTodoStatus };
};
