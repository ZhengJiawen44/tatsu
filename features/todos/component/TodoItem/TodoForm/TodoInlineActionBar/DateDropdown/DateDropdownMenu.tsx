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
import { Button } from "@/components/ui/button";
import { getDisplayDate } from "@/features/todos/lib/getDisplayDate";

const DateDropdownMenu = () => {
  const { dateRange, setDateRange } = useTodoForm();
  const nextWeek = startOfDay(nextMonday(dateRange?.from || new Date()));
  const tomorrow = startOfDay(addDays(dateRange?.from || new Date(), 1));
  const [isOpen, setIsOpen] = React.useState(false);

  const itemClass =
    "flex justify-between items-center p-2 rounded w-[95%] hover:bg-popover-accent m-auto text-sm";

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className="w-fit h-fit p-2 text-muted-foreground bg-inherit"
        >
          <CalenderIcon strokeWidth={1.3} className="w-5 h-5" />
          <span className="text-sm font-medium">
            {getDisplayDate(dateRange.from)}
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="flex flex-col gap-1 p-0 py-2 w-[250px] font-extralight border-popover-accent"
        align="start"
      >
        {/* --- OPTION: TODAY --- */}
        <button
          className={itemClass}
          onClick={() => {
            setDateRange((prev) => ({
              from: startOfDay(new Date()),
              to:
                prev.to && prev.from
                  ? new Date(
                      endOfDay(
                        addDays(
                          new Date(),
                          differenceInDays(prev.to, prev.from),
                        ),
                      ),
                    )
                  : endOfDay(new Date()),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-2 items-center">
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
                prev.to && prev.from
                  ? endOfDay(
                      addDays(tomorrow, differenceInDays(prev.to, prev.from)),
                    )
                  : endOfDay(tomorrow),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-2 items-center">
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
                prev.to && prev.from
                  ? endOfDay(
                      new Date(
                        addDays(nextWeek, differenceInDays(prev.to, prev.from)),
                      ),
                    )
                  : endOfDay(nextWeek),
            }));
            setIsOpen(false);
          }}
        >
          <div className="flex gap-2 items-center">
            <CalenderIcon strokeWidth={1.4} className="!w-5 !h-5" />
            Next Week
          </div>
          <div className="text-xs text-muted-foreground">Mon</div>
        </button>

        {/* --- DURATION --- */}
        <DurationPicker className={itemClass} />

        <LineSeparator className="border-popover-accent w-full my-1 mb-4" />

        {/* --- CALENDAR --- */}
        <div className="flex justify-center p-0">
          <Calendar
            className="p-0 pb-1"
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

export default DateDropdownMenu;
