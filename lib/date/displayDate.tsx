import { monthNames } from "./dateConstants";
export function getDisplayDate(createdAt: Date) {
  const today = new Date();
  const createdDate = new Date(createdAt);

  // Normalize dates to remove time component
  const todayMidnight = getNormalizedDate(today);
  const createdMidnight = getNormalizedDate(createdDate);

  // Calculate the difference in days
  const diffInTime = todayMidnight.getTime() - createdMidnight.getTime();
  const diffInDays = diffInTime / (1000 * 60 * 60 * 24);

  if (diffInDays === 0) {
    return "today";
  } else if (diffInDays === 1) {
    return "yesterday";
  } else if (diffInDays === 2) {
    return "day before yesterday";
  } else if (today.getFullYear() === createdDate.getFullYear()) {
    return `${String(createdDate.getDate()).padStart(2, "0")} ${String(
      monthNames[createdDate.getMonth()]
    ).padStart(2, "0")}`;
  } else {
    return `${String(createdDate.getDate()).padStart(2, "0")} ${String(
      monthNames[createdDate.getMonth()]
    ).padStart(2, "0")} ${createdDate.getFullYear()}`;
  }
}

export function getNormalizedDate(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}
