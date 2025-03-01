import { z } from "zod";

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
});

export const noteSchema = z.object({
  name: z
    .string({ message: "title cannot be left empty" })
    .trim()
    .min(1, { message: "title cannot be left empty" }),
  content: z.string().nullable().optional(),
});
