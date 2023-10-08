import { Layout, UISchemaElement, VerticalLayout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";

type PropsType = {
	text: string;
};

export const title = "Plain Text";

export const schema: JSONSchemaType<PropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "T001",
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

export const Component = function T001({ text }: PropsType) {
	return <div className="flex p-10 items-center">{text}</div>;
};
