import { JSONSchemaType } from "ajv";
import { ImageTextPropsType } from "../types";
import { SCHEMA_IDS } from "../ids";
import * as IT001 from "./IT001";
import { DEFAULT_TEST_IMAGE } from "@/constants";

export const schema: JSONSchemaType<ImageTextPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.imgText,
	type: "object",
	title: "Image with Text",
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
		img: {
			type: "object",
			title: "Image",
			properties: {
				src: {
					type: "string",
					title: "Image URL",
					errorMessage: "Please enter a valid image URL.",
					default: DEFAULT_TEST_IMAGE,
				},
				alt: {
					type: "string",
					title: "Image Alt Text",
					errorMessage: "Please enter a valid image alt text.",
					default: "Random Image",
					nullable: true,
				},
				left: {
					type: "boolean",
					title: "Image Left",
					default: true,
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
			nullable: false,
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
		margin: {
			type: "object",
			title: "Margin",
			properties: {
				y: {
					title: "Margin Y",
					$ref: "#/$defs/gap",
				},
				x: {
					title: "Margin X",
					$ref: "#/$defs/gap",
				},
			},
			nullable: true,
		},
		gap: {
			title: "Gap",
			type: "number",
			$ref: "#/$defs/gap",
			nullable: true,
		},
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
	required: ["text", "img"],
	errorMessage: {
		required: {
			url: "Please enter a valid video URL.",
		},
	},
};

export const variants = {
	IT001,
} as const;

export const components = {
	IT001: IT001.Component,
} as const;
