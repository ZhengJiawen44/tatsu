import {
  overridingInstance,
  recurringTodoWithInstance,
  TodoItemType,
} from "@/types";
import { mergeInstanceAndTodo } from "./mergeInstanceAndTodo";

/**
 * overrides ghost todos that were generated and subsequently edited by the user
 * @param ghostTodos a list of generated "ghost" todos from the function generateTodosFromRRule
 * @param recurringParents a list of todos retrieved from the db with an additional "instance" field
 * @returns the same ghost todos but some are overriden by todo Instances table
 */
export function applyOverridesToGhosts(
  ghostTodos: TodoItemType[],
  recurringParents: recurringTodoWithInstance[],
  IndependentOverrides: overridingInstance[],
): TodoItemType[] {
  if (!ghostTodos.length) return [];

  const mapByRendered = new Map<string, overridingInstance>();
  const mapByRecurrence = new Map<string, overridingInstance>();

  // Populate mapByRendered from IndependentOverrides
  for (const inst of IndependentOverrides) {
    if (!inst.overriddenDtstart) continue;
    const key = `${inst.overriddenDtstart.getTime()}:${inst.todoId}`;
    mapByRendered.set(key, inst);
  }
  // Populate mapByRecurrence from allInstances
  const allInstances = recurringParents.flatMap((p) => p.instances ?? []);
  for (const inst of allInstances) {
    if (!inst.recurId || !inst.todoId) continue;
    const key = `${inst.recurId}:${inst.todoId}`;
    // If there are duplicates, prefer the one that exists in mapByRendered already,
    if (!mapByRecurrence.has(key)) mapByRecurrence.set(key, inst);
  }

  //Merge rendered match first, then recurrence match
  return ghostTodos.flatMap((ghostTodo) => {
    const renderedKey = `${ghostTodo.dtstart.getTime()}:${ghostTodo.id}`;
    const instByRendered = mapByRendered.get(renderedKey);
    if (instByRendered) {
      if (instByRendered.completedAt) return [];
      return mergeInstanceAndTodo(instByRendered, ghostTodo);
    }

    // Fallback: match instance whose recurrenceId corresponds to this generated occurrence
    const recurrenceKey = `${ghostTodo.dtstart.toISOString()}:${ghostTodo.id}`;
    const instByRecurrence = mapByRecurrence.get(recurrenceKey);
    if (instByRecurrence) {
      if (instByRecurrence.completedAt) return [];
      // If the override was moved to a different dtstart (i.e. instByRecurrence.overriddenDtstart != ghostTodo.dtstart),
      // we still want to render the moved instance elsewhere; but since this branch is only reached when there's no
      // mapByRendered match, it means the moved instance isn't in the day's range, so we should NOT render it here.
      // Here we only merge when the instance *doesn't* have an overriddenDtstart different from the generated slot.
      //safety guard for instance was moved away (EXDATE already removed the original)

      if (
        instByRecurrence.overriddenDtstart &&
        instByRecurrence.overriddenDtstart.getTime() !==
          ghostTodo.dtstart.getTime()
      ) {
        return [];
      }
      return mergeInstanceAndTodo(instByRecurrence, ghostTodo);
    }

    return ghostTodo;
  });
}
