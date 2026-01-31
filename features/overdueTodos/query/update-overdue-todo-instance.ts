import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoInstanceSchema } from "@/schema";
import { TodoItemType } from "@/types";
import React from "react";
import { endOfDay } from "date-fns";
import { InfiniteQueryTodoData } from "./get-overdue-todo";

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

export const useEditOverdueTodoInstance = (
  setEditInstanceOnly?: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: editTodoInstanceMutateFn, status: editTodoInstanceStatus } =
    useMutation({
      mutationFn: (ghostTodo: TodoItemType) => patchTodo({ ghostTodo }),
      onMutate: async (newTodo) => {
        await queryClient.cancelQueries({ queryKey: ["overdueTodo"] });

        const oldDataBackup = queryClient.getQueryData<InfiniteQueryTodoData>([
          "overdueTodo",
        ]);

        queryClient.setQueryData<InfiniteQueryTodoData>(
          ["overdueTodo"],
          (oldData) => {
            if (!oldData) return oldData;

            return {
              ...oldData,
              pages: oldData.pages.map((page) => ({
                ...page,
                todos: page.todos.flatMap((oldTodo) => {
                  if (oldTodo.id === newTodo.id) {
                    // Remove if moved to future
                    if (newTodo.dtstart > endOfDay(new Date())) {
                      return [];
                    }
                    return [
                      {
                        ...oldTodo, // Keep all existing properties
                        completed: newTodo.completed,
                        order: newTodo.order,
                        pinned: newTodo.pinned,
                        title: newTodo.title,
                        description: newTodo.description,
                        priority: newTodo.priority,
                        due: newTodo.due,
                        dtstart: newTodo.dtstart,
                        rrule: newTodo.rrule,
                        durationMinutes: newTodo.durationMinutes,
                        instanceDate: newTodo.instanceDate,
                      },
                    ];
                  }
                  return [oldTodo];
                }),
              })),
            };
          },
        );

        return { oldDataBackup };
      },
      onSettled: () => {
        if (setEditInstanceOnly) setEditInstanceOnly(false);
        queryClient.invalidateQueries({ queryKey: ["calendarTodo"] });
        queryClient.invalidateQueries({ queryKey: ["overdueTodo"] });
      },
      onError: (error, newTodo, context) => {
        queryClient.setQueryData(["overdueTodo"], context?.oldDataBackup);
        toast({ description: error.message, variant: "destructive" });
      },
    });

  return { editTodoInstanceMutateFn, editTodoInstanceStatus };
};
