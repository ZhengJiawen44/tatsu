import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";
import z from "zod";

async function patchTodo({ ghostTodo }: { ghostTodo: TodoItemType }) {
  if (!ghostTodo.id) {
    throw new Error("this todo is missing");
  }
  //validate input
  const parsedObj = todoSchema.extend({ instanceDate: z.date() }).safeParse({
    title: ghostTodo.title,
    description: ghostTodo.description,
    priority: ghostTodo.priority,
    dtstart: ghostTodo.dtstart,
    due: ghostTodo.due,
    rrule: ghostTodo.rrule,
    instanceDate: ghostTodo.instanceDate,
  });
  if (!parsedObj.success) {
    console.error(parsedObj.error.errors[0]);
    return;
  }

  await api.PATCH({
    url: `/api/todo/instance/${ghostTodo.id.split(":")[0]}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...parsedObj.data,
      instanceDate: parsedObj.data.instanceDate,
    }),
  });
}

export const useEditCalendarTodoInstance = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { mutate: editCalendarTodoInstance, status: editTodoInstanceStatus } =
    useMutation({
      mutationFn: (params: TodoItemType) => patchTodo({ ghostTodo: params }),
      onMutate: async (newTodo: TodoItemType) => {
        await queryClient.cancelQueries({
          queryKey: ["calendarTodo"],
        });
        const oldTodosBackup = queryClient.getQueriesData({
          queryKey: ["calendarTodo"],
        });
        queryClient.setQueryData<TodoItemType[]>(
          ["calendarTodo"],
          (oldTodos) => {
            return oldTodos?.map((oldTodo) => {
              if (oldTodo.id === newTodo.id) {
                //only overwrite the overwritable fields from overriden instance
                return {
                  ...oldTodo,
                  title: newTodo.title,
                  description: newTodo.description,
                  priority: newTodo.priority,
                  dtstart: newTodo.dtstart,
                  due: newTodo.due,
                };
              }
              return oldTodo;
            });
          },
        );
        return { oldTodosBackup };
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
        queryClient.invalidateQueries({
          queryKey: ["todo"],
        });
      },

      onError: (error, newTodo, context) => {
        queryClient.setQueryData(["calendarTodo"], context?.oldTodosBackup);
        toast({
          description: error.message,
          variant: "destructive",
        });
      },
    });

  return { editCalendarTodoInstance, editTodoInstanceStatus };
};
