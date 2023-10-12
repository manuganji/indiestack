import Ajv from "ajv";
import addErrors from "ajv-errors";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import * as schemas from "./index";
import { metadata } from "@/components/sections";

const ajv = new Ajv({
	allErrors: true,
	code: {
		lines: true,
		esm: true,
		source: true,
	},
	useDefaults: true,
	coerceTypes: true,
});

addFormats(ajv);
addKeywords(ajv);

const checkNotExists = async function (
	schema: {
		column: string;
		table: string;
	},
	data: string | number,
) {
	try {
		const res = await fetch(`/api/ajv/exists`, {
			body: JSON.stringify({
				column: schema.column,
				table: schema.table,
				value: data,
			}),
			method: "GET",
		}).then<boolean>((res) => res.json());
		return !res;
	} catch (e) {
		return true;
	}
};

addErrors(ajv, {
	keepErrors: false,
	singleError: true,
});

for (const [key, sch] of Object.entries(schemas)) {
	// add all schemas first so that they can be referenced by other schemas
	ajv.addSchema(sch, key);
}

for (const item of Object.values(metadata)) {
	// section schemas for page builder
	ajv.addSchema(item.schema);
}

export const getAjv = () => {
	return ajv;
};
