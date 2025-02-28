import React from "react";
import { TodoItem } from "../Todo/TodoItem";
import TodoListLoading from "../ui/TodoListLoading";
import { useTodo } from "@/hooks/useTodo";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppInnerLayout";

const CompletedTodoContainer = ({
  className,
  inert,
}: {
  className?: string;
  inert: boolean;
}) => {
  const { todos, todoLoading } = useTodo();
  const hasCompletedOne = todos.some((todo) => todo.completed);

  return (
    <AppInnerLayout className={cn(className, "mt-20")} inert={inert}>
      {hasCompletedOne ? (
        <h3>🎉 hurray! you completed your todos</h3>
      ) : (
        <h3>{`৻( •̀ ᗜ •́ ৻) complete a todo and come back`}</h3>
      )}
      {todos.map((todo) => {
        if (todo.completed) {
          return (
            <TodoItem key={todo.id} todoItem={todo} variant="completed-todos" />
          );
        }
      })}
    </AppInnerLayout>
  );
};

export default CompletedTodoContainer;
