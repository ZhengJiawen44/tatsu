"use client";
import { CalendarToolbar } from "./CalendarToolbar";
import { Calendar, dateFnsLocalizer, View } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../style/calendar-styles.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import CreateCalendarForm from "./calendarForm/CreateCalendarForm";
import useWindowSize from "@/hooks/useWindowSize";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import {
  format,
  parse,
  startOfWeek,
  getDay,
  startOfMonth,
  endOfMonth,
  endOfWeek,
  startOfDay,
  endOfDay,
} from "date-fns";
import { enUS } from "date-fns/locale/en-US";
import { TodoItemType } from "@/types";
import CalendarHeader from "./CalendarHeader";
import { agendaComponents } from "./CalendarAgenda";
import CalendarEvent from "./CalendarEvent";
import { calendarEventPropStyles } from "../lib/calendarEventPropStyles";
import { useDateRange } from "../hooks/useDateRange";
import { useCalendarTodo } from "../query/get-calendar-todo";
import { useEditCalendarTodo } from "../query/update-calendar-todo";
import { useEditCalendarTodoInstance } from "../query/update-calendar-todo-instance";
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Spinner from "@/components/ui/spinner";
import { subMilliseconds } from "date-fns";

const CalendarMobilePopup = dynamic(() => import("@/components/popups/CalendarMobilePopup"));

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});
const DnDCalendar = withDragAndDrop<TodoItemType>(Calendar);

export default function CalendarClient() {
  const [mounted, setMounted] = useState(false);
  const [calendarRange, setCalendarRange] = useDateRange();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectDateRange, setSelectDateRange] = useState<{
    start: Date;
    end: Date;
  } | null>(null);
  const { todos: calendarTodos } = useCalendarTodo(calendarRange);
  const { editCalendarTodo } = useEditCalendarTodo();
  const { editCalendarTodoInstance } = useEditCalendarTodoInstance();

  // --- keyboard navigation state ---
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [view, setView] = useState<View>("month");

  // Initialize on mount
  useEffect(() => {
    setMounted(true);
    setSelectedDate(new Date());
  }, []);

  // Helper function to update calendar range based on date and view
  const updateRangeForDate = useCallback((date: Date, currentView: View) => {
    if (currentView === "month") {
      setCalendarRange({
        start: startOfWeek(startOfMonth(date)),
        end: endOfWeek(endOfMonth(date)),
      });
    } else if (currentView === "week") {
      setCalendarRange({
        start: startOfWeek(date),
        end: endOfWeek(date),
      });
    } else if (currentView === "day") {
      setCalendarRange({
        start: startOfDay(date),
        end: endOfDay(date),
      });
    }
  }, [setCalendarRange]);

  useEffect(() => {
    if (!selectedDate) return;

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
            if (!d) return d;
            const newDate =
              view === "month"
                ? new Date(d.getFullYear(), d.getMonth() - 1, d.getDate())
                : view === "week"
                  ? new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7)
                  : new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1);
            updateRangeForDate(newDate, view);
            return newDate;
          });
          break;
        case "arrowright":
          setSelectedDate((d) => {
            if (!d) return d;
            const newDate =
              view === "month"
                ? new Date(d.getFullYear(), d.getMonth() + 1, d.getDate())
                : view === "week"
                  ? new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7)
                  : new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
            updateRangeForDate(newDate, view);
            return newDate;
          });
          break;
        case "t":
          const today = new Date();
          setSelectedDate(today);
          updateRangeForDate(today, view);
          break;
        case "1":
          setView("month");
          updateRangeForDate(selectedDate, "month");
          break;
        case "2":
          setView("week");
          updateRangeForDate(selectedDate, "week");
          break;
        case "3":
          setView("day");
          updateRangeForDate(selectedDate, "day");
          break;
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [view, selectedDate, updateRangeForDate]);

  const { width } = useWindowSize();

  // Don't render calendar until mounted
  if (!mounted || !selectedDate) {
    return (
      <div className="h-full w-full flex items-center justify-center">
        <Spinner className="w-14 h-14" />
      </div>
    );
  }

  return (
    <>
      {width <= 600 && <CalendarMobilePopup />}

      <div className="h-screen flex flex-col overflow-hidden sm:py-10">
        {showCreateForm && selectDateRange && (
          <CreateCalendarForm
            start={selectDateRange.start}
            end={selectDateRange.end}
            displayForm={showCreateForm}
            setDisplayForm={setShowCreateForm}
          />
        )}
        <DnDCalendar
          components={{
            toolbar: CalendarToolbar,
            header: CalendarHeader,
            agenda: agendaComponents,
            event: CalendarEvent,
          }}
          view={view}
          onView={(newView) => {
            setView(newView);
            updateRangeForDate(selectedDate, newView);
          }}
          date={selectedDate}
          onNavigate={(newDate) => {
            setSelectedDate(newDate);
            updateRangeForDate(newDate, view);
          }}
          selectable
          onSelectSlot={({ start, end, action }) => {
            if (action == "click") return
            const adjustedEnd = subMilliseconds(end, 1);
            setSelectDateRange({ start, end: adjustedEnd });
            setShowCreateForm(true);
          }}
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
    </>
  );
}