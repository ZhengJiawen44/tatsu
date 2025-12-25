import clsx from "clsx";
import DayMenu from "./DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { format, isThisYear } from "date-fns";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { TbRefreshDot } from "react-icons/tb";
import Trash from "@/components/ui/icon/trash";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { RRule } from "rrule";
import { masqueradeAsUTC } from "@/features/todos/lib/masqueradeAsUTC";
import { useMemo } from "react";

const TodoFormMenuStrip = () => {
  const { priority, setPriority, rrule, setRrule, dateRange } = useTodoForm();
  /*
   * so i have to basically masquerade my local time as UTC and then
   * pass it to dtstart, and when i get my result back i have to convert
   * the output to UTC, even though the output is already in UTC but i have to convert it
   */

  const rruleObject = useMemo(() => {
    if (!rrule) return null;
    const options = RRule.parseString(rrule);
    options.dtstart = masqueradeAsUTC(dateRange.from);
    return new RRule(options);
  }, [rrule, dateRange]);
  console.log(rrule);

  const nextRepeatDate = useMemo(
    () => rruleObject?.after(masqueradeAsUTC(dateRange.from)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rrule, dateRange],
  );

  return (
    <div className="flex justify-center items-center gap-2">
      {/* day picker*/}
      <div className="border rounded-sm text-sm hover:bg-accent hover:text-white cursor-pointer">
        <DayMenu />
      </div>

      {/*priority menu*/}
      <DropdownMenu>
        <DropdownMenuTrigger className="border text-sm flex justify-center items-center gap-2 hover:bg-accent rounded-md p-1 hover:text-white">
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
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[150px] text-foreground">
          <DropdownMenuItem
            className="hover:text-white"
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
            className="hover:text-white"
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
            className="hover:text-white"
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

      {/*repeat menu*/}
      <DropdownMenu>
        <DropdownMenuTrigger className="border text-sm flex justify-center items-center gap-2 hover:bg-accent rounded-md p-1 hover:text-white">
          <Repeat className="w-5 h-5" />
          <p className="hidden sm:block text-sm">Repeat</p>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="min-w-[150px] text-foreground">
          <DropdownMenuItem
            onClick={() =>
              setRrule(() => {
                return new RRule({
                  freq: RRule.DAILY,
                }).toString();
              })
            }
          >
            Daily
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              setRrule(() => {
                return new RRule({
                  freq: RRule.WEEKLY,
                }).toString();
              })
            }
          >
            Weekly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "EEE")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              setRrule(() => {
                return new RRule({
                  freq: RRule.MONTHLY,
                }).toString();
              })
            }
          >
            Monthly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "do")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              setRrule(() => {
                return new RRule({
                  freq: RRule.DAILY,
                  byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                }).toString();
              })
            }
          >
            Every weekday
            <p className="text-xs text-card-foreground-muted">(Mon-Fri)</p>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <CustomRepeatModalMenu
              rruleObject={rruleObject}
              className="w-full hover:bg-accent"
            />
          </DropdownMenuItem>

          {rrule && (
            <>
              <DropdownMenuSeparator className="mt-[5px]" />
              <DropdownMenuItem
                className="text-red gap-1"
                onClick={() => setRrule(null)}
              >
                <Trash />
                Clear repeat
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {rrule && (
        <Tooltip>
          <TooltipTrigger
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <TbRefreshDot
              className={clsx(
                "w-4 h-4 text-orange cursor-pointer hover:-rotate-180 transition-rotate duration-500",
              )}
            />
          </TooltipTrigger>
          <TooltipContent>
            <p>
              {nextRepeatDate
                ? `This todo is next scheduled for ${isThisYear(new Date()) ? format(rruleDateToLocal(nextRepeatDate), "dd MMM") : format(nextRepeatDate, "dd MMM yyyy")} (${rruleObject?.toText()})`
                : "This todo has reached the end of repeat"}
            </p>
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
};

export default TodoFormMenuStrip;

function rruleDateToLocal(date: Date) {
  return new Date(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    date.getUTCDate(),
    date.getUTCHours(),
    date.getUTCMinutes(),
    date.getUTCSeconds(),
  );
}
