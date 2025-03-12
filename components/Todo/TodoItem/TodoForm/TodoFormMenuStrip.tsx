import clsx from "clsx";
import DayMenu from "../DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import { TodoItemType } from "@/types";
import React, { SetStateAction } from "react";
import { DateRange } from "react-day-picker";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";

import {
  MenuContainer,
  MenuContent,
  MenuItem,
  MenuTrigger,
} from "@/components/ui/Menu";
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
        <DayMenu todo={todo} date={date} setDate={setDate} />
      </div>
      <MenuContainer>
        <MenuTrigger className="hover:text-white border text-sm">
          <LaurelWreath
            className={clsx(
              "w-5 h-5",
              priority === "Low"
                ? "text-lime"
                : priority === "Medium"
                ? "text-orange"
                : "text-red"
            )}
          />
          priority
        </MenuTrigger>
        <MenuContent>
          <MenuItem onClick={() => setPriority("Low")}>
            <PriorityIndicator level={1} className={clsx("h-6 w-6")} />
            level 1
          </MenuItem>
          <MenuItem onClick={() => setPriority("Medium")}>
            <PriorityIndicator level={2} className={clsx("h-6 w-6")} />
            level 2
          </MenuItem>
          <MenuItem onClick={() => setPriority("High")}>
            <PriorityIndicator level={3} className={clsx("h-6 w-6")} />
            level 3
          </MenuItem>
        </MenuContent>
      </MenuContainer>
      <div className="flex gap-2 p-1 border rounded-sm text-sm hover:bg-border hover:text-white hover:cursor-pointer">
        <Repeat className="w-5 h-5" />
        Repeat
      </div>
    </div>
  );
};
export default TodoFormMenuStrip;
