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
    <div key={date} className="mt-10 border rounded-md p-2">
      <h3 className="text-lg font-bold my-4">pinned</h3>
      <TodoGroup todos={todos} />
    </div>
  ));
};

export default PinnedTodos;
