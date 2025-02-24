import React, { useState } from "react";
import { cn } from "@/lib/utils";
import CreateTodoBtn from "./TodoMenu/CreateTodoBtn";
import TodoList from "./TodoList";
import Day from "./TodoMenu/Calender";
import AppInnerLayout from "../AppInnerLayout";
const Todo = ({ className }: { className?: string }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  return (
    <AppInnerLayout className={cn(className)}>
      <Day currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <CreateTodoBtn />
      <TodoList />
    </AppInnerLayout>
  );
};

export default Todo;
