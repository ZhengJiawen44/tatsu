"use client";
import {
  endOfDay,
  endOfMonth,
  endOfWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import React, { useReducer } from "react";
import { useContext, createContext } from "react";

type DateRange = {
  start: Date;
  end: Date;
};
//react-big-calendar's date range is either an array of start dates or a single DateRange object
type CalendarDateRange = DateRange | Date[];

interface CalendarRangeProviderContextProps {
  calendarRange: DateRange;
  setCalendarRange: React.ActionDispatch<[action: CalendarDateRange]>;
}

const CalendarRangeProviderContext = createContext<
  CalendarRangeProviderContextProps | undefined
>(undefined);

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

const CalendarRangeProvider = ({ children }: { children: React.ReactNode }) => {
  const [calendarRange, setCalendarRange] = useReducer(calendarRangeReducer, {
    start: startOfWeek(startOfMonth(new Date())),
    end: endOfWeek(endOfMonth(new Date())),
  });

  return (
    <CalendarRangeProviderContext.Provider
      value={{ calendarRange, setCalendarRange }}
    >
      {children}
    </CalendarRangeProviderContext.Provider>
  );
};

export default CalendarRangeProvider;

export const useCalendarRange = () => {
  const context = useContext(CalendarRangeProviderContext);
  if (!context) {
    throw new Error(
      "useCalendarRange must be used within CalendarRange provider context",
    );
  }

  return context;
};
