import { TodoItemType, overridingInstance } from "@/types";
import { mergeInstanceAndTodo } from "./mergeInstanceAndTodo";

/**
 * overrides todos using instance's reccurence ID as the key, intended to take effect on todos where the overriden dtstart
 * clash with its next natural occurence
 * @param ghostTodos a list of generated "ghost" todos from the function generateTodosFromRRule
 * @returns the same ghost todos but some are overriden by todo Instances table
 */
export function overrideBy(
  ghostTodos: TodoItemType[],
  keyFn: (instance: overridingInstance) => string | undefined,
): TodoItemType[] {
  return ghostTodos.map((ghost) => {
    if (!ghost.instances) return ghost;
    const overrideMap = constructOverrideMap(ghost.instances, keyFn);
    const todoInstance = overrideMap.get(
      ghost.dtstart.toISOString() + ghost.id,
    );
    if (!todoInstance) return ghost;
    return mergeInstanceAndTodo(todoInstance, ghost);
  });
}
function constructOverrideMap(
  overrides: overridingInstance[],
  keyFn: (instance: overridingInstance) => string | undefined,
) {
  const map = new Map();
  for (const instance of overrides) {
    const key = keyFn(instance);
    if (key) {
      map.set(key + instance.todoId, instance);
    }
  }
  return map;
}
