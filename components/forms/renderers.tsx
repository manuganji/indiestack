import { JsonFormsRendererRegistryEntry } from "@jsonforms/core";
import ObjectRenderer, { ObjectControlTester } from "./ObjectRenderer";

export const customRenders: JsonFormsRendererRegistryEntry[] = [
	// controls
	{
		tester: ObjectControlTester,
		renderer: ObjectRenderer,
	},
];
