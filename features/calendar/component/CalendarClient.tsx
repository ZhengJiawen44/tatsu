"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay, endOfDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarEvent } from "@/types";
import CalendarHeader from "./CalendarHeader";
import { agendaComponents } from "./CalendarAgenda";

const locales = {
  "en-US": enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

export default function CalendarClient() {
  const events = [
    {
      start: new Date(),
      end: endOfDay(new Date()),
      title: "Some title",
    },
  ];

  return (
    <Calendar<CalendarEvent>
      components={{
        toolbar: CalendarToolbar,
        header: CalendarHeader,
        agenda: agendaComponents,
      }}
      localizer={localizer}
      events={events}
      startAccessor="start"
      endAccessor="end"
      step={60}
      timeslots={1}
      messages={{ event: "Todo" }}
    />
  );
}
