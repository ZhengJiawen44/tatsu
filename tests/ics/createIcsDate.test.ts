import { test, expect } from "@jest/globals";
import { updateVeventPropertyWithValue } from "@/lib/sync/updateVeventPropertyWithValue";
import { parseIcsToVeventComponent } from "@/lib/sync/parseIcsToComponent";
import ICAL from "ical.js";

const ICS_WITH_ALLDAY_VEVENT = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
PRODID:-//Apple Inc.//iPhone OS 26.5.2//EN
VERSION:2.0
BEGIN:VEVENT
CREATED:20260823T074330Z
DTEND;VALUE=DATE:20260803
DTSTAMP:20260823T074341Z
DTSTART;VALUE=DATE:20260802
LAST-MODIFIED:20260823T074330Z
RRULE:FREQ=WEEKLY
SEQUENCE:0
SUMMARY:Proper
UID:C09B943D-587C-4017-B3CF-913620DA97BA
URL;VALUE=URI:
X-APPLE-CREATOR-IDENTITY:com.apple.mobilecal
X-APPLE-CREATOR-TEAM-IDENTITY:0000000000
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
CREATED:20260823T074340Z
DTEND;VALUE=DATE:20260809
DTSTAMP:20260823T074341Z
DTSTART;VALUE=DATE:20260808
LAST-MODIFIED:20260823T074340Z
RECURRENCE-ID;VALUE=DATE:20260809
SEQUENCE:0
SUMMARY:Proper
UID:C09B943D-587C-4017-B3CF-913620DA97BA
URL;VALUE=URI:
X-APPLE-CREATOR-IDENTITY:com.apple.mobilecal
X-APPLE-CREATOR-TEAM-IDENTITY:0000000000
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:NONE
TRIGGER;VALUE=DATE-TIME:19760401T005545Z
END:VALARM
END:VEVENT
END:VCALENDAR`;

const ICS_WITH_TIMED_VEVENT = `BEGIN:VCALENDAR
CALSCALE:GREGORIAN
PRODID:-//Apple Inc.//iPhone OS 26.5.2//EN
VERSION:2.0
BEGIN:VEVENT
CREATED:20260823T115555Z
DTEND;TZID=Asia/Shanghai:20260802T210000
DTSTAMP:20260823T115614Z
DTSTART;TZID=Asia/Shanghai:20260802T200000
LAST-MODIFIED:20260823T115555Z
RRULE:FREQ=WEEKLY
SEQUENCE:0
SUMMARY:More 
UID:2CB87980-6C70-4AC8-8419-39FB3BC7EAB5
URL;VALUE=URI:
X-APPLE-CREATOR-IDENTITY:com.apple.mobilecal
X-APPLE-CREATOR-TEAM-IDENTITY:0000000000
TRANSP:OPAQUE
END:VEVENT
BEGIN:VEVENT
CREATED:20260823T115613Z
DTEND;TZID=Asia/Shanghai:20260808T210000
DTSTAMP:20260823T115614Z
DTSTART;TZID=Asia/Shanghai:20260808T200000
LAST-MODIFIED:20260823T115613Z
RECURRENCE-ID;TZID=Asia/Shanghai:20260809T200000
SEQUENCE:0
SUMMARY:More 
UID:2CB87980-6C70-4AC8-8419-39FB3BC7EAB5
URL;VALUE=URI:
X-APPLE-CREATOR-IDENTITY:com.apple.mobilecal
X-APPLE-CREATOR-TEAM-IDENTITY:0000000000
TRANSP:OPAQUE
BEGIN:VALARM
ACTION:NONE
TRIGGER;VALUE=DATE-TIME:19760401T005545Z
END:VALARM
END:VEVENT
BEGIN:VTIMEZONE
TZID:Asia/Shanghai
X-LIC-LOCATION:Asia/Shanghai
BEGIN:STANDARD
DTSTART:19010101T000000
RDATE:19010101T000000
TZNAME:CST
TZOFFSETFROM:+080543
TZOFFSETTO:+0800
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19400601T000000
RDATE:19400601T000000
RDATE:19410315T000000
RDATE:19420131T000000
RDATE:19460515T000000
RDATE:19470415T000000
RDATE:19860504T020000
TZNAME:CDT
TZOFFSETFROM:+0800
TZOFFSETTO:+0900
END:DAYLIGHT
BEGIN:STANDARD
DTSTART:19401012T235959
RDATE:19401012T235959
RDATE:19411101T235959
RDATE:19450901T235959
RDATE:19460930T235959
RDATE:19471031T235959
RDATE:19480930T235959
RDATE:19490528T000000
TZNAME:CST
TZOFFSETFROM:+0900
TZOFFSETTO:+0800
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19480501T000000
RRULE:FREQ=YEARLY;UNTIL=19490430T160000Z;BYMONTH=5
TZNAME:CDT
TZOFFSETFROM:+0800
TZOFFSETTO:+0900
END:DAYLIGHT
BEGIN:STANDARD
DTSTART:19860914T020000
RRULE:FREQ=YEARLY;UNTIL=19910914T170000Z;BYMONTH=9;BYMONTHDAY=11,12,13,14
 ,15,16,17;BYDAY=SU
