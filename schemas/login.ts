import type { JSONSchema, FromSchema } from "json-schema-to-ts";
import Ajv from "ajv";
import addFormats from "ajv-formats";
export const loginSchema = {
	type: "object",
	properties: {
		email: {
			type: "string",
			format: "email",
		},
	},
} as const satisfies JSONSchema;

export type LoginSchemaType = FromSchema<typeof loginSchema>;
const ajv = new Ajv({});
addFormats(ajv);
export const loginValidator = ajv.compile<LoginSchemaType>(loginSchema);
