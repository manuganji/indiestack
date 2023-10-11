import { JSONSchemaType } from "ajv";
import { ImageTextPropsType } from "../types";
import { SCHEMA_IDS } from "../ids";
import * as IT001 from "./IT001";

export const schema: JSONSchemaType<ImageTextPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.imgText,
	type: "object",
	title: "Image with Text",
	description: "",
	properties: {
		img: {
			type: "object",
			title: "Image",
			properties: {
				src: {
					type: "string",
					title: "Image URL",
					errorMessage: "Please enter a valid image URL.",
					format: "uri",
					default: "https://source.unsplash.com/random",
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
					default: 0,
					nullable: true,
					enum: [0, 2, 4],
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
		},
		text: {
			type: "string",
			title: "Text",
			errorMessage: "Please enter a valid text.",
			default: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
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
