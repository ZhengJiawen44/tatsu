import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useTodoForm } from "@/providers/TodoFormProvider";
import React from "react";
import { Options, RRule } from "rrule";

const RepeatEveryOption = ({ rruleObject }: { rruleObject: RRule | null }) => {
  const { rruleOptions, setRruleOptions } = useTodoForm();
  const currentInterval = rruleObject?.options.interval || 1;
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
              setRruleOptions({ ...rruleOptions, interval });
            }
          }}
        />
        {/* repeatInterval type input */}
        <NativeSelect
          className="min-w-1/2 h-full border-border hover:bg-accent"
          defaultValue={
            rruleObject?.options.freq == RRule.DAILY
              ? "Day"
              : rruleObject?.options.freq == RRule.WEEKLY
                ? "Week"
                : rruleObject?.options.freq == RRule.MONTHLY
                  ? "Month"
                  : "Year"
          }
        >
          <NativeSelectOption
            value={"Day"}
            onClick={() => {
              setRruleOptions({
                ...removeByweekday(rruleOptions),
                freq: RRule.DAILY,
              });
            }}
          >
            {currentInterval > 1 ? "Days" : "Day"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Week"}
            onClick={() => {
              setRruleOptions({
                ...rruleOptions,
                freq: RRule.WEEKLY,
              });
            }}
          >
            {currentInterval > 1 ? "Weeks" : "Week"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Month"}
            onClick={() =>
              setRruleOptions({
                ...removeByweekday(rruleOptions),
                freq: RRule.MONTHLY,
              })
            }
          >
            {currentInterval > 1 ? "Months" : "Month"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Year"}
            onClick={() =>
              setRruleOptions({
                ...removeByweekday(rruleOptions),
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
