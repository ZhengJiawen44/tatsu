import React from "react";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
import { CheckIcon } from "lucide-react";

import { Popover } from "@/components/ui/popover";
import { Options, RRule } from "rrule";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import { PopoverContent, PopoverTrigger } from "@radix-ui/react-popover";
import LineSeparator from "@/components/ui/lineSeparator";
import { useLocale, useTranslations } from "next-intl";

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
  const locale = useLocale();
  const appDict = useTranslations("app");

  // Helper function to format day abbreviation
  const formatDayAbbr = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  };

  // Helper function to format ordinal day (1st, 2nd, 3rd, etc.)
  const formatOrdinalDay = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  };

  // Helper function to format month and ordinal day
  const formatMonthDay = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric"
    }).format(date);
  };

  const menuItemClass =
    "flex items-center justify-between w-full hover:bg-popover-accent rounded-sm  px-2 py-1.5 hover:text-foreground cursor-pointer transition-colors";

  return (
    <Popover>
      <PopoverTrigger className="bg-popover border p-2 text-sm flex justify-center items-center gap-2 hover:bg-popover-border rounded-md hover:text-foreground transition-colors">
        <p className="hidden sm:block text-sm">{appDict("repeat")}</p>
        <ChevronDown className="w-4 h-4 !text-muted-foreground" />
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
            <span className="text-sm">{appDict("everyDay")}</span>
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
            <span className="text-sm">{appDict("everyWeek")}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {appDict("customMenu.on")} {formatDayAbbr(new Date())}
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
            <span className="text-sm">{appDict("everyMonth")}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {appDict("customMenu.on")} {formatOrdinalDay(new Date())}
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
            <span className="text-sm">{appDict("everyYear")}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">
            {appDict("customMenu.on")} {formatMonthDay(new Date())}
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
            <span className="text-sm">{appDict("weekdaysOnly")}</span>
          </div>
          <span className="text-xs text-muted-foreground ml-auto">Mon-Fri</span>
        </div>

        {/* Custom Repeat */}
        <div>
          <CustomRepeatModalMenu
            rruleOptions={rruleOptions}
            setRruleOptions={setRruleOptions}
            derivedRepeatType={derivedRepeatType}
            className="flex items-center w-full hover:bg-popover-accent rounded-sm !px-2 !py-1.5 cursor-pointer text-sm"
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