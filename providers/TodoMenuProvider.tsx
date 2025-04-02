import { TodoItemType } from "@/types";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

//  types for context values
interface TodoMenuContextType {
  todoItem: TodoItemType;
  showContent: boolean;
  setShowContent: React.Dispatch<SetStateAction<boolean>>;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<SetStateAction<boolean>>;
}

//  props for the provider
interface TodoMenuProviderProps {
  todoItem: TodoItemType;
  children: React.ReactNode;
}

const todoMenuContext = createContext<TodoMenuContextType | undefined>(
  undefined
);

const TodoMenuProvider = ({ children, todoItem }: TodoMenuProviderProps) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const contextValue = {
    todoItem,
    showContent,
    setShowContent,
    displayForm,
    setDisplayForm,
  };

  return (
    <todoMenuContext.Provider value={contextValue}>
      {children}
    </todoMenuContext.Provider>
  );
};

export default TodoMenuProvider;

// Custom hook to use the TodoMenu context
export function useTodoMenu() {
  const context = useContext(todoMenuContext);
  if (!context) {
    throw new Error("useTodoMenu must be used within TodoMenuProvider");
  }
  return context;
}
