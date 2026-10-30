import { Calendar } from "@/components/ui/calendar";
import React, { SetStateAction } from "react";
import { Calendar as CalenderIcon } from "lucide-react";
import { DateRange } from "react-day-picker";
import { buttonVariants } from "@/components/ui/button";
import { getDisplayDate } from "@/lib/date/displayDate";
import { cn } from "@/lib/utils";
import clsx from "clsx";
import { useLocale } from "next-intl";
import { useUserTimezone } from "@/features/user/query/get-timezone";

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
          cell: "h-8 w-full text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
          day: cn(
            buttonVariants({ variant: "ghost" }),
            "h-8 w-full p-0 font-normal aria-selected:opacity-100 text-xs text-foreground",
          ),
        }}
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
