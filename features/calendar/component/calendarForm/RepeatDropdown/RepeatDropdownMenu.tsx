import React from "react";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
import { CheckIcon } from "lucide-react";

import { Popover } from "@/components/ui/popover";
import { Options, RRule } from "rrule";
import { format } from "date-fns";
import clsx from "clsx";
import { BsCaretDown } from "react-icons/bs";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import LineSeparator from "@/components/ui/lineSeparator";

type RepeatDropdownMenuProps = {
  rruleOptions: Partial<Options> | null;
  setRruleOptions: React.Dispatch<
    React.SetStateAction<Partial<Options> | null>
  >;
  derivedRepeatType:
    | "Weekday"
    | "Weekly"
    | "Custom"
    | "Daily"
    | "Monthly"
    | "Daily"
    | "Yearly"
    | null;
};

const RepeatDropdownMenu = ({
  rruleOptions,
  setRruleOptions,
  derivedRepeatType,
}: RepeatDropdownMenuProps) => {
  const menuItemClass =
    "flex items-center justify-between w-full hover:bg-popover-accent rounded-sm px-2 py-1.5 hover:text-foreground cursor-pointer transition-colors";

  return (
    <Popover>
      <PopoverTrigger className="bg-input p-2 text-sm flex justify-center items-center gap-2 hover:bg-accent rounded-md hover:text-foreground transition-colors">
        <p className="hidden sm:block text-sm">Repeat</p>
        <BsCaretDown />
      </PopoverTrigger>
      <PopoverContent className="min-w-[250px] text-foreground bg-popover p-2 border rounded-md shadow-lg z-50">
        {/* Every Day */}
        <div
          className={menuItemClass}
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.DAILY };
            })
          }
        >
          <div className="flex items-center gap-2">
            <CheckIcon
              className={clsx(
                "w-4 h-4 opacity-0",
                derivedRepeatType === "Daily" && "opacity-100",
              )}
            />
            <span className="text-sm">Every Day</span>
          </div>
        </div>

        {/* Every Week */}
        <div
          className={menuItemClass}
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.WEEKLY };
            })
          }
        >
          <div className="flex items-center gap-2">
            <CheckIcon
              className={clsx(
                "w-4 h-4 opacity-0",
                derivedRepeatType === "Weekly" && "opacity-100",
              )}
            />
            <span className="text-sm">Every Week</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            on {format(new Date(), "EEE")}
          </span>
        </div>

        {/* Every Month */}
        <div
          className={menuItemClass}
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.MONTHLY };
            })
          }
        >
          <div className="flex items-center gap-2">
            <CheckIcon
              className={clsx(
                "w-4 h-4 opacity-0",
                derivedRepeatType === "Monthly" && "opacity-100",
              )}
            />
            <span className="text-sm">Every Month</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            on the {format(new Date(), "do")}
          </span>
        </div>

        {/* Every Year */}
        <div
          className={menuItemClass}
          onClick={() =>
            setRruleOptions(() => {
              return { freq: RRule.YEARLY };
            })
          }
        >
          <div className="flex items-center gap-2">
            <CheckIcon
              className={clsx(
                "w-4 h-4 opacity-0",
                derivedRepeatType === "Yearly" && "opacity-100",
              )}
            />
            <span className="text-sm">Every Year</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            on {format(new Date(), "MMM do")}
          </span>
        </div>

        <LineSeparator className="my-1" />

        {/* Weekdays only */}
        <div
          className={menuItemClass}
          onClick={() =>
            setRruleOptions(() => {
              return {
                freq: RRule.WEEKLY,
                byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
              };
            })
          }
        >
          <div className="flex items-center gap-2">
            <CheckIcon
              className={clsx(
                "w-4 h-4 opacity-0",
                derivedRepeatType === "Weekday" && "opacity-100",
              )}
            />
            <span className="text-sm">Weekdays only</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">Mon-Fri</span>
        </div>

        {/* Custom Repeat */}
        <div>
          <CustomRepeatModalMenu
            rruleOptions={rruleOptions}
            setRruleOptions={setRruleOptions}
            derivedRepeatType={derivedRepeatType}
            className="flex items-center w-full hover:bg-accent rounded-sm px-2 py-1.5 hover:text-white cursor-pointer transition-colors text-sm"
          />
        </div>

        {/* Clear button */}
        {rruleOptions && (
          <>
            <LineSeparator className="my-1" />
            <div
              className="text-red flex items-center justify-center hover:bg-orange rounded-sm px-2 py-1.5 hover:text-white cursor-pointer transition-colors"
              onClick={() => setRruleOptions(null)}
            >
              <span className="text-sm">Clear</span>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default RepeatDropdownMenu;
