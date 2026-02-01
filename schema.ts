import { z } from "zod";
export const todoItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  pinned: z.boolean(),
  createdAt: z.date(),
  order: z.number(),
  priority: z.enum(["Low", "Medium", "High"]),
  dtstart: z.date(),
  durationMinutes: z.number(),
  due: z.date(),
  rrule: z.string().nullable(),
  timeZone: z.string(),
  userID: z.string(),
  completed: z.boolean(),
  exdates: z.array(z.date()),
  instances: z.array(z.any()).nullable(),
  instanceDate: z.date().nullable(),
});
export const registrationSchema = z.object({
  fname: z
    .string({ message: "name cannot be left empty" })
    .trim()
    .min(2, { message: "first name is atleast two characters" }),
  lname: z.string().optional(),
  email: z
    .string({ message: "email cannot be left empty" })
    .trim()
    .email({ message: "email is incorrect" }),
  password: z
    .string({ message: "password cannot be empty" })
    .min(8, { message: "password cannot be smaller than 8" })
    .regex(/[A-Z]/, {
      message: "password must have at least one uppercase letter",
    })
    .regex(/[\W_]/, {
      message: "password must have at least one special character",
    }),
});

export const loginSchema = z.object({
  email: z
    .string({ message: "email cannot be left empty" })
    .trim()
    .email({ message: "email is incorrect" }),
  password: z.string(),
});

export const todoSchema = z.object({
  title: z
    .string({ message: "title cannot be left empty" })
    .trim()
    .min(1, { message: "title cannot be left empty" }),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "priority must be one of: low, medium, high" }),
  }),
  dtstart: z.date({ message: "start date is not identified" }),
  due: z.date({ message: "end date is not identified" }),
  rrule: z.string().nullable(),
  projectID: z.string().nullable(),
});

export const todoInstanceSchema = z.object({
  title: z
    .string({ message: "title cannot be left empty" })
    .trim()
    .min(1, { message: "title cannot be left empty" }),
  description: z.string().optional(),
  priority: z.enum(["Low", "Medium", "High"], {
    errorMap: () => ({ message: "priority must be one of: low, medium, high" }),
  }),
  dtstart: z.date({ message: "start date is not identified" }),
  due: z.date({ message: "end date is not identified" }),
  instanceDate: z.date({ message: "instance date is not identified" }),
  rrule: z.string().nullable(),
});

export const noteSchema = z.object({
  name: z
    .string({ message: "title cannot be left empty" })
    .trim()
    .min(1, { message: "title cannot be left empty" }),
  content: z.string().nullable().optional(),
});

export const projectBaseSchema = z.object({
  id: z.string({ message: "id cannot be left empty" }),
  name: z
    .string({ message: "title cannot be left empty" })
    .trim()
    .min(1, { message: "title cannot be left empty" }),
  color: z.string().nullable(),
});

export const projectCreateSchema = projectBaseSchema.pick({
  name: true,
});
export const projectPatchSchema = projectBaseSchema.partial().extend({
  name: z
    .string({ message: "title cannot be left empty" })
    .trim()
    .min(1, { message: "title cannot be left empty" })
    .optional(),
  color: z.string().optional(),
});

export const userPreferencesSchema = z.object({
  sortBy: z
    .enum(["dtstart", "due", "duration", "priority"])
    .nullable()
    .optional(),
  groupBy: z
    .enum(["dtstart", "due", "duration", "priority", "rrule"])
    .nullable()
    .optional(),
  direction: z.enum(["Ascending", "Descending"]).nullable().optional(),
});
