import { TodoItemType } from "@/types";
import { Priority } from "@prisma/client";
import ICAL from "ical.js";
import { parseIcsToVeventComponent } from "./parseIcsToComponent";

export function parseIcsData(
  icsData: string,
):
  | (Omit<
      TodoItemType,
      | "id"
      | "pinned"
      | "createdAt"
      | "order"
      | "userID"
      | "completed"
      | "instances"
      | "instanceDate"
      | "projectID"
    > & { uid: string })
  | null {
  const jcalData = ICAL.parse(icsData);
  const comp = parseIcsToVeventComponent(jcalData);
  const vevent = comp.getFirstSubcomponent("vevent");
  if (!vevent) return null;
  // --- Core fields ---
  const summary = vevent.getFirstPropertyValue("summary") as string | null;
  const description = vevent.getFirstPropertyValue("description") as
    | string
    | null;
  const uid = vevent.getFirstPropertyValue("uid") as string;

  // --- Scheduling fields ---
  const dtstart = vevent.getFirstPropertyValue("dtstart") as ICAL.Time | null;

  const dtend = vevent.getFirstPropertyValue("dtend") as ICAL.Time | null;
  const duration = vevent.getFirstPropertyValue(
    "duration",
  ) as ICAL.Duration | null;
  const rrule = vevent.getFirstPropertyValue("rrule") as ICAL.Recur | null;

  // EXDATE can have multiple values
  const exdateProp = vevent.getAllProperties("exdate");
  const exdates = exdateProp.flatMap((p) =>
    p.getValues().map((v: ICAL.Time) => v.toJSDate()),
  );

  // Derive durationMinutes from either DURATION or DTSTART→DTEND diff
  let durationMinutes = 30;
  if (duration) {
    durationMinutes = duration.toSeconds() / 60;
  } else if (dtstart && dtend) {
    durationMinutes = (dtend.toUnixTime() - dtstart.toUnixTime()) / 60;
  }

  // --- Priority mapping ---
  // VEVENT priority: 1-4 = High, 5 = Medium, 6-9 = Low, 0 = undefined
  const rawPriority = vevent.getFirstPropertyValue("priority") as number | null;
  const priority: Priority =
    rawPriority === null || rawPriority === 0
      ? "Low"
      : rawPriority <= 4
        ? "High"
        : rawPriority === 5
          ? "Medium"
          : "Low";

  return {
    uid,
    title: summary || "undefined",
    description: description ?? null,
    dtstart: dtstart?.toJSDate() ?? undefined,
    due: dtend?.toJSDate() ?? undefined,
    durationMinutes: Math.round(durationMinutes),
    rrule: rrule ? rrule.toString() : null,
    exdates: exdates,
    timeZone: dtstart?.zone.tzid ?? "UTC",
    priority,
  };
}
