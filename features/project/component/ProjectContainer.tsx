"use client"
import React, { useMemo, useRef, useState } from "react";
import CreateTodoBtn from "./CreateTodoBtn";
import TodoListLoading from "../../../components/todo/component/TodoListLoading";
import TodoGroup from "@/components/todo/component/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import TodoFilterBar from "./TodoFilterBar";
import { getDisplayDate } from "@/lib/date/displayDate";
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
                    return getDisplayDate(todo.dtstart, false, locale);
                case "due":
                    return getDisplayDate(todo.due, false, locale);
                case "duration":
                    return String(todo.durationMinutes);
                case "priority":
                    return String(todo.priority);
                case "rrule":
                    return todo.rrule ? new RRule(RRule.parseString(todo.rrule)).toText() : "Non repeating"
                default:
                    return "-1"
            }
        }) as Record<string, TodoItemType[]>
    }, [unpinnedTodos, preferences?.groupBy, locale])

    const sortedGroupedTodos = useMemo(() => {
        const sorted: Record<string, TodoItemType[]> = {};
        for (const [key, todos] of Object.entries(groupedTodos)) {
            sorted[key] = [...todos].sort((a, b) => {
                switch (preferences?.sortBy) {
                    case "dtstart":
                        return preferences.direction == "Descending" ? a.dtstart.getTime() - b.dtstart.getTime() : b.dtstart.getTime() - a.dtstart.getTime();
                    case "due":
                        return preferences.direction == "Descending" ? a.due.getTime() - b.due.getTime() : b.due.getTime() - a.due.getTime();
                    case "duration":
                        return preferences.direction == "Descending" ? a.durationMinutes - b.durationMinutes : b.durationMinutes - a.durationMinutes;
                    case "priority":
                        return preferences.direction == "Descending" ? priorityMap.current[a.priority] - priorityMap.current[b.priority] : priorityMap.current[b.priority] - priorityMap.current[a.priority];
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
                {projectTodosLoading && <TodoListLoading />}
                {/* Render Pinned Todos */}
                {pinnedTodos.length > 0 && (

                    <TodoGroup
                        className="relative my-10 rounded-md p-2 border border-border-muted bg-card shadow-md"
                        todos={pinnedTodos}
                    />
                )}
                <div className="mb-3">
                    <div className="sm:flex items-center justify-between gap-2">
                        <h3 className="text-2xl font-semibold select-none">
                            {projectMetaData[id]?.name}
                        </h3>
                        <TodoFilterBar
                            containerHovered={containerHovered}
                        />
                    </div>
                    <LineSeparator className="flex-1" />
                </div>
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
