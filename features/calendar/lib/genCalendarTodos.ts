import { masqueradeAsUTC } from "@/features/todos/lib/masqueradeAsUTC";
import { rruleDateToLocal } from "@/features/todos/lib/rruleDateToLocal";
import { mergeInstanceAndTodo } from "@/lib/mergeInstanceAndTodo";
import { CalendarTodoItemType } from "@/types";
import { addMinutes } from "date-fns";
import { RRule } from "rrule";

/**
 * @description if its normal todo, return it else if its a recurring todo,
     1. make a rrule object out of its rrule string
     2. generate all its occurence dates for the given date range function parameter
     3. for each occurence date:
         if(occurence date is overridden) return the overriding instance
         else generate a "ghost" todo
 * @param calendarTodos 
 * @param calendarRange 
 * @returns 
 */
export function genCalendarTodos(
  calendarTodos: CalendarTodoItemType[],
  calendarRange: { start: Date; end: Date },
): CalendarTodoItemType[] {
  return calendarTodos.flatMap((todo) => {
    //if its normal todo, return it
    if (!todo.rrule) return todo;
    //else... (see description above)
    const rruleObj = new RRule({
      ...RRule.parseString(todo.rrule),
      dtstart: masqueradeAsUTC(todo.dtstart),
    });
    const durationMs = todo.due.getTime() - todo.dtstart.getTime();
    const durationMinutes = durationMs / 60000;
    const searchStart = new Date(calendarRange.start.getTime() - durationMs);
    const occurences = rruleObj.between(
      masqueradeAsUTC(searchStart),
      masqueradeAsUTC(calendarRange.end),
      true,
    );

    const genTodos = occurences.flatMap((occ) => {
      const instanceDue = addMinutes(occ, durationMinutes);
      // If the instance ended before today started, don't include it.
      if (instanceDue <= calendarRange.start) {
        return [];
      }
      const generatedTodo = genTodo(occ, todo);
      return generatedTodo;
    });
    return genTodos;
  });
}

//generate a todo or override with instance
function genTodo(occurence: Date, todo: CalendarTodoItemType) {
  occurence = rruleDateToLocal(occurence);

  const overridingInstance = todo.instances.find(
    ({ instanceDate }) =>
      instanceDate.toISOString() === occurence.toISOString(),
  );

  if (overridingInstance) {
    const overridenTodo = mergeInstanceAndTodo(overridingInstance, todo);
    return {
      ...overridenTodo,
      id: makeInstanceId(todo.id, todo.dtstart),
      parentId: todo.id,
      instances: todo.instances,
    };
  } else {
    const duration = todo.due.getTime() - todo.dtstart.getTime();
    return {
      ...todo,
      id: makeInstanceId(todo.id, todo.dtstart),
      parentId: todo.id,
      dtstart: occurence,
      due: new Date(occurence.getTime() + duration),
    };
  }
}
function makeInstanceId(todoId: string, date: Date) {
  return `${todoId}:${date.toISOString()}`;
}
