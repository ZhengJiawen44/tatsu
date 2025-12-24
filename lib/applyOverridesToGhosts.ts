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
): TodoItemType[] {
  // Flatten all stored instances for lookup
  const allInstances = recurringParents.flatMap((p) => p.instances);
  const instanceMap = new Map<string, overridingInstance>();
  allInstances.forEach((inst) => {
    instanceMap.set(inst.recurId + inst.todoId, inst);
  });

  return ghostTodos.flatMap((ghost) => {
    const override = instanceMap.get(ghost.dtstart.toISOString() + ghost.id);
    if (override) {
      if (override.completedAt) return [];
      return mergeInstanceAndTodo(override, ghost);
    }
    return ghost;
  });
}
