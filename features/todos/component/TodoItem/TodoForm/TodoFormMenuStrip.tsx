
import clsx from "clsx";
import DayMenu from "./DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import React from "react";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { format } from "date-fns";
import { useTodoForm } from "@/providers/TodoFormProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const TodoFormMenuStrip = () => {
  const { priority, setPriority, setRepeatInterval } = useTodoForm();

  return (
    <div className="flex justify-center items-center gap-2">
      <div className="p-1 border rounded-sm text-sm hover:bg-border hover:text-white">
        <DayMenu />
      </div>

      {/*priority menu*/}
      <DropdownMenu>
        <DropdownMenuTrigger className="border text-sm flex justify-center items-center gap-2 hover:bg-border rounded-md p-1 hover:text-white">
          <LaurelWreath
            className={clsx(
              "w-5 h-5 transition-text duration-200 ease-out",
              priority === "Low"
                ? "text-lime"
                : priority === "Medium"
                  ? "text-orange"
                  : "text-red"
            )}
          />
          <p className="hidden sm:block">Priority</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[150px] text-foreground">
          <DropdownMenuItem className="hover:text-white" onClick={() => setPriority("Low")} >
            <PriorityIndicator level={1} className="h-4 w-4" isSelected={priority == "Low"} />
            normal
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:text-white" onClick={() => setPriority("Medium")}>
            <PriorityIndicator level={2} className={clsx("h-4 w-4")} isSelected={priority == "Medium"} />
            important
          </DropdownMenuItem>
          <DropdownMenuItem className="hover:text-white" onClick={() => setPriority("High")} >
            <PriorityIndicator level={3} className={clsx("h-4 w-4")} isSelected={priority == "High"} />
            urgent
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/*repeat menu*/}
      <DropdownMenu>
        <DropdownMenuTrigger className="border text-sm flex justify-center items-center gap-2 hover:bg-border rounded-md p-1 hover:text-white">
          <Repeat className="w-5 h-5" />
          <p className="hidden sm:block text-sm">Repeat</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[150px] text-foreground">
          <DropdownMenuItem onClick={() => setRepeatInterval("daily")} >
            daily
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between" onClick={() => setRepeatInterval("weekly")} >
            weekly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "EEE")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem className="flex justify-between" onClick={() => setRepeatInterval("monthly")}>
            monthly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "do")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="flex justify-between" onClick={() => setRepeatInterval("weekdays")}>
            every weekday
            <p className="text-xs text-card-foreground-muted">(Mon-Fri)</p>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TodoFormMenuStrip;
