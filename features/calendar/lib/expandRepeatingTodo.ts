import { RRule, RRuleSet } from "rrule";
import { recurringTodoItemType } from "@/types";
type bounds = {
  dateRangeStart: Date;
  dateRangeEnd: Date;
};
import { addMinutes } from "date-fns";
type DateRange = {
  start: Date;
  end: Date;
};
export function expandRepeatingTodo(todo: recurringTodoItemType, calendarRange: DateRange){
      // Expand RRULEs to generate occurrences
      return generateTodosFromRRule([todo], {
        dateRangeStart: calendarRange.start,
        dateRangeEnd: calendarRange.end,
      });
}

/**
 * expands todo occurences based on the RRule and dtstart field, used on client side only
 *
 * @param recurringTodos array of todos with the rrule and optional instances field
 * @param bounds time in timezone of user's start and end of day
 * @returns an array of "ghost" todos
 */
function generateTodosFromRRule(
  recurringTodos: recurringTodoItemType[],
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
          id: parent.id+":"+occ.toISOString(),
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
 * @returns RRule object
 */

export function genRuleSet(
  rrule: string,
  dtStart: Date,
) {
  const options = RRule.parseString(rrule);
  options.dtstart = dtStart

  const rule = new RRule(options);
  const set = new RRuleSet();

  set.rrule(rule);

// no exdates on a freshly created repeat todo
//   for (const ex of exdates ?? []) {
//     set.exdate(toZonedTime(ex, timeZone));
//   }

  return set;
}
