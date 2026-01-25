import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { PriorityIndicator } from "../../../PriorityIndicator";
import { useTodoForm } from "@/providers/TodoFormProvider";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const PriorityDropdownMenu = ({ }) => {
  const appDict = useTranslations("app");
  const { priority, setPriority } = useTodoForm();
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-fit h-fit !p-2 text-muted-foreground bg-inherit"
        >
          <LaurelWreath
            className={clsx(
              "w-4 h-4 sm:h-5 sm:w-5 transition-text duration-200 ease-out",
              priority === "Low"
                ? "text-lime"
                : priority === "Medium"
                  ? "text-orange"
                  : "text-red",
            )}
          />
          <p>{appDict("priority")}</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="min-w-[150px] text-foreground flex flex-col p-2 items-start justify-center">
        <Button
          className="hover:bg-popover-accent w-full justify-start p-2"
          variant={"ghost"}
          onClick={() => setPriority("Low")}
        >
          <PriorityIndicator
            level={1}
            className="h-4 w-4"
            isSelected={priority == "Low"}
          />
          {appDict("normal")}
        </Button>
        <Button
          className="hover:bg-popover-accent w-full  justify-start p-2"
          variant={"ghost"}
          onClick={() => setPriority("Medium")}
        >
          <PriorityIndicator
            level={2}
            className={clsx("h-4 w-4")}
            isSelected={priority == "Medium"}
          />
          {appDict("important")}
        </Button>
        <Button
          className="hover:bg-popover-accent w-full  justify-start p-2"
          variant={"ghost"}
          onClick={() => setPriority("High")}
        >
          <PriorityIndicator
            level={3}
            className={clsx("h-4 w-4")}
            isSelected={priority == "High"}
          />
          {appDict("urgent")}
        </Button>
      </PopoverContent>
    </Popover>
  );
};

export default PriorityDropdownMenu;
