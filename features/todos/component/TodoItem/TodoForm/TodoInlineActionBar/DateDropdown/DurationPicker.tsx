import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbClockHour4 as Clock, TbChevronRight } from "react-icons/tb";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { format, parse } from "date-fns";
import { Input } from "@/components/ui/input";

const DurationPicker = () => {
  const { dateRange, setDateRange } = useTodoForm();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors group">
          <div className="flex gap-1 items-center">
            <Clock className="!w-5 !h-5 stroke-[1.8px]" />
            Duration
          </div>
          <TbChevronRight className="ml-auto h-4 w-4 text-muted-foreground/50 group-hover:text-accent-foreground" />
        </button>
      </PopoverTrigger>

      <PopoverContent
        side="right"
        align="start"
        className="w-[210px] p-4 rounded-lg"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold leading-none tracking-tight">
              Set duration
            </h4>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Applied to the current date only
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* FROM */}
            <div className="rounded-md border p-1">
              <div className="flex justify-center gap-2 items-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {format(dateRange.from, "dd MMM")}
                </span>
                <div className="p-0">
                  <Input
                    value={
                      dateRange.from
                        ? dateRange.from.toTimeString().slice(0, 5)
                        : "00:00"
                    }
                    onChange={(e) => {
                      const timeStart = e.currentTarget.value || "00:00";
                      setDateRange((old) => {
                        return {
                          from: parse(timeStart, "HH:mm", dateRange.from),
                          to: old.to,
                        };
                      });
                    }}
                    type="time"
                    className="p-0 select-none border-none bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 hover:cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* UNTIL */}
            <div className="rounded-md border p-1">
              <div className="flex justify-center gap-2 items-center">
                <span className="text-xs font-medium text-muted-foreground">
                  {format(dateRange.to, "dd MMM")}
                </span>
                <div className="p-0">
                  <Input
                    value={
                      dateRange.to
                        ? dateRange.to.toTimeString().slice(0, 5)
                        : "23:59"
                    }
                    onChange={(e) => {
                      const timeStart = e.currentTarget.value || "11:59";

                      setDateRange((old) => {
                        return {
                          from: old.from,
                          to: parse(timeStart, "HH:mm", dateRange.to),
                        };
                      });
                    }}
                    type="time"
                    className="p-0 select-none border-none bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 hover:cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DurationPicker;
