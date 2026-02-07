import { TodoItemType } from "@/types";
import { mergeInstanceAndTodo } from "./mergeInstanceAndTodo";

// /**
//  * @description generate "orphaned todos" by finding instances that had their dtstart overriden to another time
//  * @param mergedTodos a list of todos that are used to check for duplicates
//  * @param recurringParents a list of todos that has all the instances
//  * @param bounds a { dateRangeStart: Date; dateRangeEnd: Date } object
//  * @returns a list of orphaned todos

export function getMovedInstances(
  mergedTodos: TodoItemType[],
  recurringParents: TodoItemType[],
  bounds: { dateRangeStart: Date; dateRangeEnd: Date },
): TodoItemType[] {
  const mergedDtstarts = mergedTodos.map(
    (merged) => merged.dtstart.getTime() + " " + merged.instanceDate?.getTime(),
  );
  const orphanedInstances = recurringParents.flatMap((todo: TodoItemType) => {
    if (!todo.instances) return [];

    return todo.instances.filter(
      ({ overriddenDtstart, overriddenDue, instanceDate }) => {
        const exDateList = todo.exdates.map((exdate) => {
          return exdate.getTime();
        });
        return (
          overriddenDtstart &&
          overriddenDue &&
          !exDateList.includes(instanceDate.getTime()) &&
          //need to have started and crosses in to the current range
          overriddenDtstart <= bounds.dateRangeEnd &&
          overriddenDue >= bounds.dateRangeStart &&
          !mergedDtstarts.includes(
            overriddenDtstart.getTime() + " " + instanceDate.getTime(),
          )
        );
      },
    );
  });

  const orphanedTodos = orphanedInstances.flatMap((instance) => {
    const parentTodo = recurringParents.find(
      (parent) => parent.id === instance.todoId,
    );
    if (parentTodo) return mergeInstanceAndTodo(instance, parentTodo);
    return [];
  });
  return orphanedTodos;
}
