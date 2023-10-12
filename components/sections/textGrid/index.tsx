import { VerticalLayout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";
import { TextGridPropsType } from "../types";

import * as TG001 from "./TG001";
import { SCHEMA_IDS } from "../ids";

export const schema: JSONSchemaType<TextGridPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.textGrid,
	type: "object",
	title: "Text Grid",
	description: "",
	required: ["items"],
	properties: {
		items: {
			type: "array",
			title: "Text Grid Items",
			items: {
				type: "object",
				properties: {
					text: {
						type: "string",
						title: "Text",
						errorMessage: "Please enter some text.",
						default: "Lorem Ipsum",
					},
					icon: {
						type: "string",
						title: "Icon",
						errorMessage: "Please enter a valid icon.",
						default: "fa fa-check",
						nullable: true,
					},
				},
				required: ["text"],
			},
			default: [
				{
					text: "Lorem Ipsum",
				},
				{
					text: "Ipsum Lorem",
				},
			],
		},
		cols: {
			type: "object",
			properties: {
				xl: {
					type: "number",
					title: "Desktop +",
					default: 4,
					minimum: 1,
					nullable: true,
				},
				lg: {
					type: "number",
					title: "Desktop",
					default: 4,
					minimum: 1,
					nullable: true,
				},
				md: {
					type: "number",
					title: "Tablet",
					default: 2,
					minimum: 1,
					nullable: true,
				},
				sm: {
					type: "number",
					title: "Mobile",
					default: 1,
					minimum: 1,
					nullable: true,
				},
			},
			nullable: true,
		},
		gap: {
			type: "number",
			title: "Grid Gap",
			default: 4,
			minimum: 1,
			nullable: true,
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
	TG001,
} as const;

export const components = {
	TG001: TG001.Component,
} as const;
