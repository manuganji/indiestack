"use client";
import { dev } from "@/constants";
import { JsonForms } from "@jsonforms/react";
import {
	JsonFormsStyleContext,
	vanillaCells,
	vanillaRenderers,
} from "@jsonforms/vanilla-renderers";
import { customRenders } from "./renderers";
import type { ErrorObject, JSONSchemaType } from "ajv";
import { DataValidateFunction } from "ajv/dist/types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import "./forms.css";
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
	validator,
	initialData,
	onSubmit,
	method = "POST",
	className,
	children,
}: {
	schema: JSONSchemaType<T>;
	validator: DataValidateFunction;
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
	const [isValid, setIsValid] = useState<boolean>(false);
	let mounted = useRef(false);
	return (
		<form
			method={method}
			className={className}
			onSubmit={async (e) => {
				e.preventDefault();
				if (onSubmit && isValid) {
					await onSubmit(data, setErrors);
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
						const isValid = await validator(data);
						setIsValid(isValid);
						if (!mounted.current) {
							// consider it touched only after the first pass.
							mounted.current = true;
							if (dev) console.log("ready");
							return;
						}
						if (validator?.errors) {
							setErrors(validator.errors?.map(transformError));
						} else {
							setErrors([]);
						}
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
