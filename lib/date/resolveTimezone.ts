function isValidTimeZone(tz: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

export default function resolveTimezone(timezone?: string): string {
  if (!timezone || !isValidTimeZone(timezone))
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  return timezone;
}
