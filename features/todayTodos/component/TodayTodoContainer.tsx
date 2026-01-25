"use client"
import React from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import { useTodo } from "../query/get-todo";
import TodoListLoading from "./TodoListLoading";
import TodoGroup from "../../../components/todo/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import { useTranslations } from "next-intl";


const TodayTodoContainer = () => {
  const appDict = useTranslations("app")
  const { todos, todoLoading } = useTodo();
  const pinnedTodos = todos.filter(({ pinned }) => pinned);
  const unpinnedTodos = todos.filter(({ pinned }) => !pinned);

  return (
    <>
      {todoLoading && <TodoListLoading />}

      {/* Render Pinned Todos */}
      {pinnedTodos.length > 0 && (
        <TodoGroup
          className="relative mt-10 rounded-md p-2 border border-border-muted bg-card shadow-md "
          todos={pinnedTodos}
        />
      )}

      <div className="flex items-center gap-2 mt-10 mb-4">
        <h3 className="text-lg font-semibold select-none">
          {appDict("today")}
        </h3>
        <LineSeparator className="flex-1" />
      </div>
      <TodoGroup
        todos={unpinnedTodos}
        className="flex flex-col bg-background gap-1"
      />
      <CreateTodoBtn />
    </>
  );
};

export default TodayTodoContainer;
