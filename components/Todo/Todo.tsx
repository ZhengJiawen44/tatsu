import React from "react";
import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";
import TodoList from "./TodoList";
const Todo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "overflow-y-scroll h-full w-full scrollbar-none p-[114px]",
        className
      )}
    >
      <Tooltip />
      <TodoList />
    </div>
  );
};

export default Todo;
