import isEmpty from "lodash/isEmpty";
import {
	findUISchema,
	Generate,
	isObjectControl,
	RankedTester,
	rankWith,
	StatePropsOfControlWithDetail,
} from "@jsonforms/core";
import { JsonFormsDispatch, withJsonFormsDetailProps } from "@jsonforms/react";
import { useMemo } from "react";

export const ObjectRenderer = ({
	renderers,
	cells,
	uischemas,
	schema,
	label,
	path,
	visible,
	enabled,
	uischema,
	rootSchema,
}: StatePropsOfControlWithDetail) => {
	const detailUiSchema = useMemo(
		() =>
			findUISchema(
				uischemas || [],
				schema,
				uischema.scope,
				path,
				() =>
					isEmpty(path)
						? Generate.uiSchema(schema, "VerticalLayout")
						: { ...Generate.uiSchema(schema, "Group"), label },
				uischema,
				rootSchema,
			),
		[uischemas, schema, uischema.scope, path, label, uischema, rootSchema],
	);
	return (
		<JsonFormsDispatch
			visible={visible}
			enabled={enabled}
			schema={schema}
			uischema={detailUiSchema}
			path={path}
			renderers={renderers}
			cells={cells}
		/>
	);
};

export const ObjectControlTester: RankedTester = rankWith(2, isObjectControl);

export default withJsonFormsDetailProps(ObjectRenderer);
