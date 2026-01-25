"use client"
import React, { useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import { useTodo } from "../query/get-todo";
import TodoListLoading from "./TodoListLoading";
import TodoGroup from "../../../components/todo/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import { useTranslations } from "next-intl";
import TodoFilterBar from "./TodoFilterBar";


const TodayTodoContainer = () => {
  const appDict = useTranslations("app")
  const { todos, todoLoading } = useTodo();
  const pinnedTodos = todos.filter(({ pinned }) => pinned);
  const unpinnedTodos = todos.filter(({ pinned }) => !pinned);
  const [containerHovered, setContainerHovered] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<string>("Ascending");


  return (
    <div className="mb-20" onMouseOver={() => (setContainerHovered(true))} onMouseOut={() => setContainerHovered(false)}>
      {todoLoading && <TodoListLoading />}
      {/* Render Pinned Todos */}
      {pinnedTodos.length > 0 && (
        <TodoGroup
          className="relative my-10 rounded-md p-2 border border-border-muted bg-card shadow-md "
          todos={pinnedTodos}
        />
      )}
      <div className="mb-3">
        <div className="sm:flex items-center justify-between gap-2">
          <h3 className="text-lg font-semibold select-none">
            {appDict("today")}
          </h3>
          <TodoFilterBar
            sortBy={sortBy}
            setSortBy={setSortBy}
            groupBy={groupBy}
            setGroupBy={setGroupBy}
            direction={direction}
            setDirection={setDirection}
            containerHovered={containerHovered}
          />
        </div>
        <LineSeparator className="flex-1" />
      </div>
      <TodoGroup
        todos={unpinnedTodos}
        className="flex flex-col bg-background gap-1"
      />
      <CreateTodoBtn />
    </div>
  );
};

export default TodayTodoContainer;
