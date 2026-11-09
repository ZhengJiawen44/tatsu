/**
 * Duration in minutes from durationMinutes, or due − dtstart.
 */
export function getTodoDurationMinutes(todo: {
  durationMinutes: number | null;
  due: Date | null | undefined;
  dtstart: Date | null | undefined;
}): number {
  if (todo.durationMinutes) return todo.durationMinutes;
  if (todo.due && todo.dtstart)
    return (todo.due.getTime() - todo.dtstart.getTime()) / (1000 * 60);
  throw new Error("todo duration could not be calculated.");
}
