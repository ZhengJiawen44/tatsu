import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useReducer } from "react";
type DateRange = {
  start: Date;
  end: Date;
};
//react-big-calendar's date range is either an array of start dates or a single DateRange object
type CalendarDateRange = DateRange | Date[];

/**
 * @description useReducer to effectively sync with rbc's calendar date range.
 *  A useState is not used as the state can be of different types and additional
 * logic needs to be written to change the state. Hence a reducer is used
 * @returns {state, dispatch}
 */
export function useDateRange() {
  const [calendarRange, setCalendarRange] = useReducer(calendarRangeReducer, {
    start: startOfWeek(startOfMonth(new Date())),
    end: endOfWeek(endOfMonth(new Date())),
  });
  return [calendarRange, setCalendarRange] as const;
}
function calendarRangeReducer(
  state: CalendarDateRange,
  action: CalendarDateRange,
) {
  if (Array.isArray(action)) {
    return {
      start: startOfDay(action[0]),
      end: endOfDay(action[action.length - 1]),
    };
  } else {
    return {
      start: startOfDay(action.start),
      end: endOfDay(action.end),
    };
  }
}
