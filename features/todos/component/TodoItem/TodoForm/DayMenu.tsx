import { addDays, endOfDay, startOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React from "react";
import CalenderIcon from "@/components/ui/icon/calender";
import { format, nextMonday, differenceInDays } from "date-fns";
import LineSeparator from "@/components/ui/lineSeparator";
import {
  MenuContainer,
  MenuItem,
  MenuTrigger,
  MenuContent,
} from "@/components/ui/Menu";
import Sun from "@/components/ui/icon/sun";
import Tommorrow from "@/components/ui/icon/tommorrow";
import { useTodoForm } from "@/providers/TodoFormProvider";

const DayMenu = () => {
  const { todoItem: todo, dateRange, setDateRange } = useTodoForm();
  const nextWeek = nextMonday(dateRange?.from || startOfDay(new Date()));
  const tomorrow = addDays(dateRange?.from || startOfDay(new Date()), 1);

  function getDisplayDate(date: Date) {
    const formattedDate = format(date, "MMM dd yyyy");
    return date.getFullYear() === new Date().getFullYear()
      ? formattedDate.replace(` ${date.getFullYear()}`, "")
      : formattedDate;
  }

  //get date from todo or set to default
  return (
    <MenuContainer>
      <MenuTrigger className="flex justify-center items-center gap-1 p-1 w-full h-full hover:bg-accent">
        <CalenderIcon className="w-5 h-5" />
        {dateRange?.from
          ? getDisplayDate(dateRange.from)
          : todo?.startedAt
            ? getDisplayDate(todo.startedAt)
            : "today"}
      </MenuTrigger>
      <MenuContent className="flex flex-col gap-1 p-1 font-extralight border-popover-accent">
        <MenuItem
          className="flex justify-between w-full m-0"
          onClick={() =>
            setDateRange((prev) => {
              return {
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
              };
            })
          }
        >
          <div className="flex gap-1">
            <Sun className="w-5 h-5" />
            Today
          </div>
          <p className="text-xs text-card-foreground-muted">
            {format(new Date(), "EEE")}
          </p>
        </MenuItem>
        <MenuItem
          className="justify-between w-full m-0"
          onClick={() =>
            setDateRange((prev) => {
              return {
                from: tomorrow,
                to:
                  prev?.to && prev?.from
                    ? endOfDay(
                        addDays(tomorrow, differenceInDays(prev.to, prev.from)),
                      )
                    : endOfDay(tomorrow),
              };
            })
          }
        >
          <div className="flex gap-1">
            <Tommorrow className="w-5 h-5 " />
            Tomorrow
          </div>
          <p className="text-xs text-card-foreground-muted">
            {format(
              dateRange?.from
                ? addDays(dateRange.from, 1)
                : new Date().getDate() + 1,
              "EEE",
            )}
          </p>
        </MenuItem>
        <MenuItem
          className="justify-between w-full m-0"
          onClick={() => {
            setDateRange((prev) => {
              return {
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
              };
            });
          }}
        >
          <div className="flex gap-1">
            <CalenderIcon className="w-5 h-5 stroke-1" />
            Next Week
          </div>
          <p className="text-xs text-card-foreground-muted">Mon</p>
        </MenuItem>

        <LineSeparator className="border-popover-accent w-full" />
        <MenuItem className=" flex flex-col hover:bg-inherit m-0">
          <Calendar
            className="p-1"
            mode="range"
            defaultMonth={new Date()}
            disabled={(date) => {
              return date <= addDays(new Date(), -1);
            }}
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
          {/* <TimePicker /> */}
        </MenuItem>
      </MenuContent>
    </MenuContainer>
  );
};

export default DayMenu;
