import React, { useState } from "react";
import { cn } from "@/lib/utils";
import Tooltip from "./Tooltip";
import TodoList from "./TodoList";
import Day from "./Day";
import AppInnerLayout from "../AppInnerLayout";
const Todo = ({ className }: { className?: string }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  return (
    <AppInnerLayout className={cn(className)}>
      <Day currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <Tooltip />
      <TodoList />
    </AppInnerLayout>
  );
};

export default Todo;
