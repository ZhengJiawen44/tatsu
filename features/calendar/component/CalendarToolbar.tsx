import { ToolbarProps } from "react-big-calendar";
import { ChevronLeft, ChevronRight, Check, ChevronDown } from "lucide-react";
import { CalendarTodoItemType } from "@/types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import clsx from "clsx";
import { useTranslations } from "next-intl";

export function CalendarToolbar({
  label,
  onNavigate,
  onView,
  view,
}: ToolbarProps<CalendarTodoItemType, object>) {
  const [viewFilter, setViewFilter] = useState(
    view.charAt(0).toUpperCase() + view.slice(1),
  );

  const appDict = useTranslations("app");

  const viewOptions = ["month", "week", "day", "agenda"] as const;


  return (
    <div className="flex items-center justify-between gap-0 sm:gap-4 p-2 mb-4 text-xs">
      {/* Left Section: Navigation Controls */}
      <div className="flex items-center sm:gap-2 w-full sm:w-auto justify-between">
        <div className="flex gap-1">
          <button
            className="border border-input/80 rounded-md hover:text-popover-foreground p-[0.2rem] sm:p-1.5 hover:bg-accent transition-colors"
            onClick={() => onNavigate("PREV")}
            aria-label="Previous"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            className="border border-input/80 rounded-md hover:text-popover-foreground p-[0.2rem] sm:p-1.5 hover:bg-accent transition-colors"
            onClick={() => onNavigate("NEXT")}
            aria-label="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <h2 className="sm:hidden text-xs sm:text-xl font-semibold px-2 truncate ">
          {label.split(" ")[0].slice(0, 3) + " " + label.split(" ")[1].slice(2)}
        </h2>
        <h2 className="hidden sm:block text-xs sm:text-xl font-semibold px-2 truncate ">
          {label}
        </h2>
      </div>

      {/* Right Section: Today & View Switcher */}
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <button
          onClick={() => onNavigate("TODAY")}
          className="flex-1 sm:flex-none flex items-center justify-center gap-1 border border-input/80 p-1 px-2 sm:p-1.5 sm:px-4 hover:bg-accent hover:text-popover-foreground rounded-md transition-colors"
        >
          {appDict("today")}
        </button>

        <div className="flex-1 sm:flex-none">
          <Popover>
            <PopoverTrigger className="w-full sm:min-w-28  flex items-center justify-between gap-2 border border-input/80 p-1 px-2 sm:p-1.5 sm:px-4 hover:bg-accent hover:text-popover-foreground rounded-md transition-colors">
              <span className="capitalize">{appDict(viewFilter.toLowerCase())}</span>
              <ChevronDown className="hidden sm:block w-4 h-4 opacity-50" />
            </PopoverTrigger>
            <PopoverContent align="end" className="flex flex-col w-40 p-1">
              {viewOptions.map((v) => (
                <div
                  key={v}
                  className="flex justify-between items-center hover:cursor-pointer hover:bg-popover-accent text-sm p-2 px-3 rounded-sm capitalize"
                  onClick={() => {
                    onView(v);
                    setViewFilter(v);
                  }}
                >
                  {appDict(v.toLowerCase())}
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
