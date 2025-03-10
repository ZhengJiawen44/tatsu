import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { TodoItemType } from "@/types";
import { addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import React, { SetStateAction } from "react";
import CalenderIcon from "@/components/ui/icon/calender";
import { isEqual } from "@/lib/date/isEqual";
import { monthNames } from "@/lib/date/dateConstants";
import { DateRange } from "react-day-picker";

interface DayPickerProps {
  date: DateRange | undefined;
  setDate: React.Dispatch<SetStateAction<DateRange | undefined>>;
  todo?: TodoItemType;
}
const DayPicker = ({ todo, date, setDate }: DayPickerProps) => {
  //get date from todo or set to default

  return (
    <Popover>
      <PopoverTrigger className="flex gap-1 hover:text-white">
        <CalenderIcon />
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
      </PopoverTrigger>
      <PopoverContent>
        <Calendar
          mode="range"
          defaultMonth={new Date()}
          disabled={(date) => {
            return date <= addDays(new Date(), -1);
          }}
          selected={date}
          onSelect={setDate}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  );
};

export default DayPicker;
