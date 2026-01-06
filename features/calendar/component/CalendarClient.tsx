"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop"; // 1. Import HOC
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { CalendarTodoItemType } from "@/types";
import CalendarHeader from "./CalendarHeader";
import { agendaComponents } from "./CalendarAgenda";
import CalendarEvent from "./CalendarEvent";
import { calendarEventPropStyles } from "../lib/calendarEventPropStyles";
import { useDateRange } from "../hooks/useDateRange";
import { useCalendarTodo } from "../api/get-calendar-todo";
import { useEffect } from "react";
import { useEditCalendarTodo } from "../api/update-calendar-todo";
import { useEditCalendarTodoInstance } from "../api/update-calendar-todo-instance";

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
const DnDCalendar = withDragAndDrop<CalendarTodoItemType>(Calendar);

export default function CalendarClient() {
  useEffect(() => {
    console.log("rerendered");
  }, []);
  const [calendarRange, setCalendarRange] = useDateRange(); //useReducerHook
  const { todos: calendarTodos } = useCalendarTodo(calendarRange);
  const { editCalendarTodo } = useEditCalendarTodo();
  const { editCalendarTodoInstance } = useEditCalendarTodoInstance();
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
        eventPropGetter={(event) => calendarEventPropStyles(event.priority)} //styles for the event container
        onRangeChange={setCalendarRange}
        // onEventResize={({ event: todo, ...resizeEvent }) => {
        //   //all updates done to repeat events are instance only
        //   // if (!todo.rrule) {
        //   //   editCalendarTodo({
        //   //     ...todo,
        //   //     dtstart: new Date(resizeEvent.start),
        //   //     due: new Date(resizeEvent.end),
        //   //   });
        //   // } else {
        //   //   editCalendarTodoInstance({
        //   //     ...todo,
        //   //     // id: todo.parentId,
        //   //     instanceDate: todo.dtstart,
        //   //     dtstart: new Date(resizeEvent.start),
        //   //     due: new Date(resizeEvent.end),
        //   //   });
        //   // }
        // }}
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
              // id: todo.parentId,
              instanceDate: todo.dtstart,
              dtstart: new Date(dropEvent.start),
              due: new Date(dropEvent.end),
            });
          }
        }}
      />
    </div>
  );
}
