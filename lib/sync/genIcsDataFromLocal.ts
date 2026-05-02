import ICAL from "ical.js";

interface createICSDataProps {
  summary: string;
  description?: string;
  start: Date;
  end: Date;
  rrule: string | null;
}
export function genICSData({
  summary,
  description,
  start,
  end,
  rrule,
}: createICSDataProps) {
  const cal = new ICAL.Component(["vcalendar", [], []]);
  cal.updatePropertyWithValue("prodid", "-//Tatsu//EN");
  cal.updatePropertyWithValue("version", "2.0");
  cal.updatePropertyWithValue("calscale", "GREGORIAN");
  const event = new ICAL.Component("vevent");
  event.updatePropertyWithValue(
    "dtstamp",
    ICAL.Time.fromJSDate(new Date(), true),
  );
  event.updatePropertyWithValue("uid", crypto.randomUUID());
  event.updatePropertyWithValue("summary", summary);
  if (description) {
    event.updatePropertyWithValue("description", description);
  }
  if (start) {
    event.updatePropertyWithValue(
      "dtstart",
      ICAL.Time.fromJSDate(start, false),
    );
  }
  if (end) {
    event.updatePropertyWithValue("dtend", ICAL.Time.fromJSDate(end, false));
  }
  if (rrule) {
    const rruleProp = new ICAL.Property("rrule", event);
    rruleProp.setValue(ICAL.Recur.fromString(rrule));
    event.addProperty(rruleProp);
  }

  cal.addSubcomponent(event);
  return cal.toString();
}
