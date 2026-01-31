"use client";
import React from "react";
import { useOverdueTodo } from "../query/get-overdue-todo";
import TodoListLoading from "@/components/ui/TodoListLoading";
import TodoGroup from "@/components/todo/component/TodoGroup";
import LineSeparator from "@/components/ui/lineSeparator";
import { usePinOverdueTodo } from "../query/pin-overdue-todo";
import { useDeleteOverdueTodo } from "../query/delete-overdue-todo";
import { usePrioritizeOverdueTodo } from "../query/prioritize-overdue-todo";
import { useEditOverdueTodo } from "../query/update-overdue-todo";
import { useEditOverdueTodoInstance } from "../query/update-overdue-todo-instance";
import { useReorderOverdueTodo } from "../query/reorder-overdue-todo";
import { useCompleteOverdueTodo } from "../query/complete-overdue-todo";
import TodoMutationProvider from "@/providers/TodoMutationProvider";

export default function OverDueTodoContainer() {
    const { todos: overdueTodos, isLoading, fetchNextPage, hasNextPage } =
        useOverdueTodo();

    if (!overdueTodos.length) return null
    return (
        <div className="mb-20">
            <div className="flex items-center gap-2 mt-10 mb-4">
                <h3 className="text-lg font-semibold select-none">Overdue</h3>
                <LineSeparator className="flex-1" />
            </div>
            <div>
                {isLoading && <TodoListLoading />}

                <TodoMutationProvider
                    useCompleteTodo={useCompleteOverdueTodo}
                    useDeleteTodo={useDeleteOverdueTodo}
                    useEditTodo={useEditOverdueTodo}
                    useEditTodoInstance={useEditOverdueTodoInstance}
                    usePinTodo={usePinOverdueTodo}
                    usePrioritizeTodo={usePrioritizeOverdueTodo}
                    useReorderTodo={useReorderOverdueTodo}
                >
                    <TodoGroup todos={overdueTodos} overdue={true} />
                </TodoMutationProvider>
                {hasNextPage && (
                    <button
                        className="my-10 ml-[2px] w-fit group flex gap-3 items-center hover:cursor-pointer transition-all duration-200"
                        onClick={() => fetchNextPage()}
                    >
                        <p className="text-muted-foreground text-[0.95rem] group-hover:text-foreground">
                            Show more
                        </p>
                    </button>
                )}
            </div>
        </div >
    );
}
