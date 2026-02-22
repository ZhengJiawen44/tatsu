import { addDays, endOfDay, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { useEffect, useMemo } from "react";
import { nextMonday, differenceInDays } from "date-fns";
import LineSeparator from "@/components/ui/lineSeparator";
import { IterationCcw, Sun, X } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal
} from "@/components/ui/dropdown-menu";
import { useLocale, useTranslations } from "next-intl";
import { getDisplayDate } from "@/lib/date/displayDate";
import { isSameDay } from "date-fns";
import { useUserTimezone } from "@/features/user/query/get-timezone";

import { Clock } from "lucide-react";
import { format, parse, isValid } from "date-fns";
import { Input } from "@/components/ui/input";
import { DateRange } from "react-day-picker";
import clsx from "clsx";
import { NonNullableDateRange } from "@/types";

type DateDropdownMenuProps = {
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
};

const DateDropdownMenu = ({
  dateRange,
  setDateRange,
}: DateDropdownMenuProps) => {
  const locale = useLocale();
  const userTZ = useUserTimezone();
  const appDict = useTranslations("app");
  const nextWeek = startOfDay(nextMonday(dateRange?.from || new Date()));
  const tomorrow = startOfDay(addDays(dateRange?.from || new Date(), 1));
  const [isOpen, setIsOpen] = React.useState(false);

  // Helper function to format day abbreviation
  function formatDayAbbr(date: Date): string {
    return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(date);
  }

  const displayedDateRange = useMemo(() => {
    if (!dateRange.from || !dateRange.to) return getDisplayDate(dateRange.to ?? dateRange.from, false, locale, userTZ?.timeZone);
    if (!dateRange.from && !dateRange.to) return "";
    if (isSameDay(dateRange.from, dateRange.to)) {
      let displayedTime = `${new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(dateRange.from)}-${new Intl.DateTimeFormat(locale, { hour: "numeric" }).format(dateRange.to)}`;
      if (displayedTime === "12 AM-11 PM") displayedTime = "All day";
      return `${getDisplayDate(dateRange.from, false, locale, userTZ?.timeZone)},  ${displayedTime}`;
    }
    return `${getDisplayDate(dateRange.from, false, locale, userTZ?.timeZone)} - ${getDisplayDate(dateRange.to, false, locale, userTZ?.timeZone)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange.from, dateRange.to, locale]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={true}>
      <DropdownMenuTrigger asChild>
        <button className="cursor-pointer flex justify-start items-center gap-2 p-2 w-full h-full hover:bg-popover rounded-md outline-hidden">
          <span className="text-sm font-medium">{displayedDateRange}</span>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="z-50 flex flex-col gap-2 p-1 w-62.5 font-extralight"
        align="start"
      >
        {/* --- OPTION: TODAY --- */}
        <DropdownMenuItem
          onSelect={(e) => { e.preventDefault(); }}
          className="flex w-full cursor-pointer items-center justify-between"
          onClick={() => {
            setDateRange((prev) => ({
              from: startOfDay(new Date()),
              to:
                prev.to && prev.from
                  ? new Date(
                    endOfDay(
                      addDays(
                        new Date(),
                        differenceInDays(prev.to, prev.from)
                      )
                    )
                  )
                  : endOfDay(new Date()),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-2 items-center">
            <Sun strokeWidth={1.7} className="w-4! h-4!" />
            {appDict("today")}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDayAbbr(new Date())}
          </p>
        </DropdownMenuItem>

        {/* --- OPTION: TOMORROW --- */}
        <DropdownMenuItem
          onSelect={(e) => { e.preventDefault(); }}
          className="flex w-full cursor-pointer items-center justify-between"
          onClick={() => {
            setDateRange((prev) => ({
              from: tomorrow,
              to:
                prev.to && prev.from
                  ? endOfDay(
                    addDays(tomorrow, differenceInDays(prev.to, prev.from))
                  )
                  : endOfDay(tomorrow),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-2 items-center">
            <IterationCcw strokeWidth={1.7} className="w-4! h-4!" />
            {appDict("tomorrow")}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDayAbbr(tomorrow)}
          </p>
        </DropdownMenuItem>

        {/* --- OPTION: NEXT WEEK --- */}
        <DropdownMenuItem
          onSelect={(e) => { e.preventDefault(); }}
          className="flex w-full cursor-pointer items-center justify-between"
          onClick={() => {
            setDateRange((prev) => ({
              from: nextWeek,
              to:
                prev.to && prev.from
                  ? endOfDay(
                    new Date(
                      addDays(nextWeek, differenceInDays(prev.to, prev.from))
                    )
                  )
                  : endOfDay(nextWeek),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-2 items-center">
            <CalendarIcon strokeWidth={1.7} className="w-4! h-4!" />
            {appDict("nextWeek")}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatDayAbbr(nextWeek)}
          </p>
        </DropdownMenuItem>

        {/* --- DURATION (sub-menu) --- */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            title={(!dateRange.from || !dateRange.to) ? "need to set start and end date" : ""}
            disabled={!dateRange.from || !dateRange.to}
            className={clsx("text-muted-foreground hover:bg-transparent! cursor-default! flex w-full items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-hidden transition-colors group",
              (dateRange.from && dateRange.to) && "text-foreground hover:bg-popover-accent! hover:text-accent-foreground! cursor-pointer!")}>
            <div className="flex gap-2 items-center">
              <Clock strokeWidth={1.7} className="w-4! h-4!" />
              Time
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            {(dateRange.from && dateRange.to) && (
              <DropdownMenuSubContent
                className="w-[320px] p-4 rounded-lg z-60"
                onPointerDown={(e) => e.stopPropagation()}
                onKeyDown={(e) => e.stopPropagation()}
              >
                <DurationPickerSub
                  dateRange={dateRange as NonNullableDateRange}
                  setDateRange={setDateRange as React.Dispatch<
                    React.SetStateAction<NonNullableDateRange>
                  >}
                />

              </DropdownMenuSubContent>
            )}

          </DropdownMenuPortal>
        </DropdownMenuSub>

        <LineSeparator className="border-popover-border w-full my-1 mb-4" />

        {/* --- CALENDAR --- */}
        <div className="w-full p-0">
          <Calendar
            mode="range"
            defaultMonth={new Date()}
            selected={dateRange}
            onSelect={(dateRange) => { setDateRange({ from: dateRange?.from, to: dateRange?.to }) }}
            numberOfMonths={1}

          />
        </div>
        <LineSeparator className="border-popover-border my-1" />
        {/* --- OPTION: No Date --- */}
        <button
          className="flex justify-between items-center p-1.5 px-2 rounded w-[96.5%] hover:bg-popover-accent cursor-pointer m-auto text-sm"
          onClick={() => {
            setDateRange(() => ({
              from: undefined,
              to: undefined
            }));
            setIsOpen(false);
          }}
        >

          <div className="flex gap-2 items-center">
            <X strokeWidth={1.7} className="w-4 h-4" />
            No Date
          </div>

        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DateDropdownMenu;

/* -------------------------------
   DurationPickerSub component used
   inside the DropdownMenuSubContent
   ------------------------------- */
type DurationPickerSubProps = {
  dateRange: NonNullableDateRange;
  setDateRange: React.Dispatch<React.SetStateAction<NonNullableDateRange>>;
};

function DurationPickerSub({ dateRange, setDateRange }: DurationPickerSubProps) {
  const locale = useLocale();
  const appDict = useTranslations("app");

  const [timeFromStr, setTimeFromStr] = React.useState(
    dateRange?.from ? format(dateRange.from, "HH:mm") : "00:00",
  );
  const [timeToStr, setTimeToStr] = React.useState(
    dateRange?.to ? format(dateRange.to, "HH:mm") : "23:59",
  );

  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (dateRange?.from) setTimeFromStr(format(dateRange.from, "HH:mm"));
    if (dateRange?.to) setTimeToStr(format(dateRange.to, "HH:mm"));
    setError(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateRange?.from?.getTime(), dateRange?.to?.getTime()]);

  const handleFromChange = (val: string) => {
    setTimeFromStr(val);

    const parsed = parse(val || "00:00", "HH:mm", dateRange.from);
    if (!isValid(parsed)) {
      setError(null);
      return;
    }

    setDateRange((old) => {
      const newFrom = parsed;
      if (
        isSameDay(old.from, old.to) &&
        newFrom.getTime() > old.to.getTime()
      ) {
        setTimeToStr(format(newFrom, "HH:mm"));
        setError(null);
        return { from: newFrom, to: newFrom };
      }
      setError(null);
      return { from: newFrom, to: old.to };
    });
  };

  const handleToChange = (val: string) => {
    setTimeToStr(val);

    const parsed = parse(val || "23:59", "HH:mm", dateRange.to);
    if (!isValid(parsed)) {
      setError(null);
      return;
    }

    // If same day, ensure newTo >= from
    if (
      isSameDay(dateRange.from, dateRange.to) &&
      parsed.getTime() < dateRange.from.getTime()
    ) {
      // show error, do not commit invalid value
      setError(appDict("durationMenu.error")); // Add this to your translations
      return;
    }
    // otherwise commit
    setDateRange((old) => {
      setError(null);
      return { from: old.from, to: parsed };
    });
  };

  // Helper function to format dates with locale support
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "short",
    }).format(date);
  };

  const inputErrorClass = error ? "ring-1 ring-red" : "";


  return (
    <div className=" flex flex-col gap-4">
      <div className="space-y-1">
        <h4 className="text-sm font-semibold leading-none tracking-tight">
          {appDict("durationMenu.title")}
        </h4>
        <p className="text-[11px] leading-snug text-muted-foreground">
          {appDict("durationMenu.subTitle")}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {/* FROM */}
        <div className="rounded-md border p-1">
          <div className="flex justify-center gap-2 items-center">
            <span className="text-xs font-medium text-muted-foreground">
              {formatDate(dateRange.from)}
            </span>
            <div className="p-0 flex-1">
              <Input
                value={timeFromStr}
                onChange={(e) => handleFromChange(e.currentTarget.value)}
                type="time"
                className={`p-0 select-none border-none bg-transparent focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 hover:cursor-pointer ${inputErrorClass}`}
                aria-invalid={!!error}
                aria-describedby={error ? "duration-error" : undefined}
              />
            </div>
          </div>
        </div>

        {/* UNTIL */}
        <div className="rounded-md border p-1">
          <div className="flex justify-center gap-2 items-center">
            <span className="text-xs font-medium text-muted-foreground">
              {formatDate(dateRange.to)}
            </span>
            <div className="p-0 flex-1">
              <Input
                value={timeToStr}
                onChange={(e) => handleToChange(e.currentTarget.value)}
                type="time"
                className={`p-0 select-none border-none bg-transparent focus-visible:outline-hidden focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 hover:cursor-pointer ${inputErrorClass}`}
                aria-invalid={!!error}
                aria-describedby={error ? "duration-error" : undefined}
              />
            </div>
          </div>
        </div>

        {/* error message */}
        {error ? (
          <p id="duration-error" className="text-[12px] text-red mt-0.5">
            {error}
          </p>
        ) : null}
      </div>
    </div>
  );
}
