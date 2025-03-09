import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

//  types for context values
interface TodoMenuContextType {
  id: string;
  showContent: boolean;
  setShowContent: React.Dispatch<SetStateAction<boolean>>;
  displayForm: boolean;
  setDisplayForm: React.Dispatch<SetStateAction<boolean>>;
  pinned: boolean;
}

//  props for the provider
interface TodoMenuProviderProps {
  id: string;
  pinned: boolean;
  children: React.ReactNode;
}

const todoMenuContext = createContext<TodoMenuContextType | undefined>(
  undefined
);

const TodoMenuProvider = ({
  children,
  id,

  pinned,
}: TodoMenuProviderProps) => {
  const [showContent, setShowContent] = useState<boolean>(false);
  const [displayForm, setDisplayForm] = useState<boolean>(false);
  const contextValue = {
    id,
    showContent,
    setShowContent,
    pinned,
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
