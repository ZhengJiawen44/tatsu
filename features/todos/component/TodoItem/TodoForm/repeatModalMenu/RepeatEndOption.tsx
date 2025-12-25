import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ChevronDownIcon } from "lucide-react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Options } from "rrule";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { masqueradeAsUTC } from "@/features/todos/lib/masqueradeAsUTC";

const RepeatEndOption = () => {
  const [open, setOpen] = useState(false);

  const { rruleOptions, setRruleOptions } = useTodoForm();

  function removeUntil(options: Partial<Options> | null) {
    //remove until when rrule is never ending
    if (options?.until) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { until, ...newOptions } = options;
      return newOptions;
    }
    return options;
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium ">ends</p>
      <RadioGroup>
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value="never"
            id="never"
            checked={rruleOptions?.until ? false : true}
            onClick={() => {
              setRruleOptions(removeUntil(rruleOptions));
            }}
          />
          <label htmlFor="never">never</label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value="exDate"
            id="exDate"
            checked={rruleOptions?.until ? true : false}
            onClick={() => {
              setRruleOptions({ ...rruleOptions, until: new Date() });
            }}
          />
          <label htmlFor="exDate">on Date (inclusive)</label>
          {/* date picker */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                id="date"
                className={clsx(
                  "w-48 justify-between font-normal border-border opacity-0",
                  rruleOptions?.until && "opacity-100",
                )}
              >
                {rruleOptions?.until
                  ? rruleOptions?.until.toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={rruleOptions?.until || new Date()}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setRruleOptions({
                    ...rruleOptions,
                    until: masqueradeAsUTC(date || new Date()),
                  });
                  setOpen(false);
                }}
              />
            </PopoverContent>
          </Popover>
        </div>
      </RadioGroup>
    </div>
  );
};

export default RepeatEndOption;
