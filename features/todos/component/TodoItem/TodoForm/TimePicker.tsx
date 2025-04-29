import Selector from "@/components/ui/icon/selector";
import { ScrollArea } from "@/components/ui/scroll-area";
import clsx from "clsx";
import Check from "@/components/ui/icon/check";
import React, { useState } from "react";
import { format } from "date-fns";

const TimePicker = ({
  expireTime,
  setExpireTime,
}: {
  expireTime: string;
  setExpireTime: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const [showTimePicker, setShowTimePicker] = useState(false);
  const hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );

  console.log(format(expireTime, "hh"));

  return (
    <div className="relative flex justify-between w-full rounded-sm p-1 border">
      end time
      <label className="m-0 p-0">
        <div
          className="absolute inset-y-0 right-0 flex items-center justify-center p-1"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            setShowTimePicker(!showTimePicker);
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
                  className="mb-2 rounded-sm text-center relative hover:bg-border hover:cursor-pointer"
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
                  className="text-center mb-2 rounded-sm relative hover:bg-border hover:cursor-pointer"
                  key={minute}
                >
                  {expireTime.slice(3, 5) === minute && (
                    <Check className="w-4 h-4 absolute top-1/2 -translate-y-1/2 m-0 left-0" />
                  )}
                  {minute}
                </div>
              ))}
            </ScrollArea>
            <div className="flex-1 flex flex-col items-center gap-2 ">
              <div className=" w-full rounded-sm text-center hover:bg-border hover:cursor-pointer">
                AM
              </div>
              <div className=" w-full rounded-sm text-center hover:bg-border hover:cursor-pointer">
                PM
              </div>
            </div>
          </div>
        </div>
      </label>
    </div>
  );
};

export default TimePicker;
