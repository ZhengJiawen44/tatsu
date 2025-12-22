import { TodoItemType } from "@/types";
import { endOfDay, startOfDay } from "date-fns";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { NonNullableDateRange } from "@/types";
// Types for context values
interface TodoFormContextType {
  todoItem?: TodoItemType;
  title: string;
  setTitle: React.Dispatch<SetStateAction<string>>;
  desc: string;
  setDesc: React.Dispatch<SetStateAction<string>>;
  priority: "Low" | "Medium" | "High";
  setPriority: React.Dispatch<SetStateAction<"Low" | "Medium" | "High">>;
  dateRange: NonNullableDateRange;
  setDateRange: React.Dispatch<SetStateAction<NonNullableDateRange>>;
  rrule: string | null;
  setRrule: React.Dispatch<SetStateAction<string | null>>;
  timeZone: string;
}

// Props for the provider
interface TodoFormProviderProps {
  todoItem?: TodoItemType;
  children: React.ReactNode;
}

const TodoFormContext = createContext<TodoFormContextType | undefined>(
  undefined,
);

const TodoFormProvider = ({ children, todoItem }: TodoFormProviderProps) => {
  const [title, setTitle] = useState<string>(todoItem?.title || "");
  const [desc, setDesc] = useState<string>(todoItem?.description || "");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">(
    todoItem?.priority || "Low",
  );

  const [dateRange, setDateRange] = useState<NonNullableDateRange>({
    from: todoItem?.dtstart ?? startOfDay(new Date()),
    to: todoItem?.due ?? endOfDay(new Date()),
  });

  const [rrule, setRrule] = useState(todoItem?.rrule || null);
  const timeZone =
    todoItem?.timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone;

  const contextValue: TodoFormContextType = {
    todoItem,
    title,
    setTitle,
    desc,
    setDesc,
    priority,
    setPriority,
    dateRange,
    setDateRange,
    rrule,
    setRrule,
    timeZone,
  };

  return (
    <TodoFormContext.Provider value={contextValue}>
      {children}
    </TodoFormContext.Provider>
  );
};

export default TodoFormProvider;

// Custom hook to use the TodoForm context
export function useTodoForm() {
  const context = useContext(TodoFormContext);
  if (!context) {
    throw new Error("useTodoForm must be used within TodoFormProvider");
  }
  return context;
}
