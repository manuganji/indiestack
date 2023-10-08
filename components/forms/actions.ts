"use server";

import { getAjv } from "@/schemas/ajvSetup";
import IDS from "@/schemas/ids";
const ajv = getAjv();

export type SchemaIdType = (typeof IDS)[keyof typeof IDS];

export const validate = async function <T>(schemaId: SchemaIdType, data: T) {
	if (!schemaId) {
		throw new Error(`Schema ID not found`);
	}
	const validator = ajv.getSchema(schemaId);
	if (!validator) {
		throw new Error(`Schema ${schemaId} not found`);
	}
	const valid = await validator(data);
	return {
		data,
		valid,
		errors: validator.errors,
	};
};
