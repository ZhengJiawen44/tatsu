"use client";
import React from "react";
import { useUpcomingTodo } from "../query/get-upcoming-todo";
import TodoListLoading from "@/components/ui/TodoListLoading";
import TodoGroup from "@/components/todo/component/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import { usePinUpcomingTodo } from "../query/pin-upcoming-todo";
import { useDeleteUpcomingTodo } from "../query/delete-upcoming-todo";
import { usePrioritizeUpcomingTodo } from "../query/prioritize-upcoming-todo";
import { useEditUpcomingTodo } from "../query/update-upcoming-todo";
import { useEditUpcomingTodoInstance } from "../query/update-upcoming-todo-instance";
import { useReorderUpcomingTodo } from "../query/reorder-upcoming-todo";
import { useCompleteUpcomingTodo } from "../query/complete-upcoming-todo";
import TodoMutationProvider from "@/providers/TodoMutationProvider";

export default function UpcomingTodoContainer() {
  const { todos: upcomingTodos, isLoading } = useUpcomingTodo();

  if (!upcomingTodos.length) return null;
  return (
    <div className="mb-20">
      <div className="flex items-center gap-2 mt-10 mb-4">
        <h3 className="text-lg font-semibold select-none">Upcoming</h3>
        <LineSeparator className="flex-1" />
      </div>
      <div>
        {isLoading && <TodoListLoading />}

        <TodoMutationProvider
          useCompleteTodo={useCompleteUpcomingTodo}
          useDeleteTodo={useDeleteUpcomingTodo}
          useEditTodo={useEditUpcomingTodo}
          useEditTodoInstance={useEditUpcomingTodoInstance}
          usePinTodo={usePinUpcomingTodo}
          usePrioritizeTodo={usePrioritizeUpcomingTodo}
          useReorderTodo={useReorderUpcomingTodo}
        >
          <TodoGroup
            todos={upcomingTodos.filter((todo) => todo.pinned === false)}
          />
        </TodoMutationProvider>
      </div>
    </div>
  );
}
