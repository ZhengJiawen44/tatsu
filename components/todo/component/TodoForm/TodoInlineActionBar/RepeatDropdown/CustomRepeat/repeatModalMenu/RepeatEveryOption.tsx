import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"


import React, { SetStateAction } from "react";
import { Options, RRule } from "rrule";
import { useTranslations } from "next-intl";

interface RepeatEveryOptionProps {
  customRepeatOptions: Partial<Options> | null;
  setCustomRepeatOptions: React.Dispatch<
    SetStateAction<Partial<Options> | null>
  >;
}

const RepeatEveryOption = ({
  customRepeatOptions,
  setCustomRepeatOptions,
}: RepeatEveryOptionProps) => {
  const appDict = useTranslations("app");
  const currentInterval = customRepeatOptions?.interval || 0;

  function removeByweekday(options: Partial<Options> | null) {
    //remove byweekday when freq is daily
    if (options?.byweekday) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { byweekday, ...newOptions } = options;
      return newOptions;
    }
    return options;
  }

  // Get current frequency as string value
  const getCurrentFreqValue = () => {
    switch (customRepeatOptions?.freq) {
      case RRule.DAILY:
        return "Day";
      case RRule.WEEKLY:
        return "Week";
      case RRule.MONTHLY:
        return "Month";
      case RRule.YEARLY:
        return "Year";
      default:
        return "Day";
    }
  };

  // Handle frequency change
  const handleFrequencyChange = (value: string) => {
    let newOptions = customRepeatOptions;

    switch (value) {
      case "Day":
        newOptions = {
          ...removeByweekday(customRepeatOptions),
          freq: RRule.DAILY,
        };
        break;
      case "Week":
        newOptions = {
          ...customRepeatOptions,
          freq: RRule.WEEKLY,
        };
        break;
      case "Month":
        newOptions = {
          ...removeByweekday(customRepeatOptions),
          freq: RRule.MONTHLY,
        };
        break;
      case "Year":
        newOptions = {
          ...removeByweekday(customRepeatOptions),
          freq: RRule.YEARLY,
        };
        break;
    }

    setCustomRepeatOptions(newOptions);
  };

  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">{appDict("customMenu.every")}</p>
      <div className="flex gap-2 w-full sm:w-1/2 m-0 p-0 ">
        {/* repeatInterval count input */}
        <Input
          className="w-full min-w-24 border-border"
          type="number"
          min={1}
          defaultValue={currentInterval}
          onChange={(e) => {
            const interval = parseInt(e.currentTarget.value);
            if (interval) {
              setCustomRepeatOptions({ ...customRepeatOptions, interval });
            }
          }}
        />
        {/* repeatInterval type input */}
        <Select onValueChange={(value) => handleFrequencyChange(value)}>
          <SelectTrigger className="w-full max-w-48 cursor-pointer">
            <SelectValue placeholder={getCurrentFreqValue()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Day">{appDict("day")}</SelectItem>
            <SelectItem value="Week">{appDict("week")}</SelectItem>
            <SelectItem value="Month">{appDict("month")}</SelectItem>
            <SelectItem value="Year">{appDict("year")}</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default RepeatEveryOption;