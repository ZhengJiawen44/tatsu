"use client"
import React, { useMemo, useRef, useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import { useTodo } from "../query/get-todo";
import TodoListLoading from "./TodoListLoading";
import TodoGroup from "../../../components/todo/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import { useTranslations } from "next-intl";
import TodoFilterBar from "./TodoFilterBar";
import { getDisplayDate } from "@/lib/date/displayDate";
import { RRule } from "rrule";
import { TodoItemType } from "@/types";
import clsx from "clsx";
import { useLocale } from "next-intl";

const TodayTodoContainer = () => {
  const locale = useLocale();
  const appDict = useTranslations("app")
  const { todos, todoLoading } = useTodo();
  const [containerHovered, setContainerHovered] = useState(false);
  const [sortBy, setSortBy] = useState<string | undefined>(undefined);
  const [groupBy, setGroupBy] = useState<string | undefined>(undefined);
  const [direction, setDirection] = useState<string>("Ascending");
  const pinnedTodos = useMemo(() =>
    todos.filter(({ pinned }) => pinned),
    [todos]
  );

  const unpinnedTodos = useMemo(() =>
    todos.filter(({ pinned }) => !pinned),
    [todos]
  );
  const priorityMap = useRef({ "Low": 1, "Medium": 2, "High": 3 })
  const groupedTodos = useMemo(() => {
    return Object.groupBy((unpinnedTodos), (todo) => {
      switch (groupBy) {
        case "Start date":
          return getDisplayDate(todo.dtstart, false, locale);
        case "Deadline":
          return getDisplayDate(todo.due, false, locale);
        case "Duration":
          return String(todo.durationMinutes);
        case "Priority":
          return String(todo.priority);
        case "Recurrence":
          return todo.rrule ? new RRule(RRule.parseString(todo.rrule)).toText() : "Non repeating"
        default:
          return "-1"
      }
    }) as Record<string, TodoItemType[]>
  }, [unpinnedTodos, groupBy])

  const sortedGroupedTodos = useMemo(() => {
    const sorted: Record<string, TodoItemType[]> = {};
    for (const [key, todos] of Object.entries(groupedTodos)) {
      sorted[key] = [...todos].sort((a, b) => {
        switch (sortBy) {
          case "Start date":
            return direction == "Descending" ? a.dtstart.getTime() - b.dtstart.getTime() : b.dtstart.getTime() - a.dtstart.getTime();
          case "Deadline":
            return direction == "Descending" ? a.due.getTime() - b.due.getTime() : b.due.getTime() - a.due.getTime();
          case "Duration":
            return direction == "Descending" ? a.durationMinutes - b.durationMinutes : b.durationMinutes - a.durationMinutes;
          case "Priority":
            return direction == "Descending" ? priorityMap.current[a.priority] - priorityMap.current[b.priority] : priorityMap.current[b.priority] - priorityMap.current[a.priority];
          default:
            return a.order - b.order;
        }
      });
    }

    return sorted;
  }, [groupedTodos, sortBy, direction]);




  return (
    <div className="mb-20" onMouseOver={() => (setContainerHovered(true))} onMouseOut={() => setContainerHovered(false)}>
      {todoLoading && <TodoListLoading />}
      {/* Render Pinned Todos */}
      {pinnedTodos.length > 0 && (
        <TodoGroup
          className="relative my-10 rounded-md p-2 border border-border-muted bg-card shadow-md"
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
      {Object.entries(sortedGroupedTodos).map(([key, todo]) =>
        <div key={key}>
          <div className={clsx(key !== "-1" && "my-16")}>
            {key !== "-1" && <p className="font-semibold text-muted-foreground text-lg">{groupBy + ": " + key}</p>}
            {key !== "-1" && <LineSeparator />}
            <TodoGroup
              todos={todo}
              className="flex flex-col bg-background gap-1"
            />
          </div>

        </div>
      )}

      <CreateTodoBtn />
    </div>
  );
};

export default TodayTodoContainer;
