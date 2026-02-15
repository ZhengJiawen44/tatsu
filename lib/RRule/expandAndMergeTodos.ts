import { recurringTodoItemType } from "@/types";
import generateTodosFromRRule from "./generateTodosFromRRule";
import { getMovedInstances } from "./getMovedInstances";
import { mergeWithOverrideInstances } from "./mergeWithOverrideInstances";

export default function expandAndMergeTodos(
  recurringTodos: recurringTodoItemType[],
  timeZone: string,
  dateRangeStart: Date,
  dateRangeEnd: Date,
) {
  // Expand RRULEs to generate occurrences
  const ghostTodos = generateTodosFromRRule(recurringTodos, timeZone, {
    dateRangeStart,
    dateRangeEnd,
  });

  // Apply overrides
  const mergedGhostTodos = mergeWithOverrideInstances(ghostTodos);

  // Find out of range overrides
  const movedTodos = getMovedInstances(mergedGhostTodos, recurringTodos, {
    dateRangeStart,
    dateRangeEnd,
  });

  return [...mergedGhostTodos, ...movedTodos];
}
