import type { JSONSchemaType } from "ajv";
import type { PgPropertySettings } from "zapatos/custom";
import { properties } from "zapatos/schema";

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

export const propertySettingsSchema: JSONSchemaType<PgPropertySettings> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "propertySettings",
	type: "object",
	title: "Property Settings",
	description: "",
	properties: {
		auth: {
			type: "object",
			title: "Authentication",
			description: "",
			properties: {
				allowSignUp: {
					type: "boolean",
					title: "Allow Sign Up",
					description: "",
					default: true,
				},
				allowSignIn: {
					type: "boolean",
					title: "Allow Sign In",
					description: "",
					default: true,
				},
			},
			required: ["allowSignUp", "allowSignIn"],
			errorMessage: {},
		},
		email: {
			type: "object",
			title: "Email",
			description: "Email Settings",
			properties: {
				emailFrom: {
					type: "string",
					format: "email",
					title: "Email From",
					description: "The email address that emails will be sent from",
					errorMessage: "Please enter an email address.",
				},
				emailFromName: {
					type: "string",
					title: "Email Sender Name",
					description: "The sender name that emails will be sent from",
					errorMessage: "Please enter a name.",
				},
			},
			required: ["emailFrom", "emailFromName"],
		},
		analytics: {
			type: "object",
			title: "Analytics",
			description: "Analytics Settings",
			properties: {
				googleAnalyticsId: {
					type: "string",
					title: "Google Analytics ID",
					description: "The ID of your Google Analytics provider",
					errorMessage: "Please enter an ID.",
				},
			},
			required: ["googleAnalyticsId"],
		},
	},
	required: ["auth", "email"],
};

export const propertySchema: JSONSchemaType<
	Omit<properties.JSONSelectable, "id">
> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "property",
	type: "object",
	title: "Property",
	description: "",
	properties: {
		name: {
			type: "string",
			title: "Property Name",
			errorMessage: "Please enter a property name.",
		},
		domain: {
			type: "string",
			title: "Domain",
			format: "hostname",
			errorMessage: "Please enter a valid domain.",
		},
		settings: {
			$ref: "propertySettings",
		}
	},
	required: ["name", "domain", "settings"],
	errorMessage: {
		required: {
			name: "Please enter a property name.",
			domain: "Please enter a valid domain.",
		},
	},
};