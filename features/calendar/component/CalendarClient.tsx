"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
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

  console.log(ghostTodos);

  return (
    <Calendar<CalendarTodo>
      components={{
        toolbar: CalendarToolbar,
        header: CalendarHeader,
        agenda: agendaComponents,
      }}
      defaultView="month"
      localizer={localizer}
      events={ghostTodos}
      startAccessor="dtstart"
      endAccessor="due"
      step={60}
      timeslots={1}
      messages={{ event: "Todo" }}
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
      onSelectEvent={(event) => console.log(event)}
    />
  );
}
