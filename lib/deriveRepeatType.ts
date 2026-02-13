import { Options, RRule } from "rrule";

export default function deriveRepeatType({
  rruleOptions,
}: {
  rruleOptions: Partial<Options> | null;
}) {
  return rruleOptions?.freq === RRule.WEEKLY &&
    rruleOptions?.byweekday &&
    Array.isArray(rruleOptions.byweekday) &&
    rruleOptions.byweekday.length === 5 &&
    !rruleOptions?.bymonth &&
    !rruleOptions?.bymonthday &&
    !rruleOptions?.bysetpos &&
    !rruleOptions?.byweekno &&
    !rruleOptions?.byyearday &&
    !rruleOptions?.interval
    ? "Weekday"
    : // check for custom patterns
      rruleOptions?.bymonth ||
        rruleOptions?.bymonthday ||
        rruleOptions?.bysetpos ||
        rruleOptions?.byweekday ||
        rruleOptions?.byweekno ||
        rruleOptions?.byyearday ||
        (rruleOptions?.interval && rruleOptions.interval > 1)
      ? "Custom"
      : // check for simple patterns
        rruleOptions?.freq === RRule.DAILY
        ? "Daily"
        : rruleOptions?.freq === RRule.WEEKLY
          ? "Weekly"
          : rruleOptions?.freq === RRule.MONTHLY
            ? "Monthly"
            : rruleOptions?.freq === RRule.YEARLY
              ? "Yearly"
              : null;
}
