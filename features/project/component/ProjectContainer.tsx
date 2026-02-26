"use client"
import React, { useMemo, useRef, useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import TodoListLoading from "../../../components/todo/component/TodoListLoading";
import TodoGroup from "@/components/todo/component/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import TodoFilterBar from "./TodoFilterBar";
import { getDisplayDate } from "@/lib/date/displayDate";
import { useUserTimezone } from "@/features/user/query/get-timezone";
import { RRule } from "rrule";
import { TodoItemType } from "@/types";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useUserPreferences } from "@/providers/UserPreferencesProvider";
import { usePinProjectTodo } from "../query/pin-project-todo";
import { useCompleteProjectTodo } from "../query/complete-project-todo";
import { useDeleteProjectTodo } from "../query/delete-project-todo";
import { usePrioritizeProjectTodo } from "../query/prioritize-project-todo";
import { useEditProjectTodo } from "../query/update-project-todo";
import { useEditProjectTodoInstance } from "../query/update-project-todo-instance";
import { useReorderProjectTodo } from "../query/reorder-project-todo";
import TodoMutationProvider from "@/providers/TodoMutationProvider";
import { useProject } from "../query/get-project-todos";
import { useProjectMetaData } from "@/components/Sidebar/Project/query/get-project-meta";

const ProjectContainer = ({ id }: { id: string }) => {
    const locale = useLocale();
    const userTZ = useUserTimezone()
    const { projectMetaData } = useProjectMetaData();
    const { preferences } = useUserPreferences();
    const { projectTodos, projectTodosLoading } = useProject({ id });
    const [containerHovered, setContainerHovered] = useState(false);
    const pinnedTodos = useMemo(() =>
        projectTodos.filter(({ pinned }) => pinned),
        [projectTodos]
    );

    const unpinnedTodos = useMemo(() =>
        projectTodos.filter(({ pinned }) => !pinned),
        [projectTodos]
    );
    const priorityMap = useRef({ "Low": 1, "Medium": 2, "High": 3 })
    const groupedTodos = useMemo(() => {
        return Object.groupBy((unpinnedTodos), (todo) => {
            switch (preferences?.groupBy) {
                case "dtstart":
                    return getDisplayDate(todo.dtstart, false, locale, userTZ);
                case "project":
                    return todo.projectID ? projectMetaData[todo.projectID].name : "None";
                case "due":
                    return getDisplayDate(todo.due, false, locale, userTZ);
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
            useCompleteTodo={useCompleteProjectTodo}
            useDeleteTodo={useDeleteProjectTodo}
            useEditTodo={useEditProjectTodo}
            useEditTodoInstance={useEditProjectTodoInstance}
            usePinTodo={usePinProjectTodo}
            usePrioritizeTodo={usePrioritizeProjectTodo}
            useReorderTodo={useReorderProjectTodo}
        >
            <div className="mb-20" onMouseOver={() => (setContainerHovered(true))} onMouseOut={() => setContainerHovered(false)}>
                {/* Render Pinned Todos */}
                {pinnedTodos.length > 0 && (

                    <TodoGroup
                        className="relative my-10 rounded-md p-2 border border-border-muted bg-card shadow-md"
                        todos={pinnedTodos}
                    />
                )}
                <div className="mb-3">
                    <h3 className="text-2xl font-semibold select-none mb-4">
                        {projectMetaData[id]?.name}
                    </h3>
                    <TodoFilterBar
                        containerHovered={containerHovered}
                    />
                    <LineSeparator className="flex-1" />
                </div>
                {projectTodosLoading && <TodoListLoading />}

                {Object.entries(sortedGroupedTodos).map(([key, todo]) =>
                    <div key={key}>
                        <div className={clsx(key !== "-1" && "my-16")}>
                            {key !== "-1" && <p className="font-light text-muted-foreground text-sm">{preferences?.groupBy?.slice(0, 1).toUpperCase() + "" + preferences?.groupBy?.slice(1,)}<span className="text-lg">{" " + key} </span></p>}
                            {key !== "-1" && <LineSeparator />}
                            <TodoGroup
                                todos={todo}
                                className="flex flex-col bg-background gap-1"
                            />
                        </div>
                    </div>
                )}
                <CreateTodoBtn projectID={id} />
            </div>
        </TodoMutationProvider>
    );
};

export default ProjectContainer;
