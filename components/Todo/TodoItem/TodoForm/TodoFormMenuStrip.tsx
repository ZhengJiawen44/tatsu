import clsx from "clsx";
import DayPicker from "../DayPicker";
import { PriorityIndicator } from "../PriorityIndicator";
import { TodoItemType } from "@/types";
import React, { SetStateAction } from "react";
import { DateRange } from "react-day-picker";

interface TodoFormMenuStripProps {
  todo?: TodoItemType;
  date: DateRange | undefined;
  setDate: React.Dispatch<SetStateAction<DateRange | undefined>>;
  priority: "Low" | "Medium" | "High";
  setPriority: React.Dispatch<SetStateAction<"Low" | "Medium" | "High">>;
}

const TodoFormMenuStrip = ({
  todo,
  date,
  setDate,
  priority,
  setPriority,
}: TodoFormMenuStripProps) => {
  return (
    <div className="flex justify-center items-center gap-2">
      <div className="p-1 border rounded-sm text-sm hover:bg-border hover:text-white">
        <DayPicker todo={todo} date={date} setDate={setDate} />
      </div>
      <div className="flex gap-1">
        <PriorityIndicator
          level={1}
          onClick={() => setPriority("Low")}
          className={clsx(
            "h-6 w-6",
            priority === "Low" && "bg-lime text-black"
          )}
        />
        <PriorityIndicator
          level={2}
          onClick={() => setPriority("Medium")}
          className={clsx(
            "h-6 w-6",
            priority === "Medium" && "bg-orange text-black"
          )}
        />
        <PriorityIndicator
          level={3}
          onClick={() => setPriority("High")}
          className={clsx(
            "h-6 w-6",
            priority === "High" && "bg-red text-black"
          )}
        />
      </div>
    </div>
  );
};
export default TodoFormMenuStrip;
