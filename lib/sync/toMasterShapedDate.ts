import ICAL from "ical.js"

/**
 * Shape a JS Date into the the master's date format (isDate + zone).
 * @param jsDate a javascript date
 * @param template typically dtstart from the master
 * @returns 
 */
export function toMasterShapedTime(jsDate: Date, template: ICAL.Time): ICAL.Time {
  if (template.isDate) {
    return ICAL.Time.fromData({
      year: jsDate.getUTCFullYear(),
      month: jsDate.getUTCMonth() + 1,
      day: jsDate.getUTCDate(),
      isDate: true,
    })
  }
  const utc = ICAL.Time.fromJSDate(jsDate, true)
  
  if(template.zone)return utc.convertToZone(template.zone)
  return utc;
}