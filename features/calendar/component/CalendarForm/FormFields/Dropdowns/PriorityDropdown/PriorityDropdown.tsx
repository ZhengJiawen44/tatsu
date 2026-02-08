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

type PriorityDropdownMenuProps = {
  priority: TodoItemType["priority"];
  setPriority: React.Dispatch<
    React.SetStateAction<TodoItemType["priority"]>
  >;
};

const PriorityDropdownMenu = ({
  setPriority,
}: PriorityDropdownMenuProps) => {
  const appDict = useTranslations("app");

  return (
    <DropdownMenu modal={true}>
      <DropdownMenuTrigger className="bg-popover border p-2 text-sm flex justify-center items-center gap-2 hover:bg-popover-border rounded-md hover:text-foreground">
        <p className="hidden sm:block">{appDict("priority")}</p>
        <ChevronDown className="w-4 h-4 text-muted-foreground" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[150px] text-foreground">
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("Low")}
        >
          <Flag className="w-5 h-5 text-lime" />
          {appDict("normal")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("Medium")}
        >
          <Flag className="w-5 h-5 text-orange" />

          {appDict("important")}
        </DropdownMenuItem>
        <DropdownMenuItem
          className="hover:text-foreground hover:bg-popover-accent"
          onClick={() => setPriority("High")}
        >
          <Flag className="w-5 h-5 text-red" />

          {appDict("urgent")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default PriorityDropdownMenu;