import type { JSONSchemaType } from "ajv";

export const loginSchema: JSONSchemaType<{
	email: string;
}> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "login",
	type: "object",
	properties: {
		email: {
			type: "string",
			format: "email",
			errorMessage: "Invalid email",
		},
	},
	required: ["email"],
};

export const signUpSchema: JSONSchemaType<{
	firstName: string;
	lastName: string;
	email: string;
	tos: boolean;
}> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "signUp",
	type: "object",
	title: "Sign Up",
	description: "Sign up for an account",
	properties: {
		firstName: {
			type: "string",
			title: "First Name",
			errorMessage: "Please enter your first name.",
		},
		lastName: {
			type: "string",
			title: "Last Name",
			errorMessage: "Please enter your last name.",
		},
		email: {
			type: "string",
			format: "email",
			title: "Email Address",
			description:
				"This will be your primary means of contact and account recovery. Please ensure it is correct.",
			errorMessage: "Please enter a valid email address.",
			// notExists: {
			// 	column: "email",
			// 	table: "users",
			// 	errorMessage: "A user with this email already exists.",
			// },
		},
		tos: {
			type: "boolean",
			title: "Terms of Service",
			description: `I agree to the Terms of Service`,
			const: true,
			errorMessage: "You must agree to the Terms of Service to continue.",
		},
	},
	required: ["firstName", "lastName", "email", "tos"],
	errorMessage: {
		required: {
			firstName: "Please enter your first name.",
			lastName: "Please enter your last name.",
			email: "Please enter a valid email address.",
			tos: "You must agree to the Terms of Service to continue.",
		},
	},
};
