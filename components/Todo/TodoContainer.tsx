import React, { useState } from "react";
import CreateTodoBtn from "./TodoMenu/CreateTodoBtn";
import TodoList from "./TodoList";
import Day from "./TodoMenu/Calender";
const Todo = ({
  className,
  inert,
}: {
  className?: string;
  inert?: boolean;
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  return (
    <>
      <Day currentDate={currentDate} setCurrentDate={setCurrentDate} />
      <CreateTodoBtn />
      <TodoList />
    </>
  );
};

export default Todo;
