import { TodoItemType } from "@/types";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

//  types for context values
interface TodoFormContextType {
  todoItem: TodoItemType;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<SetStateAction<boolean>>;
}

//  props for the provider
interface TodoFormProviderProps {
  todoItem: TodoItemType;
  children: React.ReactNode;
}

const todoFormContext = createContext<TodoFormContextType | undefined>(
  undefined
);

const TodoFormProvider = ({ children, todoItem }: TodoFormProviderProps) => {
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const contextValue = {
    todoItem,
    displayForm,
    setDisplayForm,
  };

  return (
    <todoFormContext.Provider value={contextValue}>
      {children}
    </todoFormContext.Provider>
  );
};

export default TodoFormProvider;

// Custom hook to use the TodoForm context
export function useTodoForm() {
  const context = useContext(todoFormContext);
  if (!context) {
    throw new Error("useTodoForm must be used within TodoFormProvider");
  }
  return context;
}
