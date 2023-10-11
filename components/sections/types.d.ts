import { Layout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";
import type { ReactPlayerProps } from "react-player";

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

export type ComponentConfig<T> = {
	title: string;
	desc?: string;
	uiSchema?: Layout;
	schema: JSONSchemaType<T>;
	variants: { [code: string]: VariantConfig };
};

export type VariantConfig = {
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

export type VideoPropsType = Pick<
	ReactPlayerProps,
	| "url"
	| "playing"
	| "loop"
	| "controls"
	| "volume"
	| "muted"
	| "width"
	| "height"
	| "pip"
	| "playbackRate"
	| "light"
> & {
	url: string;
};

export type ImgPropsType = {
	img: string; // url to image
};

export type PropsType = TextPropsType | ImgPropsType | VideoPropsType;
