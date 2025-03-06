"use client";
import React from "react";
import { TodoItem } from "../Todo/TodoItem/TodoItemContainer";
import { useTodo } from "@/hooks/useTodo";
import { Skeleton } from "../ui/skeleton";

const CompletedTodoContainer = ({ className }: { className?: string }) => {
  const { todos, todoLoading } = useTodo();
  const hasCompletedOne = todos.some((todo) => todo.completed);

  if (todoLoading)
    return (
      <>
        <Skeleton className="w-[20rem] h-[2rem]" />
        <br />
        <Skeleton className="w-[10rem] h-[1rem]" />
      </>
    );

  return (
    <>
      {hasCompletedOne ? (
        <h3>🎉 hurray! you completed your todos</h3>
      ) : (
        <h3>{`৻( •̀ ᗜ •́ ৻) complete a todo and come back`}</h3>
      )}
      {todos.map((todo) => {
        if (todo.completed) {
          return (
            <TodoItem key={todo.id} variant="completed-todos" todoItem={todo} />
          );
        }
      })}
    </>
  );
};

export default CompletedTodoContainer;
