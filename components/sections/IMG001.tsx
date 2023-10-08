import { VerticalLayout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";

type PropsType = {
	img: string; // url to image
};

export const title = "Image";

export const schema: JSONSchemaType<PropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: "IMG001",
	type: "object",
	title: "Image",
	description: "",
	properties: {
		img: {
			type: "string",
			format: "uri",
			title: "URL",
			errorMessage: "Paste in the image url.",
			default: "https://images.pexels.com/photos/479454/pexels-photo-479454.jpeg?cs=srgb&dl=pexels-icon-com-479454.jpg&fm=jpg&w=640&h=960",
		},
	},
	required: ["img"],
	errorMessage: {
		required: {
			img: "Paste in the image url.",
		},
	},
};

// export const uiSchema: VerticalLayout = {
// 	type: "VerticalLayout",
// 	elements: [
// 		{
// 			type: "Control",
// 			// @ts-ignore
// 			scope: "#/properties/img",
// 		},
// 	],
// };

export const Component = function IMG001({ img }: PropsType) {
	return <img src={img} />;
};
