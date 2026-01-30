import { changeMapType } from "@/features/todayTodos/query/reorder-todo";
import { TodoItemTypeWithDateChecksum } from "@/features/todayTodos/query/update-todo";
import { TodoItemType } from "@/types";
import { QueryStatus, UseMutateFunction } from "@tanstack/react-query";
import React, { createContext, useContext } from "react";

// hook types
export type UseDeleteTodoType = () => {
    deleteMutateFn: (variables: { id: string }) => void;
    deletePending: boolean;
}
export type useCompleteTodoType = () => {
    completeMutateFn: UseMutateFunction<void, Error, TodoItemType, { oldTodos: TodoItemType[]; }>;
    completePending: boolean
}
export type usePinTodoType = () => {
    pinMutateFn: UseMutateFunction<void, Error, TodoItemType, { oldTodos: unknown; }>;
    pinPending: boolean
}
export type usePrioritizeTodoType = () => {
    prioritizeMutateFn: UseMutateFunction<void, Error, { id: string; level: "Low" | "Medium" | "High"; isRecurring: boolean; }, { oldTodos: TodoItemType[] | undefined; }>;
    prioritizePending: boolean
}

export type useReorderTodoType = () => {
    reorderMutateFn: UseMutateFunction<void, Error, changeMapType[], unknown>;
    reorderPending: boolean
}

export type useEditTodoType = () => {
    editTodoMutateFn: UseMutateFunction<void, Error, TodoItemTypeWithDateChecksum, { oldTodos: TodoItemType[] | undefined; }>
    editTodoStatus: QueryStatus | "idle"
}

export type useEditTodoInstanceType = (setEditInstanceOnly: React.Dispatch<React.SetStateAction<boolean>> | undefined) => {
    editTodoInstanceMutateFn: UseMutateFunction<void, Error, TodoItemType, { oldTodos: TodoItemType[] | undefined; }>
    editTodoInstanceStatus: QueryStatus | "idle"
}

export type TodoMutaionProviderProps = {
    useDeleteTodo: UseDeleteTodoType,
    useCompleteTodo: useCompleteTodoType,
    usePinTodo: usePinTodoType,
    usePrioritizeTodo: usePrioritizeTodoType,
    useReorderTodo: useReorderTodoType,
    useEditTodoInstance: useEditTodoInstanceType,
    useEditTodo: useEditTodoType,
    children: React.ReactNode
}

const TodoMutationContext = createContext<Omit<TodoMutaionProviderProps, "children"> | null>(null)


export default function TodoMutationProvider({ useDeleteTodo, useCompleteTodo, usePinTodo, usePrioritizeTodo, useReorderTodo, useEditTodo, useEditTodoInstance, children }: TodoMutaionProviderProps) {
    return (
        <TodoMutationContext.Provider value={{ useDeleteTodo, useCompleteTodo, usePinTodo, usePrioritizeTodo, useReorderTodo, useEditTodo, useEditTodoInstance }}>
            {children}
        </TodoMutationContext.Provider>
    )
}

export function useTodoMutation() {
    const context = useContext(TodoMutationContext)
    if (!context) throw new Error('useTodoMutation must be used within TodoMutationProvider');
    return context
}