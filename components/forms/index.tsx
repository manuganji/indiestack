"use client";
import { JsonForms } from "@jsonforms/react";
import type { JsonSchema7 } from "@jsonforms/core/lib/models/jsonSchema7";
import type { ErrorObject } from "ajv";
import { useMemo, useState } from "react";
import validators from "@/schemas/validator";
import { vanillaCells, vanillaRenderers } from "@jsonforms/vanilla-renderers";

export default function Form({
	schema,
	initialData,
}: {
	schema: JsonSchema7 & {
		$id: keyof typeof validators;
	};
	initialData?: object;
}) {
	const validator = useMemo(() => validators[schema.$id], [schema.$id]);
	const [data, setData] = useState<object>(initialData ?? {});
	const [errors, setErrors] = useState<Array<ErrorObject> | undefined>();
	const [isValid, setIsValid] = useState<boolean>(false);
	return (
		<JsonForms
			schema={schema}
			data={data}
			cells={vanillaCells}
			renderers={vanillaRenderers}
			onChange={({ data }) => {
				setData(data);
				setIsValid(validator(data));
				// @ts-ignore
				setErrors(validator.errors);
			}}
			validationMode="NoValidation"
			// @ts-ignore
			additionalErrors={errors}
		/>
	);
}
