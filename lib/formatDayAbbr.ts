export function formatDayAbbr(date: Date): string {
  return new Intl.DateTimeFormat("en", { weekday: "short" }).format(date);
}
