import { parseIcsToVeventComponent } from "./parseIcsToComponent";
import ICAL from "ical.js";
/**
 * Updates an ICS string with the given VEVENT properties, replacing any existing ones.
 * @param icsData - The original ICS string to update
 * @param properties - A property or list of properties to set on the VEVENT
 * @param properties[].name - The ICAL property name (e.g. "exdate", "summary")
 * @param properties[].value - The value to set (ICAL.Time, string, number, etc.)
 * @returns The updated ICS string
 * @throws If the ICS data cannot be parsed or no VEVENT component is found
 */
export function updateIcs(
  icsData: string,
  properties:
    | { name: string; value: unknown }
    | { name: string; value: unknown }[],
): string {
  const comp = parseIcsToVeventComponent(icsData);
  const vevent = comp.getFirstSubcomponent("vevent");
  if (!vevent)
    throw new Error("Could not find VEVENT subcomponent in ICS data");

  const updates = Array.isArray(properties) ? properties : [properties];

  for (const { name, value } of updates) {
    vevent.removeAllProperties(name);
    if (Array.isArray(value)) {
      for (const v of value) vevent.addPropertyWithValue(name, v);
    } else {
      vevent.addPropertyWithValue(name, value);
    }
  }

  return ICAL.stringify(comp.toJSON());
}
