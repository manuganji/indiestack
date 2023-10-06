import { JSONSchemaType } from "ajv";
import * as T001 from "./T001";
import { Layout } from "@jsonforms/core";

type ComponentConfig<T> = {
	title: string;
	desc?: string;
	schema: JSONSchemaType<T>;
	uiSchema?: Layout;
	Component: React.FunctionComponent<T>;
};

export const components = {
	T001: T001,
} as const satisfies {
	[code: string]: ComponentConfig<any>;
};
