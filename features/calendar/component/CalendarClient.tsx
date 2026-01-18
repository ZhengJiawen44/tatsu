"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarTodoItemType } from "@/types";
import CalendarHeader from "./CalendarHeader";
import { agendaComponents } from "./CalendarAgenda";
import CalendarEvent from "./CalendarEvent";
import { calendarEventPropStyles } from "../lib/calendarEventPropStyles";
import { useDateRange } from "../hooks/useDateRange";
import { useCalendarTodo } from "../query/get-calendar-todo";
import { useEditCalendarTodo } from "../query/update-calendar-todo";
import { useEditCalendarTodoInstance } from "../query/update-calendar-todo-instance";
import { useEffect, useState } from "react";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop<CalendarTodoItemType>(Calendar);

export default function CalendarClient() {
  const [calendarRange, setCalendarRange] = useDateRange();
  const { todos: calendarTodos } = useCalendarTodo(calendarRange);

  const { editCalendarTodo } = useEditCalendarTodo();
  const { editCalendarTodoInstance } = useEditCalendarTodoInstance();

  // --- keyboard navigation state ---
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState<View>("month");

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target.tagName)
      )
        return;

      const key = e.key.toLowerCase();
      e.preventDefault();

      switch (key) {
        case "arrowleft":
          setSelectedDate((d) => {
            if (view === "month")
              return new Date(d.getFullYear(), d.getMonth() - 1, d.getDate());
            if (view === "week")
              return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1); // day view
          });
          break;
        case "arrowright":
          setSelectedDate((d) => {
            if (view === "month")
              return new Date(d.getFullYear(), d.getMonth() + 1, d.getDate());
            if (view === "week")
              return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7);
            return new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1); // day view
          });
          break;
        case "t":
          setSelectedDate(new Date());
          break;
        case "1":
          setView("month");
          break;
        case "2":
          setView("week");
          break;
        case "3":
          setView("day");
          break;
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [view]);

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
        view={view}
        date={selectedDate}
        localizer={localizer}
        events={calendarTodos}
        startAccessor="dtstart"
        endAccessor="due"
        draggableAccessor={() => true}
        step={60}
        timeslots={1}
        messages={{ event: "Todo" }}
        resizable
        formats={{
          eventTimeRangeFormat: () => "",
        }}
        eventPropGetter={(event) => calendarEventPropStyles(event.priority)}
        onRangeChange={setCalendarRange}
        onEventResize={({ event: todo, ...resizeEvent }) => {
          if (!todo.rrule) {
            editCalendarTodo({
              ...todo,
              dtstart: new Date(resizeEvent.start),
              due: new Date(resizeEvent.end),
            });
          } else {
            editCalendarTodoInstance({
              ...todo,
              instanceDate: todo.instanceDate || todo.dtstart,
              dtstart: new Date(resizeEvent.start),
              due: new Date(resizeEvent.end),
            });
          }
        }}
        onEventDrop={({ event: todo, ...dropEvent }) => {
          if (!todo.rrule) {
            editCalendarTodo({
              ...todo,
              dtstart: new Date(dropEvent.start),
              due: new Date(dropEvent.end),
            });
          } else {
            editCalendarTodoInstance({
              ...todo,
              instanceDate: todo.instanceDate || todo.dtstart,
              dtstart: new Date(dropEvent.start),
              due: new Date(dropEvent.end),
            });
          }
        }}
      />
    </div>
  );
}
