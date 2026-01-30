import { addDays, addMonths, startOfDay } from "date-fns";
import { toZonedTime, fromZonedTime } from "date-fns-tz";
type RepeatInterval = "daily" | "weekly" | "monthly" | "weekdays" | null;

/**
 * Calculate the next date based on a repeat interval
 * @param startDate - The starting date of the todo
 * @param repeatInterval - The repeat interval
 * @returns Date object for the next occurrence
 */
export function getNextRepeatDate(
  startDate: Date,
  repeatInterval: RepeatInterval,
  timeZone?: string | null,
): Date | null {
  const nextDate = new Date(startDate);
  //today is the utc date of user's local today
  const today = getToday(timeZone);

  switch (repeatInterval) {
    case "daily":
      const dailyScheduledDate = addDays(nextDate, 1);
      //if the scheduled date is in the past, it needs to be readjusted to today
      if (dailyScheduledDate < today) {
        return today;
      }
      return dailyScheduledDate;

    case "weekly":
      let weeklyScheduledDate = addDays(nextDate, 7);
      if (weeklyScheduledDate < today) {
        // if today is the week day, schedule it to today
        if (weeklyScheduledDate.getDay() == today.getDay()) return today;
        //introducing loop here can cause infinte looping but this code is well tested
        while (weeklyScheduledDate < today) {
          weeklyScheduledDate = addDays(weeklyScheduledDate, 7);
        }
      }
      return weeklyScheduledDate;

    case "monthly":
      let monthlyScheduledDate = addMonths(nextDate, 1);
      if (monthlyScheduledDate < today) {
        //if today is the date, schedule it now
        if (monthlyScheduledDate.getDate() == today.getDate()) return today;
        while (monthlyScheduledDate < today) {
          monthlyScheduledDate = addMonths(monthlyScheduledDate, 1);
        }
      }
      return monthlyScheduledDate;

    case "weekdays":
      let scheduledWeekdayDate = getNextWeekdayDate(
        addDays(nextDate, 1),
        timeZone,
      );
      if (scheduledWeekdayDate < today) {
        scheduledWeekdayDate = getNextWeekdayDate(today, timeZone);
      }
      return scheduledWeekdayDate;

    default:
      return null;
  }
}

//accepts a date and skips saturday and sunday
function getNextWeekdayDate(date: Date, timeZone?: string | null) {
  const day = timeZone ? toZonedTime(date, timeZone).getDay() : date.getDay();

  let nextWeekdayDate = new Date(date);
  if (day == 6) {
    nextWeekdayDate = addDays(nextWeekdayDate, 2);
  } else if (day == 0) {
    nextWeekdayDate = addDays(nextWeekdayDate, 1);
  }
  return nextWeekdayDate;
}

//timeZone aware getToday
function getToday(timeZone?: string | null) {
  if (!timeZone) return startOfDay(new Date());

  // Get current time in user's timezone
  const nowInUserTZ = toZonedTime(new Date(), timeZone);
  // Get start of day in user's timezone
  const todayInUserTZ = startOfDay(nowInUserTZ);
  // Convert back to UTC
  return fromZonedTime(todayInUserTZ, timeZone);
}

/*
 *
 * import { addDays, addMonths, startOfDay } from "date-fns";

type RepeatInterval = "daily" | "weekly" | "monthly" | "weekdays" | null;

export function getNextRepeatDate(
  startDate: Date,
  repeatInterval: RepeatInterval,
  timeZone: String | null
): Date | null {
  const nextDate = new Date(startDate);
  const today = startOfDay(new Date());

  switch (repeatInterval) {
    case "daily":
      let dailyScheduledDate = addDays(nextDate, 1);
      //if the scheduled date is in the past, it needs to be readjusted to today
      if (dailyScheduledDate < today) {
        return today
      }
      return dailyScheduledDate;

    case "weekly":
      let weeklyScheduledDate = addDays(nextDate, 7);
      if (weeklyScheduledDate < today) {
        // if today is the week day, schedule it to today
        if (weeklyScheduledDate.getDay() == today.getDay()) return today;
        //introducing loop here can cause infinte looping but this code is well tested
        while (weeklyScheduledDate < today) {
          weeklyScheduledDate = addDays(weeklyScheduledDate, 7);
        }
      }
      return weeklyScheduledDate;


    case "monthly":
      let monthlyScheduledDate = addMonths(nextDate, 1);
      if (monthlyScheduledDate < today) {
        //if today is the date, schedule it now
        if (monthlyScheduledDate.getDate() == today.getDate()) return today;
        while (monthlyScheduledDate < today) {
          monthlyScheduledDate = addMonths(monthlyScheduledDate, 1);
        }
      }
      return monthlyScheduledDate;


    case "weekdays":
      let scheduledWeekdayDate = getNextWeekdayDate(nextDate);
      if (scheduledWeekdayDate < today) {
        scheduledWeekdayDate = getNextWeekdayDate(today);
      }
      return scheduledWeekdayDate;

    default:
      return null;
  }
}

function getNextWeekdayDate(date: Date) {
  const day = date.getDay();
  let nextWeekdayDate = addDays(date, 1);
  if (day == 5) {
    nextWeekdayDate = addDays(nextWeekdayDate, 2);
  }
  else if (day == 6) {
    nextWeekdayDate = addDays(nextWeekdayDate, 1);
  }
  return nextWeekdayDate;

}
*/
