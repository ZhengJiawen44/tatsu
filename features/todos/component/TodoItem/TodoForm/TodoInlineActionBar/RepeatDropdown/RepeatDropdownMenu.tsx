import React from "react";
import CustomRepeatModalMenu from "./RepeatDropdown/repeatModalMenu/CutomRepeatModalMenu";
import { CheckIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Repeat from "@/components/ui/icon/repeat";
import { RRule } from "rrule";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { format } from "date-fns";
import clsx from "clsx";

const RepeatDropdownMenu = ({}) => {
  const { rruleOptions, setRruleOptions, derivedRepeatType } = useTodoForm();
  return (
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
              derivedRepeatType == "Daily" && "opacity-100",
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
                derivedRepeatType == "Weekly" && "opacity-100",
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
                derivedRepeatType == "Monthly" && "opacity-100",
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
                derivedRepeatType == "Yearly" && "opacity-100",
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
                derivedRepeatType == "Weekday" && "opacity-100",
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
  );
};

export default RepeatDropdownMenu;
