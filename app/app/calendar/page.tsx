import React from "react";
import CalendarClient from "@/features/calendar/component/CalendarClient";
import { prisma } from "@/lib/prisma/client";

const page = async ({}) => {
  const todos = await prisma.todo.findMany({ where: { completed: false } });
  const calendarTodos = todos.map((todo) => {
    return {
      id: todo.id,
      title: todo.title,
      description: todo.description,
      dtstart: todo.dtstart,
      due: todo.due,
      priority: todo.priority,
      rrule: todo.rrule,
    };
  });
  return <CalendarClient calendarTodos={calendarTodos} />;
};

export default page;
