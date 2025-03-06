import React, { useState } from "react";
import TodoList from "./GroupedTodo/GroupedTodoContainer";
import Day from "./TodoMenu/Day";
import { useTodo } from "@/hooks/useTodo";
import TodoListLoading from "../ui/TodoListLoading";

const Todo = () => {
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
