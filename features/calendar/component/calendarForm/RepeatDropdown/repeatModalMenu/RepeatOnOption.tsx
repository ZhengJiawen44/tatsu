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
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Checkbox
              id="Mo"
              value={0}
              checked={byweekday?.includes(0) || false}
              onCheckedChange={() => toggleByDay(0)}
            />
            <label htmlFor="Mo">Mo</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Tu"
              value={1}
              checked={byweekday?.includes(1) || false}
              onCheckedChange={() => toggleByDay(1)}
            />
            <label htmlFor="Tu">Tu</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="We"
              value={2}
              checked={byweekday?.includes(2) || false}
              onCheckedChange={() => toggleByDay(2)}
            />
            <label htmlFor="We">We</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Th"
              value={3}
              checked={byweekday?.includes(3) || false}
              onCheckedChange={() => toggleByDay(3)}
            />
            <label htmlFor="Th">Th</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Fr"
              value={4}
              checked={byweekday?.includes(4) || false}
              onCheckedChange={() => toggleByDay(4)}
            />
            <label htmlFor="Fr">Fr</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Sa"
              value={5}
              checked={byweekday?.includes(5) || false}
              onCheckedChange={() => toggleByDay(5)}
            />
            <label htmlFor="Sa">Sa</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Su"
              value={6}
              checked={byweekday?.includes(6) || false}
              onCheckedChange={() => toggleByDay(6)}
            />
            <label htmlFor="Su">Su</label>
          </div>
        </div>
      </div>
    )
  );
};

export default RepeatOnOption;
