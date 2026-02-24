import React, { useState } from "react";
import CustomRepeatModalMenu from "./repeatModalMenu/CutomRepeatModalMenu";
import { Popover } from "@/components/ui/popover";
import { Options, RRule } from "rrule";
import { ChevronDown } from "lucide-react";
import { PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import LineSeparator from "@/components/ui/lineSeparator";
import { useLocale, useTranslations } from "next-intl";
import { Indicator } from "@/components/todo/component/TodoForm/TodoInlineActionBar/RepeatDropdown/RepeatDropdownMenu";

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
  const [open, setOpen] = useState(false);
  // Helper function to format day abbreviation
  const formatDayAbbr = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  };

  // Helper function to format ordinal day (1st, 2nd, 3rd, etc.)
  // const formatOrdinalDay = (date: Date): string => {
  //   return new Intl.DateTimeFormat(locale, { day: "numeric" }).format(date);
  // };

  // Helper function to format month and ordinal day
  const formatMonthDay = (date: Date): string => {
    return new Intl.DateTimeFormat(locale, {
      month: "short",
      day: "numeric"
    }).format(date);
  };

  const menuItemClass =
    "flex items-center w-[97%]! mx-auto justify-between w-full hover:bg-popover-accent rounded-sm  px-2 py-1.5 hover:text-foreground cursor-pointer transition-colors";

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger className="cursor-pointer bg-popover border p-2 text-sm flex justify-center items-center gap-2 hover:bg-popover-border rounded-md hover:text-foreground transition-colors">
        <p className="hidden sm:block text-sm">{appDict("repeat")}</p>
        <ChevronDown className="w-4 h-4 text-muted-foreground!" />
      </PopoverTrigger>
      <PopoverContent align="start" alignOffset={-7} className="min-w-62.5 p-0 py-1 border-popover-border flex flex-col gap-1 text-foreground border rounded-md shadow-lg z-50">
        {/* Every Day */}
        <div
          className={menuItemClass}
          onClick={() => {
            setOpen(false);
            setRruleOptions(() => {
              return { freq: RRule.DAILY };
            })
          }
          }
        >
          <span className="text-sm">{appDict("everyDay")}</span>
          <Indicator
            name="Daily"
            derivedRepeatType={derivedRepeatType}
          />
        </div>

        {/* Every Week */}
        <div
          className={menuItemClass}
          onClick={() => {
            setOpen(false);
            setRruleOptions(() => {
              return { freq: RRule.WEEKLY };
            })
          }
          }
        >
          <p className="text-sm">
            {appDict("everyWeek")}
            <span className="text-xs ml-4 text-muted-foreground">
              {appDict("customMenu.on")} {formatDayAbbr(new Date())}
            </span>
          </p>
          <Indicator
            name="Weekly"
            derivedRepeatType={derivedRepeatType}
          />
        </div>

        {/* Every Month */}
        <div
          className={menuItemClass}
          onClick={() => {
            setOpen(false);
            setRruleOptions(() => {
              return { freq: RRule.MONTHLY };
            })
          }
          }
        >
          <p className="text-sm">
            {appDict("everyMonth")}
            <span className="text-xs ml-4 text-muted-foreground">
              {appDict("customMenu.on")} {formatMonthDay(new Date())}
            </span>
          </p>
          <Indicator
            name="Monthly"
            derivedRepeatType={derivedRepeatType}
          />
        </div>

        {/* Every Year */}
        <div
          className={menuItemClass}
          onClick={() => {
            setOpen(false);
            setRruleOptions(() => {
              return { freq: RRule.YEARLY };
            })
          }
          }
        >
          <p className="text-sm">
            {appDict("everyYear")}
            <span className="text-xs ml-4 text-muted-foreground">
              {appDict("customMenu.on")} {formatMonthDay(new Date())}
            </span>
          </p>
          <Indicator
            name="Yearly"
            derivedRepeatType={derivedRepeatType}
          />
        </div>

        <LineSeparator className="my-2 border-popover-border" />

        {/* Weekdays only */}
        <div
          className={menuItemClass}
          onClick={() => {
            setOpen(false);
            setRruleOptions(() => {
              return {
                freq: RRule.WEEKLY,
                byweekday: [RRule.MO, RRule.TU, RRule.WE, RRule.TH, RRule.FR],
              };
            })
          }
          }
        >
          <p className="text-sm">
            {appDict("weekdaysOnly")}
            <span className="text-xs ml-4 text-muted-foreground">
              Mon-Fri
            </span>
          </p>
          <Indicator
            name="Weekday"
            derivedRepeatType={derivedRepeatType}
          />
        </div>

        {/* Custom Repeat */}
        <div>
          <CustomRepeatModalMenu
            rruleOptions={rruleOptions}
            setRruleOptions={setRruleOptions}
            derivedRepeatType={derivedRepeatType}
            className="flex items-center w-[97%] mx-auto justify-between hover:bg-popover-accent rounded-sm px-2! py-1.5! cursor-pointer text-sm"
          />
        </div>

        {/* Clear button */}
        {rruleOptions && (
          <>
            <LineSeparator className="my-1 border-popover-border" />
            <div
              className="text-red w-[97%] mx-auto flex items-center justify-center hover:bg-red/90 rounded-sm px-2 py-1.5 hover:text-white cursor-pointer transition-colors"
              onClick={() => {
                setOpen(false);
                setRruleOptions(null)
              }
              }
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