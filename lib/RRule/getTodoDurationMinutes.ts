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

/**
 * Inclusive end of an occurrence. durationMinutes is minute-granular but date picker only goes to hh:mm
 * example durationMinutes is 15:59:59.999, but date picker only goes to hh:mm, so we need to round up to the next hour.
 */
export function getOccurrenceEndMs(
  start: Date,
  durationMinutes: number,
): number {
  const endMs = start.getTime() + durationMinutes * 60 * 1000;
  return Math.floor(endMs / 60_000) * 60_000 + 59_999;
}
