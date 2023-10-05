"use client";

import DeclarativeForm from "@/components/forms";
import { Button } from "@/components/ui/button";
import { propertySchema, propertySettingsSchema } from "@/schemas";
import { useRouter } from "next/navigation";
import { insertProperty, updateProperty } from "./actions";

export default function PropertyForm({
	id,
	defaultValues,
}: {
	id?: string;
	defaultValues?: Partial<{
		name: string;
		domain: string;
	}>;
}) {
	const router = useRouter();
	const schema = structuredClone(propertySchema);
	schema.properties.settings = propertySettingsSchema;
	
	return (
		<div>
			<h1 className="text-2xl my-2">{id ? "Update Property" : "New Property"}</h1>
			<DeclarativeForm
				schema={schema}
				initialData={defaultValues}
				method="POST"
				className="gap-2 flex flex-col"
				onSubmit={async (data, setErrors) => {
					if (!id) {
						await insertProperty(data);
					} else {
						await updateProperty(data, id);
					}
					router.push("/dash/properties");
					router.refresh();
				}}
			>
				{/* <FormField
							control={form.control}
							name="email_from"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email From</FormLabel>
									<FormControl>
										<Input placeholder="someone@example.com" {...field} />
									</FormControl>
								</FormItem>
							)}
						></FormField> */}
				<Button type="submit">Save</Button>
			</DeclarativeForm>
		</div>
	);
}