TZNAME:CST
TZOFFSETFROM:+0900
TZOFFSETTO:+0800
END:STANDARD
BEGIN:DAYLIGHT
DTSTART:19870412T020000
RRULE:FREQ=YEARLY;UNTIL=19910413T180000Z;BYMONTH=4;BYMONTHDAY=11,12,13,14
 ,15,16,17;BYDAY=SU
TZNAME:CDT
TZOFFSETFROM:+0800
TZOFFSETTO:+0900
END:DAYLIGHT
END:VTIMEZONE
END:VCALENDAR`;

// master dtstart is DTSTART;VALUE=DATE:20260802
test("all day events recieve correct dtstarts ", () => {
  const component = parseIcsToVeventComponent(ICS_WITH_ALLDAY_VEVENT);
  const allVevents = component.getAllSubcomponents("vevent");
  const master = allVevents.find((v) => !v.getFirstProperty("recurrence-id"));

  expect(master).toBeDefined();

  const newDtstart = new Date("2026-10-11T16:00:00.000Z");

  updateVeventPropertyWithValue(
    "dtstart",
    master!,
    newDtstart,
    "Asia/Shanghai",
  );
  const dtstartProp = master?.getFirstProperty("dtstart");
  const updatedDtstart = dtstartProp?.getFirstValue() as ICAL.Time;
  const type = dtstartProp?.type;
  //expect the new dtstart to be a floating time with value = date, just like master
  expect(updatedDtstart.toString()).toEqual("2026-10-12");
  expect(type).toEqual("date");
});

// master dtstart is DTSTART;TZID=Asia/Shanghai:20260802T200000
test("Timed events recieve correct dtstarts when tzid is provided", () => {
  const component = parseIcsToVeventComponent(ICS_WITH_TIMED_VEVENT);
  const allVevents = component.getAllSubcomponents("vevent");
  const master = allVevents.find((v) => !v.getFirstProperty("recurrence-id"));

  expect(master).toBeDefined();

  const newDtstart = new Date("2026-08-24T12:00:00.000Z");

  // dont pass tzid to test if it can correctly find tzid from the event
  updateVeventPropertyWithValue(
    "dtstart",
    master!,
    newDtstart,
    "Asia/Shanghai",
  );

  const dtstartProp = master?.getFirstProperty("dtstart");
  const updatedDtstart = dtstartProp?.getFirstValue() as ICAL.Time;
  const tzid = dtstartProp?.getParameter("tzid");

  //expect the new dtstart to be a local time with parameter = tzid, just like master
  expect(updatedDtstart.toString()).toEqual("2026-08-24T20:00:00");
  expect(tzid).toEqual("Asia/Shanghai");
});

// master dtstart is DTSTART;TZID=Asia/Shanghai:20260802T200000
test("Timed events recieve correct dtstarts when no tzid is provided", () => {
  const component = parseIcsToVeventComponent(ICS_WITH_TIMED_VEVENT);
  const allVevents = component.getAllSubcomponents("vevent");
  const master = allVevents.find((v) => !v.getFirstProperty("recurrence-id"));

  expect(master).toBeDefined();

  const newDtstart = new Date("2026-08-24T12:00:00.000Z");

  // dont pass tzid to test if it can correctly find tzid from the event
  updateVeventPropertyWithValue("dtstart", master!, newDtstart);

  const dtstartProp = master?.getFirstProperty("dtstart");
  const updatedDtstart = dtstartProp?.getFirstValue() as ICAL.Time;
  const tzid = dtstartProp?.getParameter("tzid");

  //expect the new dtstart to be a local time with parameter = tzid, just like master
  expect(updatedDtstart.toString()).toEqual("2026-08-24T20:00:00");
  expect(tzid).toEqual("Asia/Shanghai");
});
