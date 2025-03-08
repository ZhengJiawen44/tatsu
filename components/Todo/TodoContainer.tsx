import React, { useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import PreviousTodo from "./PreviousTodo";
import { useTodo } from "@/hooks/useTodo";
import Day from "./Day";
import TodoListLoading from "../ui/TodoListLoading";
import { groupTodo } from "@/lib/todo/groupTodo";
import TodayTodos from "./TodayTodos";
import PinnedTodos from "./PinnedTodos";

const TodoContainer = () => {
  //get all todos
  const { todos, todoLoading } = useTodo();

  // Destructure the result for cleaner access
  const { groupedPinnedTodos, groupedUnPinnedTodos } = groupTodo({ todos });

  //initializes a mapping between dates and open state to keep track of open states of grouped dates
  const initialOpenState = Object.keys(groupedUnPinnedTodos).reduce(
    (acc, curr) => {
      if (curr !== "today") {
        acc[curr] = false;
        return acc;
      }
      //today's todos are opened by default
      acc[curr] = true;
      return acc;
    },
    {} as Record<string, boolean>
  );

  //state to control the mapping, genrated a maping of  Record<date:boolean>
  const [openGroupedTodoMap, setOpenGroupedTodoMap] =
    useState<Record<string, boolean>>(initialOpenState);

  //get today's todo list
  const TodayTodoList = Object.entries(groupedUnPinnedTodos).filter(
    ([date]) => {
      return date === "today";
    }
  );

  if (todoLoading) <TodoListLoading />;
  return (
    <div className="select-none">
      <Day />

      {/* Render Unpinned previous todos */}
      <PreviousTodo
        groupedUnpinnedTodos={groupedUnPinnedTodos}
        openDetails={openGroupedTodoMap}
        setOpenDetails={setOpenGroupedTodoMap}
      />

      {/* Render Pinned Todos */}
      <PinnedTodos groupedPinnedTodos={groupedPinnedTodos} />

      {TodayTodoList.length <= 0 && <CreateTodoBtn />}

      {/* Render Unpinned today's Todos */}
      {TodayTodoList.map(([date, todos]) => {
        return <TodayTodos key={date} todos={todos} />;
      })}
    </div>
  );
};

export default TodoContainer;
