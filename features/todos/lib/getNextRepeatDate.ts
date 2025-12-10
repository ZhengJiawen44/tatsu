import { addDays, addMonths } from "date-fns";

type RepeatInterval = "daily" | "weekly" | "monthly" | "weekdays" | null;

/**
 * Calculate the next date based on a repeat interval
 * @param startDate - The starting date of the todo
 * @param repeatInterval - The repeat interval
 * @returns Date object for the next occurrence
 */
export function getNextRepeatDate(
  startDate: Date,
  repeatInterval: RepeatInterval
): Date | null {
  const nextDate = new Date(startDate);

  switch (repeatInterval) {
    case "daily":
      return addDays(nextDate, 1);

    case "weekly":
      return addDays(nextDate, 7);

    case "monthly":
      return addMonths(nextDate, 1);

    case "weekdays":
      const day = nextDate.getDay();
      if (day === 5) return addDays(nextDate, 3); // Friday -> Monday
      if (day === 6) return addDays(nextDate, 2); // Saturday -> Monday
      return addDays(nextDate, 1); // Other days -> next day

    default:
      return null;
  }
}

