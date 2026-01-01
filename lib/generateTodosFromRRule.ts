import { RRule } from "rrule";
import { recurringTodoWithInstance, TodoItemType } from "@/types";
import { toZonedTime } from "date-fns-tz";
type bounds = {
  todayStartUTC: Date;
  todayEndUTC: Date;
};
import { addMinutes } from "date-fns";

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

      const durationMs = parent.due.getTime() - parent.dtstart.getTime();
      const durationMinutes = durationMs / 60000;
      const rule = genRule(parent.rrule, parent.dtstart, timeZone);

      // Look back from *Today's Start*, not the Parent's Start
      const searchStart = new Date(bounds.todayStartUTC.getTime() - durationMs);

      const occurrences = rule.between(searchStart, bounds.todayEndUTC, true);

      return occurrences.flatMap((occ) => {
        const instanceDue = addMinutes(occ, durationMinutes);
        // If the instance ended before today started, don't include it.
        if (instanceDue <= bounds.todayStartUTC) {
          return [];
        }

        return {
          ...parent,
          dtstart: occ,
          durationMinutes,
          due: instanceDue,
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
