import * as img from "./image";
import * as text from "./text";
import { VariantComponents, Variants } from "./types";

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
} as const satisfies Variants<any>;

export const components = {
	...text.components,
	...img.components,
} as const satisfies VariantComponents<any>;

export const metadataKey = Object.entries(metadata).reduce<{
	[code: string]: keyof typeof metadata;
	// @ts-ignore
}>((acc, [key, value]) => {
	return {
		...acc,
		...Object.fromEntries(Object.keys(value.variants).map((v) => [v, key])),
	};
}, {});
