import { TodoItemType } from "@/types";
import React from "react";
import TodoGroup from "@/components/todo/component/TodoGroup";
const PinnedTodos = ({ todos }: { todos: TodoItemType[] }) => {
  return (
    <TodoGroup
      className="relative mt-10 rounded-md p-2 bg-card border-border-muted"
      todos={todos}
    />
  );
};

export default PinnedTodos;
