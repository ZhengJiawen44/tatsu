export function formatTime(hour: number, minute: number) {
  const period = hour >= 12 ? "PM" : "AM";
  const h = hour % 12 || 12; // 0 -> 12
  const m = String(minute).padStart(2, "0");

  return `${h}:${m} ${period}`;
}
