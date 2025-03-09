"use client";
import React from "react";
import { TodoItemContainer } from "../Todo/TodoItem/TodoItemContainer";
import { useTodo } from "@/hooks/useTodo";
import { Skeleton } from "../ui/skeleton";
import TodoMenuProvider from "@/providers/TodoMenuProvider";

const CompletedTodoContainer = () => {
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
            <TodoMenuProvider id={todo.id} pinned={todo.pinned} key={todo.id}>
              <TodoItemContainer variant="completed-todos" todoItem={todo} />
            </TodoMenuProvider>
          );
        }
      })}
    </>
  );
};

export default CompletedTodoContainer;
