import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface todoMenuProviderProp {
  showContent: boolean;
  setShowContent: React.Dispatch<SetStateAction<boolean>>;
}
const todoMenuContext = createContext<todoMenuProviderProp | null>(null);

const TodoMenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [showContent, setShowContent] = useState(false);
  return (
    <todoMenuContext.Provider value={{ showContent, setShowContent }}>
      {children}
    </todoMenuContext.Provider>
  );
};

export default TodoMenuProvider;

export function useTodoMenu() {
  const context = useContext(todoMenuContext);
  if (!context) {
    throw new Error("useTodoMenu must be used within todoMenuProvider");
  }

  return context;
}
