import { z } from "zod";

export const LoginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Required"),
  password: z.string().min(6, "Min 6 characters"),
});

export type LoginSchemaType = z.infer<typeof LoginSchema>;

export const SignupSchema = z.object({
  username: z.string().min(3, "Min 3 characters"),
  email: z.string().email("Invalid email").optional().or(z.literal("").transform(() => undefined)),
  password: z.string().min(6, "Min 6 characters"),
  role: z.enum(["creator", "consumer"]),
});

export type SignupSchemaType = z.infer<typeof SignupSchema>;
