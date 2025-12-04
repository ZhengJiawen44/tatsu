import React from "react";
import TodoGroup from "./TodoGroup";
import CreateTodoBtn from "./CreateTodoBtn";
import { TodoItemType } from "@/types";

const TodayTodos = ({ todos }: { todos: TodoItemType[] }) => {
  return (
    <>
      <TodoGroup todos={todos} isToday={true} /> <CreateTodoBtn />
    </>
  );
};

export default TodayTodos;
