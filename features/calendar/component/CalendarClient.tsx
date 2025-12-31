"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"; // 1. Import HOC
import {
  format,
  parse,
  startOfWeek,
  getDay,
  endOfDay,
  startOfDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarTodo } from "@/types";
import CalendarHeader from "./CalendarHeader";
import { agendaComponents } from "./CalendarAgenda";
import { RRule } from "rrule";
import { useState } from "react";
import { masqueradeAsUTC } from "@/features/todos/lib/masqueradeAsUTC";
import { rruleDateToLocal } from "@/features/todos/lib/rruleDateToLocal";
import CalendarEvent from "./CalendarEvent";
import clsx from "clsx";

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
const DnDCalendar = withDragAndDrop<CalendarTodo>(Calendar);

export default function CalendarClient({
  calendarTodos,
}: {
  calendarTodos: CalendarTodo[];
}) {
  const [calendarRange, setCalendarRange] = useState<{
    start: Date;
    end: Date;
  }>({
    start: startOfWeek(startOfMonth(new Date())),
    end: endOfWeek(endOfMonth(new Date())),
  });

  const ghostTodos = calendarTodos.flatMap((todo) => {
    if (!todo.rrule) return todo;
    const rruleObj = new RRule({
      ...RRule.parseString(todo.rrule),
      dtstart: masqueradeAsUTC(todo.dtstart),
    });
    const occurences = rruleObj.between(
      masqueradeAsUTC(calendarRange.start),
      masqueradeAsUTC(calendarRange.end),
    );
    const genTodos = occurences.map((occ) => {
      occ = rruleDateToLocal(occ);
      const duration = todo.due.getTime() - todo.dtstart.getTime();
      return {
        id: todo.id,
        title: todo.title,
        description: todo.description,
        priority: todo.priority,
        rrule: todo.rrule,
        dtstart: occ,
        due: new Date(occ.getTime() + duration),
      };
    });
    return genTodos;
  });
  return (
    <div className="h-full">
      <DnDCalendar
        components={{
          toolbar: CalendarToolbar,
          header: CalendarHeader,
          agenda: agendaComponents,
          event: CalendarEvent,
        }}
        defaultView="month"
        localizer={localizer}
        events={ghostTodos}
        startAccessor="dtstart"
        endAccessor="due"
        draggableAccessor={() => true}
        step={60}
        timeslots={1}
        messages={{ event: "Todo" }}
        onEventResize={() => {}}
        onEventDrop={() => {}}
        resizable
        formats={{
          eventTimeRangeFormat: () => "",
        }}
        eventPropGetter={(event) => {
          return {
            style: {
              backgroundColor: clsx(
                event.priority == "Low"
                  ? "hsl(var(--calendar-lime))"
                  : event.priority == "Medium"
                    ? "hsl(var(--calendar-orange))"
                    : "hsl(var(--calendar-red))",
              ),
              outline: "none",
              border: "1px solid hsl(var(--border))",
              display: "flex",
              justifyContent: "start",
              padding: "2px",
              margin: "2px",
              boxShadow:
                "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
            },
            className: clsx(
              // "rounded-md !p-0 overflow-hidden",
              event.priority === "High" && "bg-red-500",
              event.priority === "Medium" && "bg-yellow-500",
              event.priority === "Low" && "bg-green-500",
            ),
          };
        }}
        onRangeChange={(range) => {
          if (Array.isArray(range)) {
            setCalendarRange({
              start: startOfDay(range[0]),
              end: endOfDay(range[range.length - 1]),
            });
          } else {
            setCalendarRange({
              start: startOfDay(range.start),
              end: endOfDay(range.end),
            });
          }
        }}
      />
    </div>
  );
}
