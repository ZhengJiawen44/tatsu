import { overridingInstance, recurringTodoItemType } from "@/types";
import { genRuleSet } from "./generateTodosFromRRule";
import {
  getOccurrenceEndMs,
  getTodoDurationMinutes,
} from "./getTodoDurationMinutes";

/**
 * Closest incomplete occurrence whose inclusive end is already before dateRangeEnd.
 */
export function getClosestOverdueOccuringInstance(
  todo: recurringTodoItemType,
  todoInstances: overridingInstance[],
  timeZone: string,
  dateRangeEnd: Date,
) {
  const calculatedDuration = getTodoDurationMinutes(todo);

  const ruleSet = genRuleSet(todo.rrule, todo.dtstart, timeZone, todo.exdates);
  const occurrences = ruleSet
    .between(todo.dtstart, dateRangeEnd, true)
    .sort((a, b) => b.getTime() - a.getTime());

  removeCompletedInstanceDates(todoInstances, occurrences);

  if (occurrences.length === 0) return;

  // reverse-sorted incomplete dates: first whose inclusive duration has fully elapsed
  return occurrences.find(
    (occurringDate) =>
      getOccurrenceEndMs(occurringDate, calculatedDuration) <
      dateRangeEnd.getTime(),
  );
}

/**
 * @description removes inplace the dates where a todo instance has already been completed
 */
function removeCompletedInstanceDates(
  todoInstances: overridingInstance[],
  occurrences: Date[],
) {
  todoInstances.forEach((instance) => {
    if (!instance.completedAt) return;
    const index = occurrences.findIndex(
      (occurringDate) =>
        occurringDate.getTime() === instance.instanceDate.getTime(),
    );
    if (index !== -1) occurrences.splice(index, 1);
  });
}
