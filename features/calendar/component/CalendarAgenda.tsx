"use client";

import {
  AgendaDateProps,
  AgendaTimeProps,
  EventProps,
} from "react-big-calendar";
import { format } from "date-fns";
import { TodoItemType } from "@/types";

// --- Custom agenda date row ---
const CustomAgendaDate = ({ day }: AgendaDateProps) => {
  return <div>{format(day, "EEEE, MMM d")}</div>;
};

// --- Custom agenda time row ---
const CustomAgendaTime = ({ day }: AgendaTimeProps) => {
  return <span>{format(day, "HH:mm")}</span>;
};

// --- Custom agenda event row ---
const CustomAgendaEvent = ({ event }: EventProps<TodoItemType>) => {
  return (
    <div>
      <span>{event.title}</span>
      <span>
        ({format(event.dtstart, "HH:mm")} - {format(event.due, "HH:mm")})
      </span>
    </div>
  );
};

// --- Export only the agenda object ---
export const agendaComponents = {
  date: CustomAgendaDate,
  time: CustomAgendaTime,
  event: CustomAgendaEvent,
};
