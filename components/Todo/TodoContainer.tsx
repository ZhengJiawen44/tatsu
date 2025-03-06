import React, { useState } from "react";
import CreateTodoBtn from "./TodoMenu/CreateTodoBtn";
import TodoList from "./GroupedTodoContainer";
import Day from "./TodoMenu/Day";
import { useTodo } from "@/hooks/useTodo";
import TodoListLoading from "../ui/TodoListLoading";

const Todo = ({
  className,
  inert,
}: {
  className?: string;
  inert?: boolean;
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  //see useTodo hook on how todos are fetched and mutated
  const { todos, todoLoading } = useTodo();
  return (
    <div className="select-none">
      <Day currentDate={currentDate} setCurrentDate={setCurrentDate} />
      {!todoLoading ? <TodoList todos={todos} /> : <TodoListLoading />}
    </div>
  );
};

export default Todo;
