import ICAL from "ical.js";

interface createICSDataProps {
  summary: string;
  description?: string;
  start: Date | undefined;
  end: Date | undefined;
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
  //   cal.updatePropertyWithValue("method", "REQUEST");
  const todo = new ICAL.Component("vtodo");
  todo.updatePropertyWithValue(
    "dtstamp",
    ICAL.Time.fromJSDate(new Date(), false),
  );
  todo.updatePropertyWithValue("status", "NEEDS-ACTION");
  todo.updatePropertyWithValue("uid", crypto.randomUUID());
  todo.updatePropertyWithValue("summary", summary);
  if (description) {
    todo.updatePropertyWithValue("description", description);
  }
  if (start) {
    todo.updatePropertyWithValue("dtstart", ICAL.Time.fromJSDate(start, false));
  }
  if (end) {
    // vtodo uses DUE, not DTEND
    todo.updatePropertyWithValue("due", ICAL.Time.fromJSDate(end, false));
  }
  if (rrule) {
    const rruleProp = new ICAL.Property("rrule", todo);
    rruleProp.setValue(ICAL.Recur.fromString(rrule));
    todo.addProperty(rruleProp);
  }

  cal.addSubcomponent(todo);
  return cal.toString();
}
