"use client";


import DeclarativeForm from "@/components/forms";
import { Button } from "@/components/ui/button";
import { propertySchema } from "@/schemas";
import { propertyValidator } from "@/schemas/validators";
import { useRouter } from "next/navigation";
import { insertProperty, updateProperty } from "./actions";

export default function PropertyForm({
	id,
	defaultValues,
}: {
	id?: string;
	defaultValues?: FormValues;
}) {
	const router = useRouter();

	return (
		<div>
			<h1 className="text-2xl my-2">{id ? "Update Property" : "New Property"}</h1>
			<DeclarativeForm
				schema={propertySchema}
				validator={propertyValidator}
				method="POST"
				className="gap-2 flex flex-col"
				onSubmit={async (data, setErrors) => {
					if (!id) {
						const res = await insertProperty(data);
					} else {
						const res = await updateProperty(data, id);
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
