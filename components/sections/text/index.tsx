import { VerticalLayout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";
import { TextPropsType } from "../types";
import * as H001 from "./H001";
import * as T001 from "./T001";
import { SCHEMA_IDS } from "../ids";

export const schema: JSONSchemaType<TextPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.text,
	type: "object",
	title: "Text",
	description: "",
	properties: {
		text: {
			type: "string",
			title: "Text",
			errorMessage: "Please enter some text.",
			default: "Lorem Ipsum",
		},
	},
	required: ["text"],
	errorMessage: {
		required: {
			text: "Please enter some text.",
		},
	},
};

export const uiSchema: VerticalLayout = {
	type: "VerticalLayout",
	elements: [
		{
			type: "Control",
			// @ts-ignore
			scope: "#/properties/text",
			options: {
				multi: true,
			},
		},
	],
};

export const variants = {
	H001,
	T001,
} as const;

export const components = {
	H001: H001.Component,
	T001: T001.Component,
} as const;
