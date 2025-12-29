import { ToolbarProps } from "react-big-calendar";
import { ChevronLeft, ChevronRight, Check, ChevronDown } from "lucide-react";
import { CalendarEvent } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import clsx from "clsx";

export function CalendarToolbar({
  label,
  onNavigate,
  onView,
  view,
}: ToolbarProps<CalendarEvent, object>) {
  const [viewFilter, setViewFilter] = useState(
    view.charAt(0).toUpperCase() + view.slice(1),
  );

  const viewOptions = ["month", "week", "day", "agenda"] as const;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-2 mb-4">
      {/* Left Section: Navigation Controls */}
      <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex gap-1">
          <button
            className="border border-input/80 rounded-md hover:text-popover-foreground p-1.5 hover:bg-accent transition-colors"
            onClick={() => onNavigate("PREV")}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className="border border-input/80 rounded-md hover:text-popover-foreground p-1.5 hover:bg-accent transition-colors"
            onClick={() => onNavigate("NEXT")}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <h2 className="text-lg sm:text-xl font-semibold px-2 truncate">
          {label}
        </h2>
      </div>

      {/* Right Section: Today & View Switcher */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => onNavigate("TODAY")}
          className="flex-1 sm:flex-none text-[0.95rem] flex items-center justify-center gap-1 border border-input/80 p-1.5 px-4 hover:bg-accent hover:text-popover-foreground rounded-md transition-colors"
        >
          Today
        </button>

        <div className="flex-1 sm:flex-none">
          <Popover>
            <PopoverTrigger className="w-full sm:min-w-28 text-[0.95rem] flex items-center justify-between gap-2 border border-input/80 p-1.5 px-3 hover:bg-accent hover:text-popover-foreground rounded-md transition-colors">
              <span className="capitalize">{viewFilter}</span>
              <ChevronDown className="w-4 h-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col w-40 p-1">
              {viewOptions.map((v) => (
                <div
                  key={v}
                  className="flex justify-between items-center hover:cursor-pointer hover:bg-accent text-sm p-2 px-3 rounded-sm capitalize"
                  onClick={() => {
                    onView(v);
                    setViewFilter(v);
                  }}
                >
                  {v}
                  <Check
                    className={clsx(
                      "w-4 h-4 transition-opacity",
                      viewFilter.toLowerCase() === v
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </div>
              ))}
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
