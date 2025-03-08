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
      {/* <p className="absolute -top-[1.1rem] left-2 text-sm text-card-foreground-muted bg-card">
        pinned
      </p> */}

      <TodoGroup todos={todos} />
    </div>
  ));
};

export default PinnedTodos;
