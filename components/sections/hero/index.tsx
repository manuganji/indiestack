import { DEFAULT_TEST_IMAGE } from "@/constants";
import { JSONSchemaType } from "ajv";
import { SCHEMA_IDS } from "../ids";
import { HeroPropsType } from "../types";
import * as HE001 from "./HE001";

export const schema: JSONSchemaType<HeroPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.hero,
	type: "object",
	title: "Hero Section",
	description: "",
	$defs: {
		gap: {
			type: "number",
			title: "Gap",
			default: 2,
			nullable: true,
			enum: [2, 4, 8],
		},
	},
	properties: {
		padding: {
			type: "object",
			properties: {
				y: {
					title: "Padding Y",
					$ref: "#/$defs/gap",
				},
				x: {
					title: "Padding X",
					$ref: "#/$defs/gap",
				},
			},
			nullable: true,
		},
		img: {
			type: "object",
			title: "Image",
			properties: {
				src: {
					type: "string",
					title: "Image URL",
					default: DEFAULT_TEST_IMAGE,
					errorMessage: "Please enter a valid image URL.",
				},
				alt: {
					type: "string",
					title: "Image Alt Text",
					errorMessage: "Please enter a valid image alt text.",
					default: "Hero",
					nullable: true,
				},
				radius: {
					type: "number",
					title: "Image Border Radius",
					default: 2,
					nullable: true,
					description: "9999 for circle",
					enum: [0, 2, 4, 8, 9999],
				},
				width: {
					type: "number",
					title: "Image Width",
					default: 640,
					nullable: true,
				},
				height: {
					type: "number",
					title: "Image Height",
					default: 360,
					nullable: true,
				},
			},
			required: ["src"],
			nullable: true,
			default: {
				// this is required for ajv default compute to work
				src: DEFAULT_TEST_IMAGE,
			},
		},
		text: {
			type: "string",
			title: "Text",
			errorMessage: "Please enter a valid text.",
			default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
		},
		justify: {
			type: "string",
			title: "Justify",
			enum: ["start", "center", "end", "between", "around", "evenly"],
			default: "center",
			nullable: true,
		},
		items: {
			type: "string",
			title: "Items",
			enum: ["start", "center", "end", "stretch"],
			default: "center",
			nullable: true,
		},
	},
	required: ["text"],
	errorMessage: {
		required: {
			url: "Please enter a valid video URL.",
		},
	},
};

export const variants = {
	HE001,
} as const;

export const components = {
	HE001: HE001.Component,
} as const;
