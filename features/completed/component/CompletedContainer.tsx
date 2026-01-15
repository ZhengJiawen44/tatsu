"use client";
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useCompletedTodo } from "../query/get-completedTodo";
import { CompletedTodoItemContainer } from "./CompletedTodoItemContainer";

const CompletedTodoContainer = () => {
  const { completedTodos, todoLoading } = useCompletedTodo();

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
      {completedTodos.length == 0 ? (
        <h3>🎉 hurray! you completed your todos</h3>
      ) : (
        <h3>{`৻( •̀ ᗜ •́ ৻) complete a todo and come back`}</h3>
      )}
      {completedTodos.map((todo) => {
        return (
          <CompletedTodoItemContainer completedTodoItem={todo} key={todo.id} />
        );
      })}
    </>
  );
};

export default CompletedTodoContainer;
