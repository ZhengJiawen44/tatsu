import { z } from "zod";

export const registrationSchema = z.object({
  email: z
    .string({ message: "email cannot be left empty" })
    .email({ message: "email is incorrect" }),
  password: z
    .string({ message: "password cannot be empty" })
    .min(2, { message: "password cannot be smaller than 2" }),
});
