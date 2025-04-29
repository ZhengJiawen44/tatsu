import { TodoItemType } from "@/types";
import { addDays, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { SetStateAction, useState } from "react";
import CalenderIcon from "@/components/ui/icon/calender";
import { isEqual } from "@/lib/date/isEqual";
import { monthNames } from "@/lib/date/dateConstants";
import { DateRange } from "react-day-picker";
import { format, nextMonday, differenceInDays } from "date-fns";
import LineSeparator from "@/components/ui/lineSeparator";
import TimePicker from "./TimePicker";
import {
  MenuContainer,
  MenuItem,
  MenuTrigger,
  MenuContent,
} from "@/components/ui/Menu";
import Sun from "@/components/ui/icon/sun";
import Tommorrow from "@/components/ui/icon/tommorrow";

interface DayMenuProps {
  dateRange: DateRange | undefined;
  setDateRange: React.Dispatch<SetStateAction<DateRange | undefined>>;
  expireTime: string;
  setExpireTime: React.Dispatch<SetStateAction<string>>;
  todo?: TodoItemType;
}
const DayMenu = ({
  todo,
  dateRange,
  setDateRange,
  expireTime,
  setExpireTime,
}: DayMenuProps) => {
  const nextWeek = nextMonday(dateRange?.from || new Date());
  const tomorrow = addDays(dateRange?.from || new Date(), 1);

  //get date from todo or set to default
  return (
    <MenuContainer>
      <MenuTrigger className="flex justify-center items-center gap-1 p-0">
        <CalenderIcon className="w-5 h-5" />
        {todo?.startedAt && isEqual(todo.startedAt, new Date())
          ? "today"
          : todo &&
            `${
              monthNames[todo.startedAt.getMonth()]
            } ${todo?.startedAt.getDate()} ${
              todo?.startedAt.getFullYear() !== new Date().getFullYear()
                ? ` ${todo?.startedAt.getFullYear()}`
                : ""
            }`}
      </MenuTrigger>
      <MenuContent className="flex flex-col gap-1 p-1 font-extralight border-popover-accent">
        <MenuItem
          className="flex justify-between w-full m-0"
          onClick={() =>
            setDateRange((prev) => {
              return {
                from: new Date(),
                to:
                  prev?.to && prev.from
                    ? endOfDay(
                        addDays(
                          new Date(),
                          differenceInDays(prev?.to, prev?.from)
                        )
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
                        addDays(
                          tomorrow,
                          differenceInDays(prev?.to, prev?.from)
                        )
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
              "EEE"
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
                    ? endOfDay(
                        addDays(
                          nextWeek,
                          differenceInDays(prev?.to, prev?.from)
                        )
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
            onSelect={setDateRange}
            numberOfMonths={1}
          />
          <TimePicker expireTime={expireTime} setExpireTime={setExpireTime} />
        </MenuItem>
      </MenuContent>
    </MenuContainer>
  );
};

export default DayMenu;
