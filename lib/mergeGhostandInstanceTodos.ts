import { TodoItemType, overridingInstance } from "@/types";

export function mergeGhostandInstanceTodos(
  ghostTodos: TodoItemType[],
  overridingInstances: overridingInstance[],
) {
  const merged = structuredClone(ghostTodos);
  overridingInstances.forEach((instance) => {
    const generatedInstance = merged.find(
      ({ dtstart }) => dtstart.toISOString() === instance.recurId,
    );
    if (!generatedInstance) return;
    generatedInstance.completed = instance.completedAt ? true : false;

    if (instance.overriddenTitle)
      generatedInstance.title = instance.overriddenTitle;
    if (instance.overriddenDescription)
      generatedInstance.description = instance.overriddenDescription;
    if (instance.overriddenDtstart)
      generatedInstance.dtstart = instance.overriddenDtstart;
    if (instance.overriddenDurationMinutes)
      generatedInstance.durationMinutes = instance.overriddenDurationMinutes;
  });
  return merged;
}
