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
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

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
  const appDict = useTranslations("app");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-input p-2 text-sm flex justify-center items-center gap-2 hover:bg-accent rounded-md hover:text-foreground">
        <p className="hidden sm:block">{appDict("priority")}</p>
        <ChevronDown className="w-5 h-5" />
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
          {appDict("normal")}
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
          {appDict("important")}
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
          {appDict("urgent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriorityDropdownMenu;