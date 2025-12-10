import { monthNames } from "./dateConstants";

export function getDisplayDate(createdAt: Date) {
  const today = new Date();
  const created = new Date(createdAt);

  // Normalize both to *local* midnight
  const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const createdMidnight = new Date(created.getFullYear(), created.getMonth(), created.getDate());

  // Difference in days (positive = future, negative = past)
  const diffInDays = Math.floor(
    (todayMidnight.getTime() - createdMidnight.getTime()) /
    (1000 * 60 * 60 * 24)
  );

  if (diffInDays === 0) return "today";
  if (diffInDays === 1) return "yesterday";
  if (diffInDays === 2) return "day before yesterday";

  if (today.getFullYear() === created.getFullYear()) {
    return `${String(created.getDate()).padStart(2, "0")} ${monthNames[created.getMonth()]}`;
  }

  return `${String(created.getDate()).padStart(2, "0")} ${monthNames[created.getMonth()]} ${created.getFullYear()}`;
}

