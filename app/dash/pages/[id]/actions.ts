"use server";

import { getAjv } from "@/ajvSetup";
import { components } from "@/components/sections";
import { runQuery } from "@/db";
import { getCurrentProperty } from "@/lib/serverUtils";
import { cache } from "react";
import { JSONValue, select, selectExactlyOne } from "zapatos/db";

const ajv = getAjv();
export const getPage = cache(async function (id: string) {
	const property = await getCurrentProperty();
	return await runQuery(
		selectExactlyOne(
			"pages",
			{
				property: property.id,
				id,
			},
			{
				lateral: {
					sections: select("sections", {
						page: id,
					}),
				},
			},
		),
	);
});

for (const component of Object.values(components)) {
	ajv.addSchema(component.schema);
}

export const getDefaultConfig = cache(async function (
	code: keyof typeof components,
) {
	const validate = ajv.getSchema(components[code].schema.$id || code);
	const data = {};
	// @ts-ignore
	validate(data);
	return data as JSONValue;
});
