import React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbClockHour4 as Clock, TbChevronRight } from "react-icons/tb";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { format } from "date-fns";
import TimePicker from "./TimePicker";

const DurationPicker = () => {
  const { dateRange } = useTodoForm();

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
        className="w-[260px] p-4 rounded-lg"
      >
        <div className="flex flex-col gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold leading-none tracking-tight">
              Set duration
            </h4>
            <p className="text-[11px] leading-snug text-muted-foreground">
              Applied to the current date range only
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {/* FROM */}
            <div className="rounded-md border p-1">
              <div className="flex justify-center gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {format(dateRange.from, "dd MMM")}
                </span>
                <TimePicker />
              </div>
            </div>

            {/* UNTIL */}
            <div className="rounded-md border p-1">
              <div className="flex justify-center gap-2 items-center">
                <span className="text-sm font-medium text-muted-foreground">
                  {format(dateRange.to, "dd MMM")}
                </span>
                <TimePicker />
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default DurationPicker;
