"use client";
import "./forms.css";
import { JsonForms } from "@jsonforms/react";
import type { JsonSchema7 } from "@jsonforms/core/lib/models/jsonSchema7";
import type { ErrorObject } from "ajv";
import { useEffect, useMemo, useRef, useState } from "react";
import validators from "@/schemas/validators";
import {
	JsonFormsStyleContext,
	vanillaCells,
	vanillaRenderers,
} from "@jsonforms/vanilla-renderers";
import { vanillaStyles } from "./styles";
import { dev } from "@/constants";

function transformError(error: ErrorObject): ErrorObject {
	if (error.params.errors[0].keyword === "required") {
		// console.log(error);
		const newError = structuredClone(error);
		newError.params = error.params.errors[0].params;
		newError.keyword = "required";
		return newError;
	}
	return error;
}

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
	const [errors, setErrors] = useState<Array<ErrorObject>>([]);
	const [isValid, setIsValid] = useState<boolean>(false);
	let mounted = useRef(false);
	return (
		<JsonFormsStyleContext.Provider
			value={{
				styles: vanillaStyles,
			}}
		>
			<JsonForms
				config={{
					restrict: false,
					trim: true,
					showUnfocusedDescription: true,
					hideRequiredAsterisk: true,
				}}
				schema={schema}
				data={data}
				cells={vanillaCells}
				renderers={vanillaRenderers}
				onChange={({ data }) => {
					setData(data);
					setIsValid(validator(data));
					if (!mounted.current) {
						mounted.current = true;
						if (dev) console.log("ready");
						return;
					}
					if (validator?.errors) {
						// @ts-ignore
						setErrors(validator.errors?.map(transformError));
					} else {
						setErrors([]);
					}
					// consider it touched only after the first pass.
				}}
				validationMode="NoValidation"
				// @ts-ignore
				additionalErrors={errors}
			/>
		</JsonFormsStyleContext.Provider>
	);
}
