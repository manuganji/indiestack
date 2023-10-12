"use server";

import { metadata } from "@/components/sections";
import { SCHEMA_IDS } from "@/components/sections/ids";
import { runQuery, runQueryTxn } from "@/db";
import { requireAdmin } from "@/lib/checks";
import { getDomain } from "@/lib/domains";
import { getHostName } from "@/lib/serverUtils";
import { getAjv } from "@/schemas/ajvSetup";

import { cache } from "react";
import {
	JSONValue,
	conditions,
	deletes,
	select,
	selectExactlyOne,
	update,
	upsert,
} from "zapatos/db";
import { pages, sections } from "zapatos/schema";

export type PageType = {
	sections: Pick<sections.JSONSelectable, "code" | "config" | "order" | "id">[];
	page: Pick<pages.JSONSelectable, "title" | "path">;
};

const ajv = getAjv();

export const getPageById = cache(async function (id: string) {
	await Promise.all([requireAdmin()]);
	const property = await getDomain({ domain: getHostName() });
	return await runQuery(
		selectExactlyOne(
			"pages",
			{
				property: property.id,
				id,
			},
			{
				lateral: {
					sections: select(
						"sections",
						{
							page: id,
						},
						{
							order: {
								by: "order",
								direction: "ASC",
							},
						},
					),
				},
			},
		),
	);
});

export const savePage = async function (
	pageId: string,
	{ page, sections }: PageType,
) {
	// console.log("Saving page", page);
	await Promise.all([requireAdmin()]);
	const property = await getDomain({ domain: getHostName() });
	await runQueryTxn(async (client) => {
		return Promise.all([
			update(
				"pages",
				{
					id: pageId,
					...page,
					updated_at: conditions.now,
				},
				{
					property: property.id,
					id: pageId,
				},
			)
				.run(client)
				.catch((e) => {
					console.log("Error saving page", e);
					throw e;
				}),
			deletes("sections", {
				page: pageId,
				id: conditions.isNotIn(sections.map((s) => s.id)),
			})
				.run(client)
				.catch((e) => {
					console.log("Error deleting unused sections", e);
					throw e;
				}),
			upsert(
				"sections",
				sections.map((section) => ({
					...section,
					page: pageId,
				})),
				{
					value: "sections_pkey",
				},
			)
				.run(client)
				.catch((e) => {
					console.log("Error saving sections", e);
					throw e;
				}),
		]);
	});
};

export const getDefaultConfig = cache(async function (
	code: keyof typeof SCHEMA_IDS,
) {
	const validate = ajv.getSchema(metadata[code].schema.$id || code);
	const data = {};
	// @ts-ignore
	validate(data);
	return data as JSONValue;
});
