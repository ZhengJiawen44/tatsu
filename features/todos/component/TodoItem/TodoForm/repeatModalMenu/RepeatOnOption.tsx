import { Checkbox } from "@/components/ui/checkbox";
import React from "react";
import { RRule } from "rrule";
import { useTodoForm } from "@/providers/TodoFormProvider";

const RepeatOnOption = ({ rruleObject }: { rruleObject: RRule | null }) => {
  const { setRrule } = useTodoForm();
  const byweekday = rruleObject?.options.byweekday || [];
  const freq = rruleObject?.options.freq;
  function toggleByDay(day: number) {
    let newByweekday;
    if (byweekday.includes(day)) {
      newByweekday = byweekday.filter((item) => item !== day);
    } else {
      newByweekday = [...byweekday, day];
    }

    const newRrule = new RRule({
      ...rruleObject?.options,
      byweekday: newByweekday,
    });

    setRrule(newRrule.toString());
  }

  return (
    freq == RRule.WEEKLY && (
      <div className="flex flex-col gap-2">
        <p className="font-medium ">On</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <Checkbox
              id="Mo"
              value={0}
              checked={byweekday?.includes(0)}
              onCheckedChange={() => toggleByDay(0)}
            />
            <label htmlFor="Mo">Mo</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Tu"
              value={1}
              checked={byweekday?.includes(1)}
              onCheckedChange={() => toggleByDay(1)}
            />
            <label htmlFor="Tu">Tu</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="We"
              value={2}
              checked={byweekday?.includes(2)}
              onCheckedChange={() => toggleByDay(2)}
            />
            <label htmlFor="We">We</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Th"
              value={3}
              checked={byweekday?.includes(3)}
              onCheckedChange={() => toggleByDay(3)}
            />
            <label htmlFor="Th">Th</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Fr"
              value={4}
              checked={byweekday?.includes(4)}
              onCheckedChange={() => toggleByDay(4)}
            />
            <label htmlFor="Fr">Fr</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Sa"
              value={5}
              checked={byweekday?.includes(5)}
              onCheckedChange={() => toggleByDay(5)}
            />
            <label htmlFor="Sa">Sa</label>
          </div>
          <div className="flex items-center gap-1">
            <Checkbox
              id="Su"
              value={6}
              checked={byweekday?.includes(6)}
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
