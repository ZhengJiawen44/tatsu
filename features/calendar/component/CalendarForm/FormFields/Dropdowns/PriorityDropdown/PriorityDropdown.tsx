import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Flag } from "lucide-react";
import { TodoItemType } from "@/types";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import clsx from "clsx";

type PriorityDropdownMenuProps = {
  priority: TodoItemType["priority"];
  setPriority: React.Dispatch<
    React.SetStateAction<TodoItemType["priority"]>
  >;
};

const PriorityDropdownMenu = ({
  priority,
  setPriority,
}: PriorityDropdownMenuProps) => {
  const appDict = useTranslations("app");

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger className="cursor-pointer bg-popover border p-2 text-sm flex justify-center items-center gap-2 hover:bg-popover-border rounded-md hover:text-foreground">
        <Flag className={clsx("w-4 h-4", priority == "Low" ? "fill-lime text-lime" : priority == "Medium" ? "fill-orange text-orange" : "fill-red text-red")} />
        <p className="hidden sm:block">{appDict("priority")}</p>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[150px] text-foreground space-y-1">
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("Low")}
        >
          <Flag className={clsx("w-4 h-4 text-lime", priority == "Low" && "fill-lime")} />
          {appDict("normal")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("Medium")}
        >
          <Flag className={clsx("w-4 h-4 text-orange", priority == "Medium" && "fill-orange")} />

          {appDict("important")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("High")}
        >
          <Flag className={clsx("w-4 h-4 text-red", priority == "High" && "fill-red")} />

          {appDict("urgent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriorityDropdownMenu;