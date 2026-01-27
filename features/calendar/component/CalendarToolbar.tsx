import { ToolbarProps, View } from "react-big-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { TodoItemType } from "@/types";

import { useTranslations } from "next-intl";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function CalendarToolbar({
  label,
  onNavigate,
  onView,
  view,
}: ToolbarProps<TodoItemType, object>) {


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
          className="text-sm flex-1 sm:flex-none flex items-center justify-center gap-1 border border-input/80 p-1 px-2 sm:p-2.5 sm:px-4 hover:bg-accent hover:text-popover-foreground rounded-md transition-colors"
        >
          {appDict("today")}
        </button>

        <div className="flex-1 sm:flex-none">
          <Select onValueChange={(value: View) => onView(value)}>
            <SelectTrigger className="min-w-24">
              <span className="capitalize">{appDict(view.toLowerCase())}</span>
            </SelectTrigger>
            <SelectContent className="min-w-36">
              {viewOptions.map((v) => (
                <SelectItem value={v} key={v}>
                  {appDict(v.toLowerCase())}
                </SelectItem>))
              }
            </SelectContent>
          </Select>



        </div>
      </div>
    </div>
  );
}
