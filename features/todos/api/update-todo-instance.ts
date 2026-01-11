import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";
import React from "react";
import { endOfDay } from "date-fns";

async function patchTodo({
  todoWithInstanceDate,
}: {
  todoWithInstanceDate: TodoItemTypeWithInstanceDate;
}) {
  if (!todoWithInstanceDate.id) {
    throw new Error("this todo is missing");
  }
  const { instanceDate } = todoWithInstanceDate;
  //validate input
  const parsedObj = todoSchema.safeParse({
    title: todoWithInstanceDate.title,
    description: todoWithInstanceDate.description,
    priority: todoWithInstanceDate.priority,
    dtstart: todoWithInstanceDate.dtstart,
    due: todoWithInstanceDate.due,
    rrule: todoWithInstanceDate.rrule,
  });
  if (!parsedObj.success) {
    console.error(parsedObj.error.errors[0]);
    return;
  }
  if (!instanceDate) {
    console.error("instance date is required for todo instance override!");
    return;
  }

  await api.PATCH({
    url: `/api/todo/instance/${todoWithInstanceDate.id}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...parsedObj.data, instanceDate }),
  });
}

interface TodoItemTypeWithInstanceDate extends TodoItemType {
  instanceDate?: Date;
}

export const useEditTodoInstance = (
  setEditInstanceOnly:
    | React.Dispatch<React.SetStateAction<boolean>>
    | undefined,
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoInstance, status: editTodoInstanceStatus } =
    useMutation({
      mutationFn: (params: TodoItemTypeWithInstanceDate) =>
        patchTodo({ todoWithInstanceDate: params }),
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ["todo"] });
        const oldTodos = queryClient.getQueryData(["todo"]);

        queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
          oldTodos.flatMap((oldTodo) => {
            if (oldTodo.id === newTodo.id) {
              if (newTodo.dtstart > endOfDay(new Date())) {
                return [];
              }
              return {
                completed: newTodo.completed,
                order: newTodo.order,
                pinned: newTodo.pinned,
                userID: newTodo.userID,
                id: newTodo.id,
                title: newTodo.title,
                description: newTodo.description,
                priority: newTodo.priority,
                due: newTodo.due,
                dtstart: newTodo.dtstart,
                rrule: newTodo.rrule,
                createdAt: new Date(),
              };
            }
            return oldTodo;
          }),
        );
        return { oldTodos };
      },
      onSettled: () => {
        if (setEditInstanceOnly) setEditInstanceOnly(false);
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
      },

      onError: (error, newTodo, context) => {
        queryClient.setQueryData(["todo"], context?.oldTodos);
        toast({ description: error.message, variant: "destructive" });
      },
    });

  return { editTodoInstance, editTodoInstanceStatus };
};
