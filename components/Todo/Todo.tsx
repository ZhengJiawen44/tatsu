import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";
import TodoList from "./TodoList";
import Day from "./Day";

const Todo = ({ className }: { className?: string }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  return (
    <div
      className={cn(
        "overflow-y-scroll h-full w-full scrollbar-none px-[114px]",
        className
      )}
    >
      <Day currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <Tooltip />
      <TodoList />
    </div>
  );
};

export default Todo;
