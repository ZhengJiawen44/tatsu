import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { SetStateAction } from "react";

import { Calendar } from "@/components/ui/calendar";
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
        </div>
        {/* date picker */}
        <div className="w-full m-auto my-4">
          <Calendar
            disabled={!customRepeatOptions?.until}
            className="w-full px-2 pt-0"
            classNames={{
              months: "w-full",
              month: "w-full space-y-4 ",
              table: "w-full table-fixed",
              head_row: "w-full",
              head_cell: "pb-2 text-muted-foreground font-normal text-xs",
              row: "w-full",
              cell: "w-11 h-11",
              day: "w-11 h-11 text-sm text-foreground/80",
              nav_button:
                "z-50 w-10 h-10 rounded-full flex items-center justify-center bg-popover/60 hover:bg-popover-accent backdrop-blur-sm",
              nav: "w-10 h-10"

            }}
            mode="single"
            selected={customRepeatOptions?.until || undefined}
            captionLayout="dropdown"
            onSelect={(date) => {
              setCustomRepeatOptions({
                ...customRepeatOptions,
                until: masqueradeAsUTC(date || new Date()),
              });
            }}
          />
        </div>
      </RadioGroup>
    </div>
  );
};

export default RepeatEndOption;
