import { addDays, endOfDay, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { useMemo } from "react";
import { nextMonday, differenceInDays } from "date-fns";
import LineSeparator from "@/components/ui/lineSeparator";
import { Sun } from "lucide-react";
import { Sunrise } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import DurationPicker from "./DurationPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useLocale, useTranslations } from "next-intl";
import { NonNullableDateRange } from "@/types";
import { getDisplayDate } from "@/lib/date/displayDate";
import { isSameDay } from "date-fns";

type DateDropdownMenuProps = {
  dateRange: NonNullableDateRange;
  setDateRange: React.Dispatch<React.SetStateAction<NonNullableDateRange>>;
};

const DateDropdownMenu = ({
  dateRange,
  setDateRange,
}: DateDropdownMenuProps) => {
  const locale = useLocale();
  const appDict = useTranslations("app");
  const nextWeek = startOfDay(nextMonday(dateRange?.from || new Date()));
  const tomorrow = startOfDay(addDays(dateRange?.from || new Date(), 1));
  const [isOpen, setIsOpen] = React.useState(false);


  // Helper function to format day abbreviation
  function formatDayAbbr(date: Date): string {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  }

  const displayedDateRange = useMemo(() => {
    if (isSameDay(dateRange.from, dateRange.to)) {
      let displayedTime = `${new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(dateRange.from)}-${new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(dateRange.to)}`
      if (displayedTime === "12 AM-11 PM") displayedTime = "All day"
      console.log(displayedTime)
      return `${getDisplayDate(dateRange.from, false, locale)},  ${displayedTime}`
    }
    return `${getDisplayDate(dateRange.from, false, locale)} - ${getDisplayDate(dateRange.to, false, locale)}`
  }, [dateRange.from, dateRange.to, locale])

  const itemClass =
    "flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm hover:bg-popover-accent hover:text-foreground";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex justify-start items-center gap-1 p-1 w-full h-full hover:bg-popover-accent rounded-md outline-none">
          <span className="text-sm font-medium">
            {displayedDateRange}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="z-50 pointer-events-auto flex flex-col gap-1 p-1 w-[240px] font-extralight border-popover-accent"
        align="start"
      >
        {/* --- OPTION: TODAY --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: startOfDay(new Date()),
              to:
                prev.to && prev.from
                  ? new Date(
                    endOfDay(
                      addDays(
                        new Date(),
                        differenceInDays(prev.to, prev.from),
                      ),
                    ),
                  )
                  : endOfDay(new Date()),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-1 items-center">
            <Sun className="!w-5 !h-5 stroke-[1.8px]" />
            {appDict("today")}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDayAbbr(new Date())}
          </p>
        </button>

        {/* --- OPTION: TOMORROW --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: tomorrow,
              to:
                prev.to && prev.from
                  ? endOfDay(
                    addDays(tomorrow, differenceInDays(prev.to, prev.from)),
                  )
                  : endOfDay(tomorrow),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-1 items-center">
            <Sunrise className="!w-5 !h-5" />
            {appDict("tomorrow")}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDayAbbr(tomorrow)}
          </p>
        </button>

        {/* --- OPTION: NEXT WEEK --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: nextWeek,
              to:
                prev.to && prev.from
                  ? endOfDay(
                    new Date(
                      addDays(nextWeek, differenceInDays(prev.to, prev.from)),
                    ),
                  )
                  : endOfDay(nextWeek),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-1 items-center">
            <CalendarIcon strokeWidth={1.4} className="!w-5 !h-5" />
            {appDict("nextWeek")}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDayAbbr(nextWeek)}
          </p>
        </button>

        {/* --- DURATION --- */}
        <DurationPicker dateRange={dateRange} setDateRange={setDateRange} />

        <LineSeparator className="border-popover-accent w-full my-1 mb-4" />

        {/* --- CALENDAR --- */}
        <div className="flex justify-center p-0">
          <Calendar
            className="p-0 pb-2"
            mode="range"
            defaultMonth={new Date()}
            disabled={(date) => date <= addDays(new Date(), -1)}
            selected={dateRange}
            onSelect={(newDateRange) => {
              setDateRange(() => {
                const from = startOfDay(newDateRange?.from || new Date());
                const to = endOfDay(newDateRange?.to || from);
                return { from, to };
              });
            }}
            numberOfMonths={1}
          />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DateDropdownMenu;