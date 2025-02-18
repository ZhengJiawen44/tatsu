import React from "react";
import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";
import TodoList from "./TodoList";

const Todo = ({ className }: { className?: string }) => {
  return (
    <div
      className={cn(
        "overflow-y-scroll h-full w-full scrollbar-none px-[114px]",
        className
      )}
    >
      <h1 className="text-center mt-20 text-[3rem]">Monday</h1>
      <p className="text-center mt-2 text-[1.1rem]">March 23, 2025</p>
      <Tooltip />

      <TodoList />
    </div>
  );
};

export default Todo;
