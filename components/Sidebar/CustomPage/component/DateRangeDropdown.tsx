import { addYears } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { SetStateAction } from "react";
import { Calendar as CalenderIcon } from "lucide-react";
import {
  CaptionLabel,
  CaptionNavigation,
  DateRange,
  useDayPicker,
  useNavigation,
  type CaptionProps,
} from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { getDisplayDate } from "@/lib/date/displayDate";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useUserTimezone } from "@/features/user/query/get-timezone";
import { ChevronsRight } from "lucide-react";

function YearCaption({ id, displayMonth, displayIndex }: CaptionProps) {
  const { goToMonth } = useNavigation();
  const { classNames, styles } = useDayPicker();

  return (
    <div className={classNames.caption} style={styles.caption}>
      <button
        type="button"
        aria-label="Go to previous year"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute left-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground text-xs",
        )}
        onClick={() => goToMonth(addYears(displayMonth, -1))}
      >
        <ChevronsRight className="rotate-180 h-4.5 w-4.5"/>
      </button>
      <CaptionLabel
        id={id}
        displayMonth={displayMonth}
        displayIndex={displayIndex}
      />
      <CaptionNavigation
        displayMonth={displayMonth}
        displayIndex={displayIndex}
        id={id}
      />
      <button
        type="button"
        aria-label="Go to next year"
        className={cn(
          buttonVariants({ variant: "outline" }),
          "absolute right-0 h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100 text-foreground text-xs",
        )}
        onClick={() => goToMonth(addYears(displayMonth, 1))}
      >
        <ChevronsRight/>
      </button>
    </div>
  );
}

const DateDropdownMenu = ({
  dateRange,
  setDateRange,
}: {
  dateRange: DateRange;
  setDateRange: React.Dispatch<SetStateAction<DateRange>>;
}) => {
  const locale = useLocale();
  const { userTimezone } = useUserTimezone();
  return (
    <div className="rounded-md border">
      <div
        className={clsx(
          "flex gap-2 justify-center items-center border-b font-medium w-full h-fit p-2! text-muted-foreground bg-inherit",
        )}
      >
        <CalenderIcon className="w-4 h-4" />
        <span className="font-medium text-sm">
          {dateRange.from
            ? getDisplayDate(dateRange.from, true, locale, userTimezone)
            : "Date"}
        </span>
        --
        <span className="font-medium text-sm">
          {dateRange.to
            ? getDisplayDate(dateRange.to, true, locale, userTimezone)
            : "Date"}
        </span>
      </div>

      {/* --- CALENDAR --- */}
      <Calendar
        className="w-full"
        classNames={{
          months: "",
          nav_button_previous: "absolute left-9",
          nav_button_next: "absolute right-9",
          cell: "h-8 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-full p-0 font-normal aria-selected:opacity-100 text-xs text-foreground",
          ),
        }}
        components={{ Caption: YearCaption }}
        mode="range"
        defaultMonth={new Date()}
        selected={dateRange}
        onSelect={(dateRange) => {
          setDateRange({ from: dateRange?.from, to: dateRange?.to });
        }}
        numberOfMonths={1}
      />
    </div>
  );
};

export default DateDropdownMenu;
