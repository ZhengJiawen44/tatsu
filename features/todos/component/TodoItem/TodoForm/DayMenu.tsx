import { addDays, endOfDay, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import { format, nextMonday, differenceInDays } from "date-fns";
import LineSeparator from "@/components/ui/lineSeparator";
import { TbTarget } from "react-icons/tb";
import { TbSunrise as Tomorrow } from "react-icons/tb";
import { TbCalendar as CalenderIcon } from "react-icons/tb";
import { useTodoForm } from "@/providers/TodoFormProvider";
import DurationPicker from "./DurationPicker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const DayMenu = () => {
  const { todoItem: todo, dateRange, setDateRange } = useTodoForm();
  const nextWeek = nextMonday(dateRange?.from || startOfDay(new Date()));
  const tomorrow = addDays(dateRange?.from || startOfDay(new Date()), 1);
  const [isOpen, setIsOpen] = React.useState(false);

  function getDisplayDate(date: Date) {
    const formattedDate = format(date, "MMM dd yyyy");
    return date.getFullYear() === new Date().getFullYear()
      ? formattedDate.replace(` ${date.getFullYear()}`, "")
      : formattedDate;
  }

  const itemClass =
    "flex w-full cursor-pointer items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground transition-colors text-left bg-transparent border-0";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="flex justify-center items-center gap-1 p-1 w-full h-full hover:bg-accent rounded-md outline-none">
          <CalenderIcon className="w-5 h-5" />
          <span className="text-sm font-medium">
            {dateRange?.from
              ? getDisplayDate(dateRange.from)
              : todo?.dtstart
                ? getDisplayDate(todo.dtstart)
                : "Today"}
          </span>
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="flex flex-col gap-1 p-1 w-[240px] font-extralight border-popover-accent"
        align="start"
      >
        {/* --- OPTION: TODAY --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: startOfDay(new Date()),
              to:
                prev?.to && prev.from
                  ? new Date(
                      addDays(
                        new Date(),
                        differenceInDays(prev.to, prev.from),
                      ).setHours(prev.to.getHours(), prev.to.getMinutes()),
                    )
                  : endOfDay(new Date()),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-1 items-center">
            <TbTarget className="!w-5 !h-5 stroke-[1.8px]" />
            Today
          </div>
          <p className="text-xs text-muted-foreground">
            {format(new Date(), "EEE")}
          </p>
        </button>

        {/* --- OPTION: TOMORROW --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: tomorrow,
              to:
                prev?.to && prev?.from
                  ? endOfDay(
                      addDays(tomorrow, differenceInDays(prev.to, prev.from)),
                    )
                  : endOfDay(tomorrow),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-1 items-center">
            <Tomorrow className="!w-5 !h-5" />
            Tomorrow
          </div>
          <p className="text-xs text-muted-foreground">
            {format(tomorrow, "EEE")}
          </p>
        </button>

        {/* --- OPTION: NEXT WEEK --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: nextWeek,
              to:
                prev?.to && prev?.from
                  ? new Date(
                      addDays(
                        nextWeek,
                        differenceInDays(prev?.to, prev?.from),
                      ).setHours(prev.to.getHours(), prev.to.getMinutes()),
                    )
                  : endOfDay(nextWeek),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-1 items-center">
            <CalenderIcon className="!w-5 !h-5 stroke-[1.8px]" />
            Next Week
          </div>
          <p className="text-xs text-muted-foreground">Mon</p>
        </button>

        {/* --- DURATION --- */}
        <DurationPicker />

        <LineSeparator className="border-popover-accent w-full my-1" />

        {/* --- CALENDAR --- */}
        <div className="flex justify-center p-0">
          <Calendar
            className="p-0 pb-4"
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

export default DayMenu;
