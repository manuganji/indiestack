import { get } from "lodash";
import { PgPageSectionCode } from "zapatos/custom";
import * as hero from "./hero";
import { SCHEMA_IDS } from "./ids";
import * as img from "./image";
import * as imgText from "./imgText";
import * as text from "./text";
import { Variants } from "./types";
import * as video from "./video";

export const metadata = {
	text: {
		title: "Text",
		desc: "Text components.",
		...text,
	},
	img: {
		title: "Image",
		desc: "Image components.",
		...img,
	},
	video: {
		title: "Video",
		desc: "Video components.",
		...video,
	},
	imgText: {
		title: "Image with text",
		desc: "Image with text components.",
		...imgText,
	},
	hero: {
		title: "Hero",
		desc: "Hero components.",
		...hero,
	},
} as const satisfies Variants;

export const components = new Map<PgPageSectionCode, React.FunctionComponent>();

for (const cat of Object.values(metadata)) {
	for (const [code, variant] of Object.entries(cat.components)) {
		components.set(code as PgPageSectionCode, variant as React.FunctionComponent);
	}
}

export const metadataKey = new Map<
	PgPageSectionCode,
	keyof typeof SCHEMA_IDS
>();

for (const [key, value] of Object.entries(metadata)) {
	for (const variant in value.variants) {
		metadataKey.set(variant as PgPageSectionCode, key as keyof typeof SCHEMA_IDS);
	}
}

export const getSchemaForCode = (code: PgPageSectionCode) => {
	const key = metadataKey.get(code);
	if (!key) {
		throw new Error(`No schema for code ${code}`);
	}
	return {
		schema: metadata[key].schema,
		uiSchema: get(metadata, `${key}.uiSchema`, undefined),
	};
};
