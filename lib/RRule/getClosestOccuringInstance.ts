import { overridingInstance, recurringTodoItemType } from "@/types";
import { genRuleSet } from "./generateTodosFromRRule";
import { getTodoDurationMinutes } from "./getTodoDurationMinutes";

export function getClosestOccuringInstance(
  todo: recurringTodoItemType,
  todoInstances: overridingInstance[],
  timeZone: string,
  dateRangeEnd: Date,
  includePast?: boolean,
) {
  const calculatedDuration = getTodoDurationMinutes(todo);

  const ruleSet = genRuleSet(todo.rrule, todo.dtstart, timeZone, todo.exdates);
  const occurrences = ruleSet
    .between(
      todo.dtstart,
      new Date(dateRangeEnd.getTime() + 60 * 24 * 60 * 60 * 1000), //expand the window to one year, since rrule could be yearly at max, and we want to capture atleast one upcoming instance if exists
      true,
    )
    .sort((a, b) => a.getTime() - b.getTime());

  // we remove the completed instances whose dates are in the occurrence sequence
  removeCompletedInstanceDates(todoInstances, occurrences);

  // if there is an upcoming
  if (occurrences[occurrences.length - 1].getTime() >= dateRangeEnd.getTime()) {
    //since occurrences is sorted, we just need to find the first date that is upcoming (closest upcoming relative to dateRangeEnd)
    return occurrences.find(
      (occurringDate) =>
        occurringDate.getTime() + calculatedDuration * 60 * 1000 >=
        dateRangeEnd.getTime(),
    );
  }
  // if no upcoming and includePast is set, we simply return the most recent occurence at the end of the occurrence sequence
  else if (includePast) {
    return occurrences[occurrences.length - 1];
  }
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
