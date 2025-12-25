import { Input } from "@/components/ui/input";
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select";
import { useTodoForm } from "@/providers/TodoFormProvider";
import React from "react";
import { RRule } from "rrule";

const RepeatEveryOption = ({ rruleObject }: { rruleObject: RRule | null }) => {
  const { rrule, setRrule } = useTodoForm();
  const currentInterval = rruleObject?.options.interval || 1;
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
            const newRrule = new RRule({ ...rruleObject?.options, interval });
            if (rruleObject && interval) {
              setRrule(() => {
                return newRrule.toString();
              });
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
              const newRrule = new RRule({
                ...rruleObject?.options,
                freq: RRule.DAILY,
              });
              setRrule(newRrule.toString());
            }}
          >
            {currentInterval > 1 ? "Days" : "Day"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Week"}
            onClick={() => {
              const newRrule = new RRule({
                ...rruleObject?.options,
                freq: RRule.WEEKLY,
              });
              setRrule(newRrule.toString());
            }}
          >
            {currentInterval > 1 ? "Weeks" : "Week"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Month"}
            onClick={() => {
              const newRrule = new RRule({
                ...rruleObject?.options,
                freq: RRule.MONTHLY,
              });
              setRrule(newRrule.toString());
            }}
          >
            {currentInterval > 1 ? "Months" : "Month"}
          </NativeSelectOption>
          <NativeSelectOption
            value={"Year"}
            onClick={() => {
              const newRrule = new RRule({
                ...rruleObject?.options,
                freq: RRule.YEARLY,
              });
              setRrule(newRrule.toString());
            }}
          >
            {currentInterval > 1 ? "Years" : "Year"}
          </NativeSelectOption>
        </NativeSelect>
      </div>
    </div>
  );
};

export default RepeatEveryOption;
