import { RRule, RRuleSet } from "rrule";
import { recurringTodoItemType } from "@/types";
import { toZonedTime } from "date-fns-tz";
type bounds = {
  dateRangeStart: Date;
  dateRangeEnd: Date;
};
import { addMinutes } from "date-fns";

/**
 * expands todo occurences based on the RRule and dtstart field.
 *
 * @param recurringTodos array of todos with the rrule and optional instances field
 * @param timeZone user timeZone in standard IANA format
 * @param bounds time in UTC of user's start and end of day
 * @returns an array of "ghost" todos
 */

export default function generateTodosFromRRule(
  recurringTodos: recurringTodoItemType[],
  timeZone: string,
  bounds: bounds,
): recurringTodoItemType[] {
  return recurringTodos.flatMap((parent) => {
    try {
      // duration and due are both optional. getting duration is trickier
      const calculatedDuration = parent.durationMinutes
        ? parent.durationMinutes
        : parent.due
          ? (parent.due.getTime() - parent.dtstart.getTime()) / 1000
          : null;

      const ruleSet = genRuleSet(
        parent.rrule,
        parent.dtstart,
        timeZone,
        parent.exdates,
      );

      //enlarge the start of the search window
      const searchStart = calculatedDuration
        ? new Date(bounds.dateRangeStart.getTime() / 1000 - calculatedDuration)
        : bounds.dateRangeStart;

      const occurrences = ruleSet.between(
        searchStart,
        bounds.dateRangeEnd,
        true,
      );

      return occurrences.map((occ) => {
        return {
          ...parent,
          dtstart: occ,
          ...(calculatedDuration && {
            due: addMinutes(occ, calculatedDuration),
          }),
          instanceDate: occ,
        };
      });
    } catch (e) {
      console.error(`Error parsing RRULE for Todo ${parent.id}:`, e);
      return [];
    }
  });
}

/**
 * generates a rule object that is timeZone aware
 * @param rrule string with the rrule
 * @param dtStart the start time of user's todo in UTC time
 * @param timeZone user's time zone
 * @returns RRule object
 */

export function genRuleSet(
  rrule: string,
  dtStart: Date,
  timeZone: string,
  exdates?: Date[],
) {
  const options = RRule.parseString(rrule);
  options.dtstart = toZonedTime(dtStart, timeZone);
  options.tzid = timeZone;

  const rule = new RRule(options);
  const set = new RRuleSet();

  set.rrule(rule);

  for (const ex of exdates ?? []) {
    set.exdate(toZonedTime(ex, timeZone));
  }

  return set;
}
