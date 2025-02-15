import { z } from "zod";

export const registrationSchema = z.object({
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
  name: z
    .string({ message: "name cannot be left empty" })
    .trim()
    .min(2, { message: "first name has to be atleast two characters" }),
  lastname: z
    .string()
    .min(2, { message: "last name has to be atleast two characters or none" })
    .optional(),
  email: z.string({ message: "email cannot be left empty" }).trim(),
  password: z.string(),
});
