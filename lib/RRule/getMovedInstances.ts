import { recurringTodoItemType } from "@/types";
import { mergeInstanceAndTodo } from "./mergeInstanceAndTodo";

// /**
//  * @description generate "orphaned todos" by finding instances that had their dtstart overriden to another time
//  * @param mergedTodos a list of todos that are used to check for duplicates
//  * @param recurringParents a list of todos that has all the instances
//  * @param bounds a { dateRangeStart: Date; dateRangeEnd: Date } object
//  * @returns a list of orphaned todos

export function getMovedInstances(
  mergedTodos: recurringTodoItemType[],
  recurringParents: recurringTodoItemType[],
  bounds: { dateRangeStart: Date; dateRangeEnd: Date },
): recurringTodoItemType[] {
  const mergedDtstarts = mergedTodos.map(
    (merged) => merged.dtstart.getTime() + " " + merged.instanceDate?.getTime(),
  );
  const orphanedInstances = recurringParents.flatMap(
    (todo: recurringTodoItemType) => {
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
            //if overriddenDue exists it must not be overdue
            (!overriddenDue || overriddenDue >= bounds.dateRangeStart) &&
            overriddenDtstart <= bounds.dateRangeEnd &&
            !mergedDtstarts.includes(
              overriddenDtstart.getTime() + " " + instanceDate.getTime(),
            )
          );
        },
      );
    },
  );

  //flesh out override instances into todos
  const orphanedTodos = orphanedInstances.flatMap((instance) => {
    const parentTodo = recurringParents.find(
      (parent) => parent.id === instance.todoId,
    );
    if (parentTodo) return mergeInstanceAndTodo(instance, parentTodo);
    return [];
  });
  return orphanedTodos;
}
