import React from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Flag } from "lucide-react";
import { useTodoForm } from "@/providers/TodoFormProvider";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

const PriorityDropdownMenu = ({ }) => {
  const appDict = useTranslations("app");
  const { priority, setPriority } = useTodoForm();
  const itemClass =
    "flex justify-start items-center p-1.5 px-2 gap-2 rounded w-full hover:bg-popover-accent cursor-pointer m-auto text-sm";

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-fit h-fit p-2! cursor-pointer text-muted-foreground bg-inherit"
        >
          <Flag
            className={clsx(
              "w-4 h-4 transition-text duration-200 ease-out",
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
      <PopoverContent className="min-w-38 text-foreground flex flex-col p-1 items-start justify-center">
        <button
          className={itemClass}
          onClick={() => setPriority("Low")}
        >
          <Flag className={clsx("w-4 h-4 text-lime", priority == "Low" && "fill-lime")} />
          {appDict("normal")}
        </button>
        <button
          className={itemClass}
          onClick={() => setPriority("Medium")}
        >
          <Flag className={clsx("w-4 h-4 text-orange", priority == "Medium" && "fill-orange")} />
          {appDict("important")}
        </button>
        <button
          className={itemClass}
          onClick={() => setPriority("High")}
        >
          <Flag className={clsx("w-4 h-4 text-red", priority == "High" && "fill-red")} />

          {appDict("urgent")}
        </button>
      </PopoverContent>
    </Popover>
  );
};

export default PriorityDropdownMenu;
