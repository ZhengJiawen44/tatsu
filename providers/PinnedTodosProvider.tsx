"use client"
import React, { useMemo } from "react";
import { useContext, createContext } from "react";
import { TodoItemType } from "@/types";
import { useTodo } from "@/features/todayTodos/query/get-todo";


interface PinnedTodosProviderContextProps {
  pinned: TodoItemType[];
}

const PinnedTodosProviderContext = createContext<
  PinnedTodosProviderContextProps | undefined
>(undefined);


const PinnedTodosProvider = ({ children }: { children: React.ReactNode }) => {
    const { todos, todoLoading } = useTodo();

    const pinned = useMemo(()=>todos.filter((todo)=>{return todo.pinned === true}), [todos, todoLoading])



  return (
    <PinnedTodosProviderContext.Provider
      value={{ pinned }}
    >
      {children}
    </PinnedTodosProviderContext.Provider>
  );
};

export default PinnedTodosProvider;

export const usePinnedTodos = () => {
  const context = useContext(PinnedTodosProviderContext);
  if (!context) {
    throw new Error(
      "usePinnedTodos must be used within PinnedTodos provider context",
    );
  }

  return context;
};
