import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoInstanceSchema } from "@/schema";
import { TodoItemType } from "@/types";
import React from "react";
import { endOfDay } from "date-fns";

async function patchTodo({ ghostTodo }: { ghostTodo: TodoItemType }) {
  //validate input for the ghost todo
  const parsedObj = todoInstanceSchema.safeParse({
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
  const todoId = ghostTodo.id.split(":")[0];

  await api.PATCH({
    url: `/api/todo/instance/${todoId}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...parsedObj.data, id: todoId }),
  });
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
      mutationFn: (ghostTodo: TodoItemType) => patchTodo({ ghostTodo }),
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
