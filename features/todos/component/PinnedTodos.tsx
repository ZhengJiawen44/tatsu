import { TodoItemType } from "@/types";
import React from "react";
import TodoGroup from "./TodoGroup";

const PinnedTodos = ({
  groupedPinnedTodos,
}: {
  groupedPinnedTodos: Record<string, TodoItemType[]>;
}) => {
  if (!groupedPinnedTodos) return <></>;

  return Object.entries(groupedPinnedTodos).map(([date, todos]) => (
    <div
      key={date}
      className="relative mt-10 rounded-md p-2 bg-card-muted border border-border-muted"
    >
      <TodoGroup todos={todos} />
    </div>
  ));
};

export default PinnedTodos;
