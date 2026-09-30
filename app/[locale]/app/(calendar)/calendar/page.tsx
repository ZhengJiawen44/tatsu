import React from "react";
import CalendarClient from "@/features/calendar/component/CalendarClient";
import CalendarRangeProvider from "@/providers/CalenderRangeProvider";

const page = async ({}) => {
  return <CalendarRangeProvider>
          <CalendarClient />
        </CalendarRangeProvider>
};

export default page;
