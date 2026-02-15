import { overridingInstance, recurringTodoItemType } from "@/types";
import { mergeInstanceAndTodo } from "./mergeInstanceAndTodo";

/**
 * overrides todos using instance's reccurence ID as the key, intended to take effect on todos where the overriden dtstart
 * clash with its next natural occurence
 * @param ghostTodos a list of generated "ghost" todos from the function generateTodosFromRRule
 * @returns the same ghost todos but some are overriden by todo Instances table
 */
export function mergeWithOverrideInstances(
  ghostTodos: recurringTodoItemType[],
): recurringTodoItemType[] {
  return ghostTodos.map((ghost) => {
    if (!ghost.instances) return ghost;
    const overrideMap = constructOverrideMap(ghost.instances);
    const todoInstance = overrideMap.get(
      ghost.dtstart.toISOString() + ghost.id,
    );
    if (!todoInstance) return ghost;
    return mergeInstanceAndTodo(todoInstance, ghost);
  });
}
function constructOverrideMap(overrides: overridingInstance[]) {
  const map = new Map();
  for (const instance of overrides) {
    map.set(instance.recurId + instance.todoId, instance);
  }
  return map;
}
