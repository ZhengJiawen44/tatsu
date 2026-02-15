"use client"
import React, { useMemo, useRef, useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import { useTodo } from "../query/get-todo";
import TodoListLoading from "../../../components/todo/component/TodoListLoading";
import TodoGroup from "@/components/todo/component/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import { useTranslations } from "next-intl";
import { getDisplayDate } from "@/lib/date/displayDate";
import { RRule } from "rrule";
import { TodoItemType } from "@/types";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useUserTimezone } from "@/features/user/query/get-timezone";
import { usePinTodo } from "../query/pin-todo";
import { useCompleteTodo } from "../query/complete-todo";
import { useDeleteTodo } from "../query/delete-todo";
import { usePrioritizeTodo } from "../query/prioritize-todo";
import { useEditTodo } from "../query/update-todo";
import { useEditTodoInstance } from "../query/update-todo-instance";
import { useReorderTodo } from "../query/reorder-todo";
import TodoMutationProvider from "@/providers/TodoMutationProvider";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import TodoFilterBar from "./TodoFilterBar";
import { formatDateInTZ } from "@/lib/date/formatDateinTZ";

const TodayTodoContainer = () => {
  const locale = useLocale();
  const userTZ = useUserTimezone();
  const appDict = useTranslations("app")
  const { preferences } = useUserPreferences();
  const { todos, todoLoading } = useTodo();
  const [containerHovered, setContainerHovered] = useState(false);
  const pinnedTodos = useMemo(() =>
    todos.filter(({ pinned }) => pinned),
    [todos]
  );
  const unpinnedTodos = useMemo(() =>
    todos.filter(({ pinned }) => !pinned),
    [todos]
  );
  const { projectMetaData } = useProjectMetaData()
  const priorityMap = useRef({ "Low": 1, "Medium": 2, "High": 3 })
  const groupedTodos = useMemo(() => {
    return Object.groupBy((unpinnedTodos), (todo) => {
      switch (preferences?.groupBy) {
        case "dtstart":
          return getDisplayDate(todo.dtstart, false, locale, userTZ?.timeZone);
        case "project":
          return todo.projectID ? projectMetaData[todo.projectID].name : "None";
        case "due":
          return getDisplayDate(todo.due, false, locale, userTZ?.timeZone);
        case "duration":
          return todo.durationMinutes ? Number((Math.round(todo.durationMinutes / 60 * 10) / 10).toFixed(1)).toString() + " hr" : "No Duration";
        case "priority":
          return String(todo.priority);
        case "rrule":
          return todo.rrule ? new RRule(RRule.parseString(todo.rrule)).toText() : "Non repeating"
        default:
          return "-1"
      }
    }) as Record<string, TodoItemType[]>
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unpinnedTodos, preferences?.groupBy, locale, projectMetaData])

  const getTimeOr = (d: Date | null | undefined, fallback: number) =>
    d ? d.getTime() : fallback;

  const getNumberOr = (n: number | null | undefined, fallback: number) =>
    n ?? fallback;


  const sortedGroupedTodos = useMemo(() => {
    const sorted: Record<string, TodoItemType[]> = {};
    for (const [key, todos] of Object.entries(groupedTodos)) {
      sorted[key] = [...todos].sort((a, b) => {
        const dir = preferences?.direction === "Descending" ? 1 : -1;

        switch (preferences?.sortBy) {
          case "dtstart": {
            const aVal = getTimeOr(a.dtstart, Infinity);
            const bVal = getTimeOr(b.dtstart, Infinity);
            return dir * (aVal - bVal);
          }

          case "due": {
            const aVal = getTimeOr(a.due, Infinity);
            const bVal = getTimeOr(b.due, Infinity);
            return dir * (aVal - bVal);
          }

          case "duration": {
            const aVal = getNumberOr(a.durationMinutes, Infinity);
            const bVal = getNumberOr(b.durationMinutes, Infinity);
            return dir * (aVal - bVal);
          }

          case "priority":
            return (
              dir *
              (priorityMap.current[a.priority] -
                priorityMap.current[b.priority])
            );

          default:
            return a.order - b.order;
        }
      });
    }


    return sorted;
  }, [groupedTodos, preferences?.sortBy, preferences?.direction]);

  return (
    <TodoMutationProvider
      useCompleteTodo={useCompleteTodo}
      useDeleteTodo={useDeleteTodo}
      useEditTodo={useEditTodo}
      useEditTodoInstance={useEditTodoInstance}
      usePinTodo={usePinTodo}
      usePrioritizeTodo={usePrioritizeTodo}
      useReorderTodo={useReorderTodo}
    >
      <div className="mb-20" onMouseOver={() => (setContainerHovered(true))} onMouseOut={() => setContainerHovered(false)}>
        {/* Render Pinned Todos */}
        {pinnedTodos.length > 0 && (
          <TodoGroup
            className="relative my-10 rounded-md p-2 border border-border-muted bg-card shadow-md"
            todos={pinnedTodos}
          />
        )}
        <div className={clsx("mb-3", (!preferences?.groupBy && !preferences?.sortBy) && "flex items-end")}>
          <div className={clsx("flex items-end justify-start gap-2 w-full", (preferences?.groupBy || preferences?.sortBy) && "mb-4")}>
            <h3 className="text-2xl font-semibold select-none">
              {appDict("today")}
            </h3>
            <p className="text-muted-foreground text-lg">{formatDateInTZ(userTZ?.timeZone).slice(0, 6)}</p>
          </div>
          <TodoFilterBar
            containerHovered={containerHovered}
          />

        </div>
        <LineSeparator className="flex-1" />
        {todoLoading && <TodoListLoading />}

        {Object.entries(sortedGroupedTodos).map(([key, todo]) =>
          <div key={key}>
            <div className={clsx(key !== "-1" && "my-8")}>
              {key !== "-1" && <p className="text-muted-foreground text-sm">{preferences?.groupBy?.slice(0, 1).toUpperCase() + "" + preferences?.groupBy?.slice(1,)}<span className="text-lg">{" " + key} </span></p>}
              {key !== "-1" && <LineSeparator />}
              <TodoGroup
                todos={todo}
                className="flex flex-col bg-transparent gap-1"
              />
            </div>
          </div>
        )}
        <CreateTodoBtn />
      </div>
    </TodoMutationProvider>
  );
};

export default TodayTodoContainer;
