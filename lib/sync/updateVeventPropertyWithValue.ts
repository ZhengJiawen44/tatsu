import ICAL from "ical.js"
import { toZonedTime } from "date-fns-tz"


/**
 * @description modifies a vevent component in-place based on the given property-value pair. if tzid is not given then defaults to utc
 * @param property property to update, e.g dtstart
 * @param vevent vevent component to update
 * @param value propert value to update
 * @param timeZone IANA timezone string. If tzid is not given then attempts to extract it from vevent. Defaults to utc
 * @returns void, component is updated in-place
 */
export function updateVeventPropertyWithValue(property:string, vevent: ICAL.Component, value: Date, timeZone?:string){
  const component = vevent.parent;
  const allVevents = component.getAllSubcomponents('vevent');
  const master = allVevents.find(v => !v.getFirstProperty('recurrence-id'));
  if(!master) throw new Error("master vevent not found in ics data")
    
  const masterDtstart = master.getFirstProperty("dtstart") as unknown as ICAL.Property
  const tzid = 
    timeZone 
    || ICAL.Timezone.fromData(master).tzid 
    || masterDtstart.getParameter("tzid")?.toString()
    || "utc"

  vevent.updatePropertyWithValue(property, toMasterShapedTime(value, masterDtstart, tzid))

  //timed events
  if (masterDtstart.type!="date") {
    vevent.getFirstProperty(property)!.setParameter('tzid', tzid)
  }
}



/**
 * @description Shape a JS Date into the the master's date format (all-day vs timed).
 * @param jsDate a javascript date
 * @param masterDtstart reference for the update, typically dtstart from the master
 * @param tzid IANA timezone string
 * @returns ICAL.Time object
 */
export function toMasterShapedTime(jsDate: Date, masterDtstart: ICAL.Property, tzid: string): ICAL.Time {
  const localDate = toZonedTime(jsDate, tzid)

  //all day events
  if (masterDtstart.type=="date") {
    return ICAL.Time.fromData({
      year: localDate.getUTCFullYear(),
      month: localDate.getUTCMonth() + 1,
      day: localDate.getUTCDate(),
      isDate: true,
    })
  }
  
  //events with duration
  return ICAL.Time.fromJSDate(localDate, false)
}


