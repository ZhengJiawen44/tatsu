import { toZonedTime, fromZonedTime } from "date-fns-tz";
import { startOfDay, endOfDay } from "date-fns";

/**
 * returns user's local start and end of day in utc
 * @param timeZone string timezone in IANA format
 * @returns \{todayStartUTC, todayEndUTC} user's start and end of day, in UTC time zone
 */
export default function getTodayBoundaries(timeZone: string) {
  const nowUTC = new Date();
  const nowLocal = toZonedTime(nowUTC, timeZone);
  const todayStartLocal = startOfDay(nowLocal);
  const todayEndLocal = endOfDay(nowLocal);
  const todayStartUTC = fromZonedTime(todayStartLocal, timeZone);
  const todayEndUTC = fromZonedTime(todayEndLocal, timeZone);
  return { todayStartUTC, todayEndUTC };
}
