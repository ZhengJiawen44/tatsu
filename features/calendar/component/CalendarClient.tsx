"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarTodo } from "@/types";
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

export default function CalendarClient({
  calendarTodos,
}: {
  calendarTodos: CalendarTodo[];
}) {
  return (
    <Calendar<CalendarTodo>
      components={{
        toolbar: CalendarToolbar,
        header: CalendarHeader,
        agenda: agendaComponents,
      }}
      localizer={localizer}
      events={calendarTodos}
      startAccessor="dtstart"
      endAccessor="due"
      step={60}
      timeslots={1}
      messages={{ event: "Todo" }}
    />
  );
}
