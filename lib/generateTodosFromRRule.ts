import { RRule, RRuleSet } from "rrule";
import { recurringTodoWithInstance } from "@/types";
import { toZonedTime } from "date-fns-tz";
type bounds = {
  dateRangeStart: Date;
  dateRangeEnd: Date;
};
import { addMilliseconds } from "date-fns";

/**
 * generates in-memory instances of todo based on the RRule field in todo.
 *
 * @param recurringParents array of todos with the rrule and optional instances field
 * @param timeZone user timeZone in standard IANA format
 * @param bounds time in UTC of user's start and end of day
 * @returns an array of "ghost" todos
 */

export default function generateTodosFromRRule(
  recurringParents: recurringTodoWithInstance[],
  timeZone: string,
  bounds: bounds,
): recurringTodoWithInstance[] {
  return recurringParents.flatMap((parent) => {
    try {
      const durationMs = parent.due.getTime() - parent.dtstart.getTime();

      const ruleSet = genRuleSet(
        parent.rrule,
        parent.dtstart,
        timeZone,
        parent.exdates,
      );
      const searchStart = new Date(
        bounds.dateRangeStart.getTime() - durationMs,
      );
      const occurrences = ruleSet.between(
        searchStart,
        bounds.dateRangeEnd,
        true,
      );

      return occurrences.map((occ) => {
        return {
          ...parent,
          dtstart: occ,
          durationMinutes: durationMs / 60000,
          due: addMilliseconds(occ, durationMs),
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
