import clsx from "clsx";
import DayMenu from "./DayMenu";
import { PriorityIndicator } from "../PriorityIndicator";
import Repeat from "@/components/ui/icon/repeat";
import LaurelWreath from "@/components/ui/icon/laurelWreath";
import { format, isThisYear } from "date-fns";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { TbRefreshDot } from "react-icons/tb";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
import { CheckIcon } from "lucide-react";
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
  const {
    priority,
    setPriority,
    rruleOptions,
    setRruleOptions,
    dateRange,
    repeatType,
  } = useTodoForm();
  /*
   * so i have to basically masquerade my local time as UTC and then
   * pass it to dtstart, and when i get my result back i have to convert
   * the output to UTC, even though the output is already in UTC but i have to convert it
   */

  const rruleObject = useMemo(() => {
    if (!rruleOptions) return null;
    return new RRule({
      ...rruleOptions,
      dtstart: masqueradeAsUTC(dateRange.from),
    });
  }, [rruleOptions, dateRange]);

  const nextRepeatDate = useMemo(
    () => rruleObject?.after(masqueradeAsUTC(dateRange.from)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rruleOptions, dateRange],
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
        <DropdownMenuContent className="min-w-[250px] text-foreground">
          <DropdownMenuItem
            className="flex gap-1"
            onClick={() =>
              setRruleOptions(() => {
                return { freq: RRule.DAILY };
              })
            }
          >
            <CheckIcon
              className={clsx(
                "opacity-0",
                repeatType == "Daily" && "opacity-100",
              )}
            />
            Every Day
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex"
            onClick={() =>
              setRruleOptions(() => {
                return { freq: RRule.WEEKLY };
              })
            }
          >
            <div className="flex gap-1">
              <CheckIcon
                className={clsx(
                  "opacity-0",
                  repeatType == "Weekly" && "opacity-100",
                )}
              />
              <p>Every Week</p>
            </div>

            <p className="text-xs text-card-foreground-muted">
              on{format(new Date(), " EEE")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex"
            onClick={() =>
              setRruleOptions(() => {
                return { freq: RRule.MONTHLY };
              })
            }
          >
            <div className="flex gap-1">
              <CheckIcon
                className={clsx(
                  "opacity-0",
                  repeatType == "Monthly" && "opacity-100",
                )}
              />
              <p>Every Month</p>
            </div>
            <p className="text-xs text-card-foreground-muted">
              on the {format(new Date(), " do")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex"
            onClick={() =>
              setRruleOptions(() => {
                return { freq: RRule.YEARLY };
              })
            }
          >
            <div className="flex gap-1">
              <CheckIcon
                className={clsx(
                  "opacity-0",
                  repeatType == "Yearly" && "opacity-100",
                )}
              />
              <p>Every Year</p>
            </div>
            <p className="text-xs text-card-foreground-muted">
              on{format(new Date(), " MMM do")}
            </p>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="flex justify-between"
            onClick={() =>
              setRruleOptions(() => {
                return {
                  freq: RRule.WEEKLY,
                  byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
                };
              })
            }
          >
            <div className="flex gap-1 items-center">
              <CheckIcon
                className={clsx(
                  "opacity-0",
                  repeatType == "Weekday" && "opacity-100",
                )}
              />
              <p>Weekdays only</p>
              <p className="text-xs text-card-foreground-muted">Mon-Fri</p>
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <CustomRepeatModalMenu className="flex w-full hover:bg-accent" />
          </DropdownMenuItem>

          {rruleOptions && (
            <>
              <DropdownMenuSeparator className="mt-[5px]" />
              <DropdownMenuItem
                className="text-red gap-1 flex justify-center"
                onClick={() => setRruleOptions(null)}
              >
                Clear
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
      {rruleOptions && (
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
