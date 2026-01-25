import { datetime } from "rrule";

/**
 * takes a local date and masquerades it as UTC with no offsets applied, just as RRule wants it
 * @param localDate a date object of your local environment
 * @returns a date object with the same date as your localDate dispalyed in UTC
 */
export function masqueradeAsUTC(localDate: Date) {
  return datetime(
    localDate.getFullYear(),
    localDate.getMonth() + 1,
    localDate.getDate(),
    localDate.getHours(),
    localDate.getMinutes(),
    localDate.getSeconds(),
  );
}
