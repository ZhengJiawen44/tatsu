import React from "react";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { parse } from "date-fns";
import { Input } from "@/components/ui/input";

const TimePicker = () => {
  const { dateRange, setDateRange } = useTodoForm();

  return (
    <div className=" p-0">
      <Input
        value={
          dateRange?.to ? dateRange.to.toTimeString().slice(0, 5) : "23:59"
        }
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onChange={(e) => {
          setDateRange((old) => {
            return {
              from: old?.from,
              to: parse(e.currentTarget.value, "HH:mm", dateRange!.to!),
            };
          });
        }}
        type="time"
        className="p-0 select-none border-none bg-transparent focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0 hover:cursor-pointer"
      />
    </div>
  );
};

export default TimePicker;
