import { RRule } from "rrule";
import { recurringTodoWithInstance, TodoItemType } from "@/types";
import { toZonedTime } from "date-fns-tz";
type bounds = {
  todayStartUTC: Date;
  todayEndUTC: Date;
};

/**
 * generates in-memory instances of todo based on the RRule field in todo.
 *
 * @param recurringParents array of todos with the rrule and optional instances field
 * @param timeZone user timeZone in standard IANA format
 * @param bounds time in UTC of user's start and end of day
 * @returns an array of "ghost" todos
 */

export default function generateTodosFromRRule(
  recurringParents: recurringTodoWithInstance[] | TodoItemType[],
  timeZone: string,
  bounds: bounds,
): TodoItemType[] {
  const todayRecurringInstances = recurringParents.flatMap((parent) => {
    try {
      if (!parent.rrule) return [];
      const rule = genRule(parent.rrule, parent.dtstart, timeZone);
      //return an array of dtStart
      const occurrences = rule.between(
        bounds.todayStartUTC,
        bounds.todayEndUTC,
        true,
      );
      return occurrences.flatMap((occ) => {
        return {
          ...parent,
          dtstart: occ,
        };
      });
    } catch (e) {
      console.error(`Error parsing RRULE for Todo ${parent.id}:`, e);
      return [];
    }
  });
  return todayRecurringInstances;
}

/**
 * generates a rule object that is timeZone aware
 * @param rrule string with the rrule
 * @param dtStart the start time of user's todo in UTC time
 * @param timeZone user's time zone
 * @returns RRule object
 */
export function genRule(rrule: string, dtStart: Date, timeZone: string) {
  const options = RRule.parseString(rrule);
  options.dtstart = toZonedTime(dtStart, timeZone);
  options.tzid = timeZone;
  const rule = new RRule(options);
  return rule;
}
// export function genRule(rrule: string, dtStart: Date, timeZone: string) {
//   console.log(dtStart); //2025-12-15T19:40:40.000Z
//   const options = RRule.parseString(rrule);
//   options.dtstart = toZonedTime(dtStart, timeZone);
//   options.tzid = timeZone;
//   const rule = new RRule(options);
//   return rule;
// }
