import { z } from "zod";

export const signUpSchema = z.object({
	email: z.string().email().nonempty().default(""),
	firstName: z.string().min(2).default(""),
	lastName: z.string().min(2).default(""),
});

export const emailSignInSchema = z.object({
	email: z.string().email().nonempty().default(""),
});

export const simpleAuthnSchema = z.object({
	username: z.string().nonempty().default(""),
});

export const signInSchema = z.union([emailSignInSchema, simpleAuthnSchema]);
