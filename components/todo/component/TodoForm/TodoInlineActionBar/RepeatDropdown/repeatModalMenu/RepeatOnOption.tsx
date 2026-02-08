import { Checkbox } from "@/components/ui/checkbox";
import React, { SetStateAction } from "react";
import { Options, RRule } from "rrule";
import { useTranslations } from "next-intl";
interface RepeatOnOptionProps {
  customRepeatOptions: Partial<Options> | null;
  setCustomRepeatOptions: React.Dispatch<
    SetStateAction<Partial<Options> | null>
  >;
}

const RepeatOnOption = ({
  customRepeatOptions,
  setCustomRepeatOptions,
}: RepeatOnOptionProps) => {
  const appDict = useTranslations("app");
  const rruleObj = customRepeatOptions ? new RRule(customRepeatOptions) : null;
  const byweekday = rruleObj?.options.byweekday;
  const freq = customRepeatOptions?.freq;

  function toggleByDay(day: number) {
    let newByweekday;
    if (!byweekday) {
      newByweekday = [day];
    } else if (byweekday.includes(day)) {
      newByweekday = byweekday.filter((item) => item !== day);
    } else {
      newByweekday = [...byweekday, day];
    }
    setCustomRepeatOptions({ ...customRepeatOptions, byweekday: newByweekday });
  }

  return (
    freq == RRule.WEEKLY && (
      <div className="flex flex-col gap-2">
        <p className="font-medium "> {appDict("customMenu.on")}</p>
        <div className="flex flex-wrap gap-4">
          {["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"].map((day, index) => {
            return (<div className="flex items-center gap-1" key={day}>
              <Checkbox
                id={day}
                value={index}
                checked={byweekday?.includes(index) || false}
                onCheckedChange={() => toggleByDay(index)}
              />
              <label htmlFor={day} className="cursor-pointer hover:underline">{day}</label>
            </div>)
          })}

        </div>
      </div>
    )
  );
};

export default RepeatOnOption;
