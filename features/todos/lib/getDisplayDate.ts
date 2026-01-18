import {
  format,
  isToday,
  isTomorrow,
  isYesterday,
  isThisWeek,
  startOfWeek,
  addWeeks,
  differenceInDays,
  isSameWeek,
} from "date-fns";

export function getDisplayDate(date: Date) {
  const now = new Date();

  // Handle today, tomorrow, yesterday
  if (isToday(date)) return "Today";
  if (isTomorrow(date)) return "Tomorrow";
  if (isYesterday(date)) return "Yesterday";

  // Handle this week (show day name)
  if (isThisWeek(date, { weekStartsOn: 0 })) {
    return format(date, "EEEE"); // "Monday", "Tuesday", etc.
  }

  // Handle next week (manually check if date is in next week)
  const nextWeekStart = addWeeks(startOfWeek(now, { weekStartsOn: 0 }), 1);
  if (isSameWeek(date, nextWeekStart, { weekStartsOn: 0 })) {
    return `Next ${format(date, "EEEE")}`;
  }

  // Handle dates within the next 7-14 days
  const daysDiff = differenceInDays(date, now);
  if (daysDiff > 0 && daysDiff <= 14) {
    return format(date, "EEEE, MMM dd");
  }

  // Default: show date with or without year
  return date.getFullYear() === now.getFullYear()
    ? format(date, "MMM dd")
    : format(date, "MMM dd, yyyy");
}
