import { Layout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";

export type ComponentConfig<T> = {
	title: string;
	desc?: string;
	uiSchema?: Layout;
	schema: JSONSchemaType<T>;
	variants: { [code: string]: VariantConfig<T> };
};

export type VariantConfig<T> = {
	title: string;
	desc?: string;
};

export type VariantComponents<T> = {
	[code: string]: React.FunctionComponent<T>;
};

export type Variants<T> = {
	[code: string]: ComponentConfig<T>;
};

export type TextPropsType = {
	text: string;
};

export type ImgPropsType = {
	img: string; // url to image
};

export type PropsType = TextPropsType | ImgPropsType;
