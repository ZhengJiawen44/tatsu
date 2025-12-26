import { TodoItemType } from "@/types";
import { endOfDay, startOfDay } from "date-fns";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import { NonNullableDateRange } from "@/types";
import { Options, RRule } from "rrule";
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
  rruleOptions: Partial<Options> | null;
  setRruleOptions: React.Dispatch<SetStateAction<Partial<Options> | null>>;
  timeZone: string;
  repeatType:
    | "Daily"
    | "Weekly"
    | "Monthly"
    | "Yearly"
    | "Weekday"
    | "Custom"
    | null;
  instanceDate?: Date;
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

  const [rruleOptions, setRruleOptions] = useState(
    todoItem?.rrule ? RRule.parseString(todoItem.rrule) : null,
  );
  const timeZone =
    Intl.DateTimeFormat().resolvedOptions().timeZone ||
    todoItem?.timeZone ||
    "UTC";

  const repeatType =
    // Check for weekday pattern first (before generic byweekday check)
    rruleOptions?.freq === RRule.WEEKLY &&
    rruleOptions?.byweekday &&
    Array.isArray(rruleOptions.byweekday) &&
    rruleOptions.byweekday.length === 5 &&
    !rruleOptions?.bymonth &&
    !rruleOptions?.bymonthday &&
    !rruleOptions?.bysetpos &&
    !rruleOptions?.byweekno &&
    !rruleOptions?.byyearday &&
    !rruleOptions?.interval
      ? "Weekday"
      : // check for custom patterns
        rruleOptions?.bymonth ||
          rruleOptions?.bymonthday ||
          rruleOptions?.bysetpos ||
          rruleOptions?.byweekday ||
          rruleOptions?.byweekno ||
          rruleOptions?.byyearday ||
          (rruleOptions?.interval && rruleOptions.interval > 1)
        ? "Custom"
        : // check for simple patterns
          rruleOptions?.freq === RRule.DAILY
          ? "Daily"
          : rruleOptions?.freq === RRule.WEEKLY
            ? "Weekly"
            : rruleOptions?.freq === RRule.MONTHLY
              ? "Monthly"
              : rruleOptions?.freq === RRule.YEARLY
                ? "Yearly"
                : null;

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const instanceDate = useMemo(() => dateRange.from, []);
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
    rruleOptions,
    setRruleOptions,
    timeZone,
    repeatType,
    instanceDate,
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
