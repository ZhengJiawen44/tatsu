import React, { useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import Inbox from "./Inbox";
import { useTodo } from "../api/get-todo";
import Day from "./Day";
import TodoListLoading from "./TodoListLoading";
import { groupTodo } from "@/features/todos/lib/groupTodo";
import PinnedTodos from "./PinnedTodos";
import TodoGroup from "./TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";

const TodoContainer = () => {
  const { todos, todoLoading } = useTodo();

  //const { groupedPinnedTodos, groupedUnPinnedTodos } = groupTodo({ todos });
  /*initializes a mapping between dates and open state to keep track of open states of grouped dates
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
*/
  return (
    <div className="select-none bg-inherit">
      <Day />

      {/* Render Unpinned previous todos */}
      {/*<Inbox
        groupedUnpinnedTodos={groupedUnPinnedTodos}
        openDetails={openGroupedTodoMap}
        setOpenDetails={setOpenGroupedTodoMap}
      />*/}
      {todoLoading && <TodoListLoading />}

      {/* Render Pinned Todos */}
      {/*<PinnedTodos groupedPinnedTodos={groupedPinnedTodos} />*/}

      {/* render create todo btn incase no todos for today */}
      {todos.length <= 0 && <CreateTodoBtn />}

      {/* Render Unpinned today's Todos */}
      {/*todos.map((todos) => {
        return <TodayTodos key={"today"} todos={todos} />;
      })*/}
      <div className="flex items-center gap-2 mt-10">
        <h3 className="text-lg font-semibold select-none">Today</h3>
        <LineSeparator className="flex-1" />
      </div>
      <TodoGroup todos={todos} />
      <CreateTodoBtn />
    </div>
  );
};

export default TodoContainer;
