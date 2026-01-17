import { Prisma } from "@prisma/client";

export interface RegisterFormProp {
  fname: string;
  lname?: string;
  email: string;
  password: string;
}
export interface LoginFormProp {
  email: string;
  password: string;
}

export interface NoteItemType {
  id: string;
  name: string;
  content?: string;
  createdAt: Date;
}

export interface TodoItemType {
  id: string;
  title: string;
  description: string | null;
  pinned: boolean;
  createdAt: Date;
  order: number;
  priority: "Low" | "Medium" | "High";
  dtstart: Date;
  durationMinutes: number;
  due: Date;
  rrule: string | null;
  timeZone: string;
  userID: string;
  completed: boolean;
  exdates: Date[];
  instances: overridingInstance[] | null;
  instanceDate: Date | null;
}

export interface overridingInstance {
  id: string;
  completedAt: Date | null;
  todoId: string;
  recurId: string;
  instanceDate: Date;
  overriddenTitle: string | null;
  overriddenDescription: string | null;
  overriddenDtstart: Date | null;
  overriddenDue: Date | null;
  overriddenDurationMinutes: number | null;
  overriddenPriority: "Low" | "Medium" | "High" | null;
}

export interface CompletedTodoItemType {
  id: string;
  originalTodoID: string | null;
  title: string;
  description?: string;
  createdAt: Date;
  completedAt: Date;
  priority: "Low" | "Medium" | "High";
  dtstart: Date;
  due: Date;
  userID: string;
  rrule: string | null;
  instanceDate: Date | null;
}

export interface FileItemType {
  id: string;
  name: string;
  size: number;
  url: string;
  createdAt: Date;
}
export type NonNullableDateRange = {
  from: Date;
  to: Date;
};

export type User = Prisma.UserGetPayload<{
  include: {
    accounts: true;
    Todos: true;
    CompletedTodo: true;
    Note: true;
    File: true;
  };
}>;

export interface recurringTodoWithInstance extends TodoItemType {
  rrule: string;
  instances: overridingInstance[];
  instanceDate: Date;
}

export interface CalendarTodoItemType {
  id: string;
  title: string;
  description: string | null;
  pinned: boolean;
  createdAt: Date;
  order: number;
  priority: "Low" | "Medium" | "High";
  dtstart: Date;
  durationMinutes: number;
  due: Date;
  rrule: string | null;
  timeZone: string;
  userID: string;
  completed: boolean;
  instances: overridingInstance[] | null;
  exdates: Date[];
  instanceDate: Date | null;
}
