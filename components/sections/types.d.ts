import { Layout } from "@jsonforms/core";
import { JSONSchemaType } from "ajv";
import type { ReactPlayerProps } from "react-player";
import { PgPageSectionCode } from "zapatos/custom";

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

export type VariantComponents = Map<PgPageSectionCode, React.FunctionComponent>;

export type Variants = {
	[code: PgPageSectionCode]: ComponentConfig<T>;
};

export type TextGridPropsType = {
	cols?: {
		xl?: number;
		lg?: number;
		md?: number;
		sm?: number;
	};
	items: Array<{
		text: string;
		icon?: string;
	}>;
	gap?: number;
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

export type ImageTextPropsType = {
	margin?: {
		x?: number;
		y?: number;
	};
	padding?: {
		x?: number;
		y?: number;
	};
	gap?: number;
	justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
	items?: "start" | "center" | "end" | "stretch" | "baseline";
	text: string;
	img: {
		src: string; // url to image
		left?: boolean;
		radius?: number;
		alt?: string;
		width?: number;
		height?: number;
	};
};

export type HeroPropsType = {
	justify?: "start" | "center" | "end" | "between" | "around" | "evenly";
	items?: "start" | "center" | "end" | "stretch" | "baseline";
	text: string;
	padding?: {
		x?: number;
		y?: number;
	};
	img?: {
		src: string; // url to image
		radius?: number;
		alt?: string;
		width?: number;
		height?: number;
	};
};

export type ImgPropsType = {
	img: string; // url to image
};

export type PropsType =
	| TextPropsType
	| ImgPropsType
	| VideoPropsType
	| ImageTextPropsType
	| HeroPropsType;
