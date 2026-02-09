import resolveTimezone from "./resolveTimezone";

export function formatDateInTZ(tz?: string) {
  const timezone = resolveTimezone(tz);
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "short",
    day: "2-digit",
  }).format(new Date());
}
