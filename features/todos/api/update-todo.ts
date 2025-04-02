import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api-client";
import { todoSchema } from "@/schema";
import { TodoItemType } from "@/types";

import React from "react";
async function patchTodo({ todo }: { todo: TodoItemType }) {
  if (!todo.id) {
    throw new Error("this todo is missing");
  }

  //validate input
  const parsedObj = todoSchema.safeParse({
    title: todo.title,
    description: todo.description,
    priority: todo.priority,
    startedAt: todo.startedAt,
    expiresAt: todo.expiresAt,
  });
  if (!parsedObj.success) {
    console.log(parsedObj.error.errors[0]);
    return;
  }
  await api.PATCH({
    url: `/api/todo/${todo.id}`,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsedObj.data),
  });
}

export const useEditTodo = (
  setDisplayForm: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    mutate: editTodo,
    isPending: editLoading,
    isSuccess,
  } = useMutation({
    mutationFn: (params: TodoItemType) => patchTodo({ todo: params }),
    onMutate: async (newTodo) => {
      setDisplayForm(false);
      await queryClient.cancelQueries({ queryKey: ["todo"] });
      const oldTodos = queryClient.getQueryData(["todo"]);

      queryClient.setQueryData(["todo"], (oldTodos: TodoItemType[]) =>
        oldTodos.map((oldTodo) => {
          if (oldTodo.id === newTodo.id) {
            return {
              completed: newTodo.completed,
              order: newTodo.order,
              pinned: newTodo.pinned,
              userID: newTodo.userID,
              id: newTodo.id,
              title: newTodo.title,
              description: newTodo.description,
              priority: newTodo.priority,
              expiresAt: newTodo.expiresAt,
              startedAt: newTodo.startedAt,
              createdAt: new Date(),
            };
          }
          return oldTodo;
        })
      );
      return { oldTodos };
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["todo"] });
    },
    onError: (error, newTodo, context) => {
      setDisplayForm(true);
      queryClient.setQueryData(["todo"], context?.oldTodos);
      toast({ description: error.message, variant: "destructive" });
    },
  });

  return { editTodo, editLoading };
};
