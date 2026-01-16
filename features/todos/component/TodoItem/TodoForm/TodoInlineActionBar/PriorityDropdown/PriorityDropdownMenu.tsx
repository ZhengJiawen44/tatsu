import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { PriorityIndicator } from "../../../PriorityIndicator";
import { useTodoForm } from "@/providers/TodoFormProvider";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

const PriorityDropdownMenu = ({}) => {
  const { priority, setPriority } = useTodoForm();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="w-fit h-fit p-2 text-muted-foreground bg-inherit"
        >
          <LaurelWreath
            className={clsx(
              "w-5 h-5 transition-text duration-200 ease-out",
              priority === "Low"
                ? "text-lime"
                : priority === "Medium"
                  ? "text-orange"
                  : "text-red",
            )}
          />
          <p className="hidden sm:block">Priority</p>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="min-w-[150px] text-foreground">
        <DropdownMenuItem onClick={() => setPriority("Low")}>
          <PriorityIndicator
            level={1}
            className="h-4 w-4"
            isSelected={priority == "Low"}
          />
          Normal
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPriority("Medium")}>
          <PriorityIndicator
            level={2}
            className={clsx("h-4 w-4")}
            isSelected={priority == "Medium"}
          />
          Important
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setPriority("High")}>
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
