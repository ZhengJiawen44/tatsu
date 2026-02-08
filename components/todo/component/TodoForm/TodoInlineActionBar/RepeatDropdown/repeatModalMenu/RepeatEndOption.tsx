import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { SetStateAction, useState } from "react";
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
import { masqueradeAsUTC } from "@/components/todo/lib/masqueradeAsUTC";
import { useTranslations } from "next-intl";

interface RepeatEndOptionProps {
  customRepeatOptions: Partial<Options> | null;
  setCustomRepeatOptions: React.Dispatch<
    SetStateAction<Partial<Options> | null>
  >;
}
const RepeatEndOption = ({
  customRepeatOptions,
  setCustomRepeatOptions,
}: RepeatEndOptionProps) => {
  const appDict = useTranslations("app");
  const [open, setOpen] = useState(false);

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
      <p className="font-medium ">{appDict("customMenu.ends")}</p>
      <RadioGroup>
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value="never"
            id="never"
            checked={customRepeatOptions?.until ? false : true}
            onClick={() => {
              setCustomRepeatOptions(removeUntil(customRepeatOptions));
            }}
          />
          <label htmlFor="never">{appDict("customMenu.never")}</label>
        </div>
        <div className="flex items-center gap-3">
          <RadioGroupItem
            value="exDate"
            id="exDate"
            checked={customRepeatOptions?.until ? true : false}
            onClick={() => {
              setCustomRepeatOptions({
                ...customRepeatOptions,
                until: new Date(),
              });
            }}
          />
          <label htmlFor="exDate">{appDict("customMenu.onDate")}</label>
          {/* date picker */}
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                id="date"
                className={clsx(
                  "w-48 justify-between font-normal border-border opacity-0",
                  customRepeatOptions?.until && "opacity-100",
                )}
              >
                {customRepeatOptions?.until
                  ? customRepeatOptions?.until.toLocaleDateString()
                  : "Select date"}
                <ChevronDownIcon />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-auto p-0"
              align="start"
            >
              <Calendar
                mode="single"
                selected={customRepeatOptions?.until || new Date()}
                captionLayout="dropdown"
                onSelect={(date) => {
                  setCustomRepeatOptions({
                    ...customRepeatOptions,
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
