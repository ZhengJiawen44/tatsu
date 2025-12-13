import React, { useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import Inbox from "./Inbox";
import { useTodo } from "../api/get-todo";
import Day from "./Day";
import TodoListLoading from "./TodoListLoading";
import { groupTodo } from "@/features/todos/lib/groupTodo";
import TodayTodos from "./TodayTodos";
import PinnedTodos from "./PinnedTodos";

const TodoContainer = () => {
  const { todos, todoLoading } = useTodo();

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

  //state to control the mapping, genrated a mapping of  Record<date:boolean>
  const [openGroupedTodoMap, setOpenGroupedTodoMap] =
    useState<Record<string, boolean>>(initialOpenState);

  //get today's todo list
  const TodayTodoList = Object.entries(groupedUnPinnedTodos).filter(
    ([date]) => {
      return date === "today";
    }
  );

  return (
    <div className="select-none bg-card">
      <Day />

      {/* Render Unpinned previous todos */}
      <Inbox
        groupedUnpinnedTodos={groupedUnPinnedTodos}
        openDetails={openGroupedTodoMap}
        setOpenDetails={setOpenGroupedTodoMap}
      />
      {todoLoading && <TodoListLoading />}

      {/* Render Pinned Todos */}
      <PinnedTodos groupedPinnedTodos={groupedPinnedTodos} />

      {/* render creare todo btn incase no todos for today */}
      {TodayTodoList.length <= 0 && <CreateTodoBtn />}

      {/* Render Unpinned today's Todos */}
      {TodayTodoList.map(([date, todos]) => {
        return <TodayTodos key={date} todos={todos} />;
      })}
    </div>
  );
};

export default TodoContainer;
