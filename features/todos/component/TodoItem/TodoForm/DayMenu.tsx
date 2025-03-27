import { TodoItemType } from "@/types";
import { addDays, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { SetStateAction } from "react";
import CalenderIcon from "@/components/ui/icon/calender";
import Selector from "@/components/ui/icon/selector";
import { isEqual } from "@/lib/date/isEqual";
import { monthNames } from "@/lib/date/dateConstants";
import { DateRange } from "react-day-picker";
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

interface DayMenuProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<SetStateAction<DateRange | undefined>>;
  expireTime: string;
  setExpireTime: React.Dispatch<SetStateAction<string>>;
  todo?: TodoItemType;
}
const DayMenu = ({
  todo,
  date,
  setDate,
  expireTime,
  setExpireTime,
}: DayMenuProps) => {
  const nextWeek = nextMonday(date?.from || new Date());
  const tomorrow = addDays(date?.from || new Date(), 1);
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
            setDate((prev) => {
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
            setDate((prev) => {
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
              date?.from ? addDays(date.from, 1) : new Date().getDate() + 1,
              "EEE"
            )}
          </p>
        </MenuItem>
        <MenuItem
          className="justify-between w-full m-0"
          onClick={() => {
            setDate((prev) => {
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
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
          />
          <div className="flex justify-between w-full rounded-sm p-1 pr-0 border">
            end time
            <label className="relative m-0 p-0">
              <div className="absolute inset-y-0 right-0 flex items-center justify-center  pointer-events-none">
                <Selector className="w-5 h-5 bg-popover stroke-1" />
              </div>
              <input
                value={expireTime}
                onChange={(e) => setExpireTime(e.currentTarget.value)}
                type="time"
                className="bg-inherit outline-none hover:cursor-pointer rounded-sm p-0 m-0"
              />
            </label>
          </div>
        </MenuItem>
      </MenuContent>
    </MenuContainer>
  );
};

export default DayMenu;
