import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email().nonempty().default(""),
  firstName: z.string().min(2).default(""),
  lastName: z.string().min(2).default(""),
});
