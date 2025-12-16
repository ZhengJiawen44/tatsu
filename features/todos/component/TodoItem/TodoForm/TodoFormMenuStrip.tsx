import clsx from "clsx";
import DayMenu from "./DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import React, { useEffect } from "react";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { addDays, differenceInDays, endOfDay, format, isTomorrow } from "date-fns";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { TbRefreshDot } from "react-icons/tb";
import Trash from "@/components/ui/icon/trash";
import { getNextRepeatDate } from "@/features/todos/lib/getNextRepeatDate";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { startOfDay } from "date-fns";
const TodoFormMenuStrip = () => {

  const { priority, setPriority, repeatInterval, setRepeatInterval, dateRange, setDateRange, nextRepeatDate, setNextRepeatDate } = useTodoForm();
  useEffect(() => {
    if (!repeatInterval) {
      setNextRepeatDate(null);
      return;
    }

    //if the todo was in the past, bring it to the present
    if (dateRange.from < startOfDay(new Date())) {
      const duration = differenceInDays(dateRange.to, dateRange.from);
      const newFrom = getNextRepeatDate(dateRange.from, repeatInterval) as Date;
      const newTo = endOfDay(addDays(new Date(newFrom), duration));
      setDateRange({ from: newFrom, to: newTo });
      setNextRepeatDate(getNextRepeatDate(newFrom, repeatInterval));
    } else {
      //if todo is in the present then just set its nextRepeatDate
      setNextRepeatDate(getNextRepeatDate(dateRange.from, repeatInterval));
    }

  }, [repeatInterval, dateRange.from]);

  return (
    <div className="flex justify-center items-center gap-2">

      {/* day picker*/}
      <div className="border rounded-sm text-sm hover:bg-border hover:text-white cursor-pointer">
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
          {repeatInterval &&
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red gap-1" onClick={() => setRepeatInterval(null)}>
                <Trash />
                reset
              </DropdownMenuItem>
            </>
          }
        </DropdownMenuContent>
      </DropdownMenu>
      {repeatInterval && nextRepeatDate &&
        <Tooltip>
          <TooltipTrigger onClick={(e) => { e.preventDefault() }}>
            <TbRefreshDot className={clsx("w-4 h-4 text-orange cursor-pointer hover:-rotate-180 transition-rotate duration-500")} />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              This todo is next scheduled for{" "}
              {isTomorrow(nextRepeatDate!)
                ? "Tomorrow"
                : format(
                  nextRepeatDate!,
                  nextRepeatDate!.getFullYear() === new Date().getFullYear() ? "dd MMM" : "dd MMM yy"
                )}{" "}
              ({repeatInterval})
            </p>
          </TooltipContent>
        </Tooltip>
      }
    </div>
  );
};

export default TodoFormMenuStrip;
