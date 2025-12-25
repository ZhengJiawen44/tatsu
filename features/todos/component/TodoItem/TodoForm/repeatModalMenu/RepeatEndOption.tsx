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
import { RRule } from "rrule";
import { useTodoForm } from "@/providers/TodoFormProvider";
import { masqueradeAsUTC } from "@/features/todos/lib/masqueradeAsUTC";

const RepeatEndOption = ({ rruleObject }: { rruleObject: RRule | null }) => {
  const [open, setOpen] = useState(false);
  const until = rruleObject?.options.until;
  const { setRrule } = useTodoForm();
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium ">ends</p>
      <RadioGroup>
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value="never"
            id="never"
            checked={until ? false : true}
            onClick={() => {
              const newRruleObj = new RRule({
                ...rruleObject?.options,
                until: null,
              });
              setRrule(newRruleObj.toString());
            }}
          />
          <label htmlFor="never">never</label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value="exDate"
            id="exDate"
            checked={until ? true : false}
            onClick={() => {
              const newRruleObj = new RRule({
                ...rruleObject?.options,
                until: new Date(),
              });
              setRrule(newRruleObj.toString());
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
                  until && "opacity-100",
                )}
              >
                {until ? until.toLocaleDateString() : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto overflow-hidden p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={until || new Date()}
                captionLayout="dropdown"
                onSelect={(date) => {
                  const newRruleObj = new RRule({
                    ...rruleObject?.options,
                    until: masqueradeAsUTC(date || new Date()),
                  });
                  setRrule(newRruleObj.toString());
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
