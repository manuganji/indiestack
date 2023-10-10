import { JSONSchemaType } from "ajv";
import { ImgPropsType } from "../types";
import * as IMG001 from "./IMG001";
import { SCHEMA_IDS } from "../ids";

export const schema: JSONSchemaType<ImgPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.img,
	type: "object",
	title: "Image",
	description: "",
	properties: {
		img: {
			type: "string",
			format: "uri",
			title: "URL",
			errorMessage: "Paste in the image url.",
			default:
				"https://images.pexels.com/photos/479454/pexels-photo-479454.jpeg?cs=srgb&dl=pexels-icon-com-479454.jpg&fm=jpg&w=640&h=960",
		},
	},
	required: ["img"],
	errorMessage: {
		required: {
			img: "Paste in the image url.",
		},
	},
};

export const variants = {
	IMG001,
};

export const components = {
	IMG001: IMG001.Component,
};
