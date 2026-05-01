import ICAL from "ical.js";
export function parseIcsToVeventComponent(icsData: string) {
  const jcalData = ICAL.parse(icsData);
  const comp = new ICAL.Component(jcalData);
  return comp;
}
