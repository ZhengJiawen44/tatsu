import { useTodoForm } from "@/providers/TodoFormProvider";
import { RRule } from "rrule";
import { masqueradeAsUTC } from "../lib/masqueradeAsUTC";
import { useMemo } from "react";
/*
 * so i have to basically masquerade my local time as UTC and then
 * pass it to dtstart, and when i get my result back i have to convert
 * the output to UTC, even though the output is already in UTC but i have to convert it
 */
export const useNextCalculatedRepeatDate = function () {
  const { rruleOptions, dateRange } = useTodoForm();
  const locallyInferredRruleObject = useMemo(() => {
    if (!rruleOptions) return null;
    return new RRule({
      ...rruleOptions,
      dtstart: masqueradeAsUTC(dateRange.from),
    });
  }, [rruleOptions, dateRange]);
  const nextCalculatedRepeatDate = useMemo(
    () => locallyInferredRruleObject?.after(masqueradeAsUTC(dateRange.from)),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rruleOptions, dateRange],
  );
  return { nextCalculatedRepeatDate, locallyInferredRruleObject };
};
