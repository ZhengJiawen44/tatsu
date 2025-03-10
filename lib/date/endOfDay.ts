import { setSeconds, setMinutes, setHours } from "date-fns";

// Set time to 11:59:59 PM
export const setToEndOfDay = (date: Date) => {
  return setSeconds(setMinutes(setHours(date, 23), 59), 59);
};
