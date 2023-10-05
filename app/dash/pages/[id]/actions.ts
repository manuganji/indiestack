"use server";

import { components } from "@/components/sections";
import { runQuery, runQueryTxn } from "@/db";
import { requireAdmin } from "@/lib/checks";
import { getCurrentProperty } from "@/lib/serverUtils";
import { getAjv } from "@/schemas/ajvSetup";

import { cache } from "react";
import {
	JSONValue,
	conditions,
	deletes,
	update,
	select,
	selectExactlyOne,
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
	await Promise.all([requireAdmin()]);
	const property = await getCurrentProperty();
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
	code: keyof typeof components,
) {
	const validate = ajv.getSchema(components[code].schema.$id || code);
	const data = {};
	// @ts-ignore
	validate(data);
	return data as JSONValue;
});
