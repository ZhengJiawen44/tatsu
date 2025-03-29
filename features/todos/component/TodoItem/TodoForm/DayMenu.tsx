import { TodoItemType } from "@/types";
import { addDays, endOfDay } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { SetStateAction, useState } from "react";
import CalenderIcon from "@/components/ui/icon/calender";
import Selector from "@/components/ui/icon/selector";
import { isEqual } from "@/lib/date/isEqual";
import { monthNames } from "@/lib/date/dateConstants";
import { DateRange } from "react-day-picker";
import { format, nextMonday, differenceInDays } from "date-fns";
import Check from "@/components/ui/icon/check";
import LineSeparator from "@/components/ui/lineSeparator";
import clsx from "clsx";
import {
  MenuContainer,
  MenuItem,
  MenuTrigger,
  MenuContent,
} from "@/components/ui/Menu";
import { ScrollArea } from "@/components/ui/scroll-area";
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
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  const [showTimePicker, setTimePicker] = useState(false);
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
          <div className="relative flex justify-between w-full rounded-sm p-1 border">
            end time
            <label className="relative m-0 p-0">
              <div
                className="absolute inset-y-0 right-0 flex items-center justify-center p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                  setTimePicker(!showTimePicker);
                }}
              >
                <Selector className="w-5 h-5 bg-popover stroke-1 hover:bg-border rounded-sm hover:cursor-pointer" />
              </div>
              <input
                value={expireTime}
                onChange={(e) => setExpireTime(e.currentTarget.value)}
                type="time"
                className="select-none bg-inherit outline-none hover:cursor-pointer"
              />
            </label>
            <div
              className={clsx(
                "absolute bottom-10 left-0 w-full bg-popover rounded-sm overflow-hidden transition-all duration-300 shadow-md",
                showTimePicker ? "max-h-52 h-52 border p-2" : "max-h-0 h-0"
              )}
            >
              <div className="flex w-full h-full justify-evenly">
                <ScrollArea className="flex-1">
                  {hours.map((hour) => (
                    <div
                      className="mb-2 rounded-sm text-center relative"
                      key={hour}
                    >
                      {+expireTime.slice(0, 2) === hour && (
                        <Check className="w-4 h-4 absolute top-1/2 -translate-y-1/2 m-0 left-0" />
                      )}
                      {hour}
                    </div>
                  ))}
                </ScrollArea>
                <ScrollArea className="flex-1">
                  {minutes.map((minute) => (
                    <div
                      className="text-center mb-2 rounded-sm relative"
                      key={minute}
                    >
                      {expireTime.slice(3, 5) === minute && (
                        <Check className="w-4 h-4 absolute top-1/2 -translate-y-1/2 m-0 left-0" />
                      )}
                      {minute}
                    </div>
                  ))}
                </ScrollArea>
                <div className="flex-1 flex flex-col items-center gap-2">
                  <div>AM</div>
                  <div>PM</div>
                </div>
              </div>
            </div>
          </div>
        </MenuItem>
      </MenuContent>
    </MenuContainer>
  );
};

export default DayMenu;
