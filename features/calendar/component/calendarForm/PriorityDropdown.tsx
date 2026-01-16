import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PriorityIndicator } from "@/features/todos/component/TodoItem/PriorityIndicator";
import clsx from "clsx";
import { CalendarTodoItemType } from "@/types";
import { BsCaretDown } from "react-icons/bs";
type PriorityDropdownMenuProps = {
  priority: CalendarTodoItemType["priority"];
  setPriority: React.Dispatch<
    React.SetStateAction<CalendarTodoItemType["priority"]>
  >;
};
const PriorityDropdownMenu = ({
  priority,
  setPriority,
}: PriorityDropdownMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-input p-2 text-sm flex justify-center items-center gap-2 hover:bg-accent rounded-md hover:text-foreground">
        <p className="hidden sm:block">Priority</p>
        <BsCaretDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[150px] text-foreground">
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("Low")}
        >
          <PriorityIndicator
            level={1}
            className="h-4 w-4"
            isSelected={priority == "Low"}
          />
          Normal
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("Medium")}
        >
          <PriorityIndicator
            level={2}
            className={clsx("h-4 w-4")}
            isSelected={priority == "Medium"}
          />
          Important
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("High")}
        >
          <PriorityIndicator
            level={3}
            className={clsx("h-4 w-4")}
            isSelected={priority == "High"}
          />
          Urgent
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriorityDropdownMenu;
