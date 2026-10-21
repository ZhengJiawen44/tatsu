import { test, expect } from "@jest/globals";
import { updateVeventPropertyWithValue } from "@/lib/sync/updateVeventPropertyWithValue";
import { parseIcsToVeventComponent } from "@/lib/sync/parseIcsToComponent";
import ICAL from "ical.js";

// 2026-10-21T04:00:00.000Z is 2026-10-21 12:00 in Asia/Shanghai.
const FOUR_FORM_INSTANT = new Date("2026-10-21T04:00:00.000Z");

function shapeMasterDtstart(dtstartLine: string) {
  const ics = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Tatsu//EN
BEGIN:VEVENT
UID:four-date-forms
DTSTAMP:20261020T000000Z
${dtstartLine}
SUMMARY:four forms
END:VEVENT
END:VCALENDAR`;
  const master = parseIcsToVeventComponent(ics).getFirstSubcomponent("vevent");
  if (!master) throw new Error("master vevent missing");
  updateVeventPropertyWithValue(
    "dtstart",
    master,
    FOUR_FORM_INSTANT,
    "Asia/Shanghai",
  );
  const prop = master.getFirstProperty("dtstart");
  if (!prop) throw new Error("dtstart missing");
  return prop;
}

test("all-day master stays a DATE", () => {
  const prop = shapeMasterDtstart("DTSTART;VALUE=DATE:20261020");
  const value = prop.getFirstValue() as ICAL.Time;

  expect(prop.type).toBe("date");
  expect(prop.getParameter("tzid")).toBeUndefined();
  expect(value.toString()).toBe("2026-10-21");
});

test("UTC master stays UTC", () => {
  const prop = shapeMasterDtstart("DTSTART:20261020T160000Z");
  const value = prop.getFirstValue() as ICAL.Time;

  expect(prop.type).toBe("date-time");
  expect(prop.getParameter("tzid")).toBeUndefined();
  expect(value.zone.tzid).toBe("UTC");
  expect(value.toString()).toBe("2026-10-21T04:00:00Z");
});

test("TZID master stays local time with that TZID", () => {
  const prop = shapeMasterDtstart("DTSTART;TZID=Asia/Shanghai:20261012T130000");
  const value = prop.getFirstValue() as ICAL.Time;

  expect(prop.type).toBe("date-time");
  expect(prop.getParameter("tzid")).toBe("Asia/Shanghai");
  expect(value.toString()).toBe("2026-10-21T12:00:00");
});

test("floating master stays floating", () => {
  const prop = shapeMasterDtstart("DTSTART:20261020T160000");
  const value = prop.getFirstValue() as ICAL.Time;

  expect(prop.type).toBe("date-time");
  expect(prop.getParameter("tzid")).toBeUndefined();
  expect(value.zone.tzid).toBe("floating");
  expect(value.toString()).toBe("2026-10-21T12:00:00");
});
