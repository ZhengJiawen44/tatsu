import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import React, { SetStateAction } from "react";
import { Options, RRule } from "rrule";

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
  const currentInterval = customRepeatOptions?.interval || 1;
  function removeByweekday(options: Partial<Options> | null) {
    //remove byweekday when freq is daily
    if (options?.byweekday) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { byweekday, ...newOptions } = options;
      return newOptions;
    }
    return options;
  }
  return (
    <div className="flex flex-col gap-2">
      <p className="font-medium">Every</p>
      <div className="flex gap-2 w-1/2 m-0 p-0">
        {/* repeatInterval count input */}
        <Input
          className="w-1/2 border-border"
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
        <NativeSelect
          className="min-w-1/2 h-full border-border hover:bg-accent"
          defaultValue={
            customRepeatOptions?.freq == RRule.DAILY
              ? "Day"
              : customRepeatOptions?.freq == RRule.WEEKLY
                ? "Week"
                : customRepeatOptions?.freq == RRule.MONTHLY
                  ? "Month"
                  : customRepeatOptions?.freq == RRule.YEARLY
                    ? "Year"
                    : "Daily"
          }
        >
          <NativeSelectOption
            value={"Day"}
            onClick={() => {
              setCustomRepeatOptions({
                ...removeByweekday(customRepeatOptions),
                freq: RRule.DAILY,
              });
            }}
          >
            {currentInterval > 1 ? "Days" : "Day"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Week"}
            onClick={() => {
              setCustomRepeatOptions({
                ...customRepeatOptions,
                freq: RRule.WEEKLY,
              });
            }}
          >
            {currentInterval > 1 ? "Weeks" : "Week"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Month"}
            onClick={() =>
              setCustomRepeatOptions({
                ...removeByweekday(customRepeatOptions),
                freq: RRule.MONTHLY,
              })
            }
          >
            {currentInterval > 1 ? "Months" : "Month"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Year"}
            onClick={() =>
              setCustomRepeatOptions({
                ...removeByweekday(customRepeatOptions),
                freq: RRule.YEARLY,
              })
            }
          >
            {currentInterval > 1 ? "Years" : "Year"}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  );
};

export default RepeatEveryOption;
