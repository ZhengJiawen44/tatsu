import clsx from "clsx";
import DayMenu from "./DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import React from "react";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { format, isThisYear } from "date-fns";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { TbRefreshDot } from "react-icons/tb";
import Trash from "@/components/ui/icon/trash";
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
import { datetime, RRule } from "rrule";

const TodoFormMenuStrip = () => {
  const { priority, setPriority, rrule, setRrule, dateRange, timeZone } =
    useTodoForm();

  const nextRepeatDate = rrule?.after(
    datetime(
      dateRange.from.getFullYear(),
      dateRange.from.getMonth() + 1,
      dateRange.from.getDate(),
      dateRange.from.getHours(),
      dateRange.from.getMinutes(),
      dateRange.from.getSeconds(),
    ),
  );
  // console.log(rrule?.options);
  // console.log(rrule?.all((_, i) => i < 3));
  if (nextRepeatDate) console.log(rruleDateToLocal(nextRepeatDate));

  /*
   * so i have to basically masquerade my local time as UTC and then
   * pass it to dtstart, and when i get my result back i have to convert
   * the out put to UTC, even though the output is already in UTC bu i have to convert it
   */

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
            normal
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
            important
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
            urgent
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
                  dtstart: datetime(
                    dateRange.from.getFullYear(),
                    dateRange.from.getMonth() + 1,
                    dateRange.from.getDate(),
                    dateRange.from.getHours(),
                    dateRange.from.getMinutes(),
                    dateRange.from.getSeconds(),
                  ),
                  tzid: timeZone,
                  freq: RRule.DAILY,
                });
              })
            }
          >
            daily
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              setRrule(() => {
                return new RRule({
                  dtstart: datetime(
                    dateRange.from.getFullYear(),
                    dateRange.from.getMonth() + 1,
                    dateRange.from.getDate(),
                    dateRange.from.getHours(),
                    dateRange.from.getMinutes(),
                    dateRange.from.getSeconds(),
                  ),
                  tzid: timeZone,
                  freq: RRule.WEEKLY,
                });
              })
            }
          >
            weekly
            <p className="text-xs text-card-foreground-muted">
              {format(new Date(), "EEE")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              setRrule(() => {
                return new RRule({
                  dtstart: datetime(
                    dateRange.from.getFullYear(),
                    dateRange.from.getMonth() + 1,
                    dateRange.from.getDate(),
                    dateRange.from.getHours(),
                    dateRange.from.getMinutes(),
                    dateRange.from.getSeconds(),
                  ),
                  tzid: timeZone,
                  freq: RRule.MONTHLY,
                });
              })
            }
          >
            monthly
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
                  dtstart: datetime(
                    dateRange.from.getFullYear(),
                    dateRange.from.getMonth() + 1,
                    dateRange.from.getDate(),
                    dateRange.from.getHours(),
                    dateRange.from.getMinutes(),
                    dateRange.from.getSeconds(),
                  ),
                  tzid: timeZone,
                  freq: RRule.DAILY,
                  byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                });
              })
            }
          >
            every weekday
            <p className="text-xs text-card-foreground-muted">(Mon-Fri)</p>
          </DropdownMenuItem>
          {rrule && (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-red gap-1"
                onClick={() => setRrule(null)}
              >
                <Trash />
                clear repeat
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
                ? `This todo is next scheduled for ${isThisYear(new Date()) ? format(rruleDateToLocal(nextRepeatDate), "dd MMM HH:mm") : format(nextRepeatDate, "dd MMM yyyy")} (${rrule.toText()})`
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
