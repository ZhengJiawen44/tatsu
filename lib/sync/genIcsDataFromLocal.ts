import ICAL from "ical.js";

interface createICSDataProps {
  summary: string | undefined;
  description?: string | undefined;
  start: Date | undefined;
  end: Date | undefined;
  rrule?: string | null | undefined;
  recurrenceID?: string;
}
export function genICSData({
  summary,
  description,
  start,
  end,
  rrule,
  recurrenceID,
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
  if (summary) event.updatePropertyWithValue("summary", summary);
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
  // if(recurrenceID)event.updatePropertyWithValue("reccurenceID", )

  cal.addSubcomponent(event);
  return cal.toString();
}
