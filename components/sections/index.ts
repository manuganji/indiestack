import { PgPageSectionCode } from "zapatos/custom";
import * as img from "./image";
import * as text from "./text";
import * as video from "./video";
import { VariantComponents, Variants } from "./types";
import { SCHEMA_IDS } from "./ids";

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
} as const satisfies Variants<any>;

export const components = {
	...text.components,
	...img.components,
	...video.components,
} as const satisfies VariantComponents<any>;

export const metadataKey = new Map<
	PgPageSectionCode,
	keyof typeof SCHEMA_IDS
>();
for (const [key, value] of Object.entries(metadata)) {
	for (const variant in value.variants) {
		metadataKey.set(variant as PgPageSectionCode, key as keyof typeof SCHEMA_IDS);
	}
}
