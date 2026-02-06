import React, { useEffect, useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Clock, ChevronRight } from "lucide-react";
import { format, parse, isValid, isSameDay } from "date-fns";
import { Input } from "@/components/ui/input";
import { NonNullableDateRange } from "@/types";
import { useLocale, useTranslations } from "next-intl";

type DurationPickerProps = {
  dateRange: NonNullableDateRange;
  setDateRange: React.Dispatch<React.SetStateAction<NonNullableDateRange>>;
};

const DurationPicker = React.forwardRef<HTMLButtonElement, DurationPickerProps>(
  ({ dateRange, setDateRange }, ref) => {
    const locale = useLocale();
    const appDict = useTranslations("app");
    const [open, setOpen] = React.useState(false);
    const [timeFromStr, setTimeFromStr] = useState(
      dateRange?.from ? format(dateRange.from, "HH:mm") : "00:00",
    );
    const [timeToStr, setTimeToStr] = useState(
      dateRange?.to ? format(dateRange.to, "HH:mm") : "23:59",
    );

    const [error, setError] = useState<string | null>(null);

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
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            onClick={() => setOpen(!open)}
            ref={ref}
            className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-hidden hover:bg-accent hover:text-accent-foreground transition-colors group"
          >
            <div className="flex gap-1 items-center">
              <Clock className="w-5! h-5! stroke-[1.8px]" />
              {appDict("duration")}
            </div>
            <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50 group-hover:text-accent-foreground" />
          </button>
        </PopoverTrigger>

        <PopoverContent
          side="right"
          align="start"
          sideOffset={0}
          className="w-[240px] p-4 rounded-lg z-60 pointer-events-auto"
        >
          <div className="flex flex-col gap-4">
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
        </PopoverContent>
      </Popover>
    );
  },
);
DurationPicker.displayName = "DurationPicker";

export default DurationPicker;