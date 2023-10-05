"use client";
import { JsonForms } from "@jsonforms/react";
import {
	JsonFormsStyleContext,
	vanillaCells,
	vanillaRenderers,
} from "@jsonforms/vanilla-renderers";
import type { ErrorObject, JSONSchemaType } from "ajv";
import { DataValidateFunction } from "ajv/dist/types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { validate } from "./actions";
import "./forms.css";
import { customRenders } from "./renderers";
import { vanillaStyles } from "./styles";

function transformError(
	error: NonNullable<DataValidateFunction["errors"]>[number],
) {
	if (
		error?.params &&
		"errors" in error.params &&
		error.params.errors[0].keyword === "required"
	) {
		// console.log(error);
		const newError = structuredClone(error);
		newError.params = error.params.errors[0].params;
		newError.keyword = "required";
		// console.log(newError);
		return newError;
	}
	return error;
}

export default function DeclarativeForm<T>({
	schema,
	initialData,
	onSubmit,
	method = "POST",
	className,
	children,
}: {
	schema: JSONSchemaType<T>;
	initialData?: Partial<T>;
	onSubmit?: (
		data: T,
		setErrors: Dispatch<
			SetStateAction<
				Partial<ErrorObject<string, Record<string, any>, unknown>>[] | undefined
			>
		>,
	) => void | Promise<void>;
	method?: "POST" | "GET";
	className?: string;
	children?: React.ReactNode;
}) {
	const [data, setData] = useState<T>(initialData || ({} as any));
	const [errors, setErrors] = useState<DataValidateFunction["errors"]>([]);
	let mounted = useRef(false);
	return (
		<form
			method={method}
			className={className}
			onSubmit={async (e) => {
				e.preventDefault();
				// server action to validate data
				const {
					valid,
					errors,
					data: validatedData, // @ts-ignore
				} = await validate(schema.$id!, data);
				if (onSubmit && valid) {
					setData(validatedData);
					await onSubmit(validatedData, setErrors);
				} else {
					setData(validatedData);
					setErrors(errors?.map(transformError));
				}
			}}
		>
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
					// @ts-ignore
					schema={schema}
					data={data}
					cells={vanillaCells}
					renderers={[...vanillaRenderers, ...customRenders]}
					onChange={async ({ data }) => {
						setData(data);
					}}
					validationMode="NoValidation"
					// @ts-ignore
					additionalErrors={errors}
				/>
			</JsonFormsStyleContext.Provider>
			{children}
		</form>
	);
}
