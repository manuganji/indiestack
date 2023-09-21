"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { ZodSchema, z } from "zod";
import { insertProperty, updateProperty } from "./actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { shortId } from "@/lib/serverUtils";

export const formSchema = z.object({
	domain: z.string().nonempty(),
	name: z.string().nonempty(),
	email_from: z.string().email().nonempty(),
});

type FormValues = z.infer<typeof formSchema>;

export default function PropertyForm({
	id,
	defaultValues,
}: {
	id?: string;
	defaultValues?: FormValues;
}) {
	const router = useRouter();
	const form = useForm({
		resolver: zodResolver(formSchema),
		defaultValues: defaultValues ?? {
			domain: "",
			name: "",
			email_from: "",
		},
	});

	return (
		<div>
			<h1 className="text-2xl my-2">
				{id ? "Update Property" : "New Property"}
			</h1>
			<Form {...form}>
				<form
					className="space-y-4"
					onSubmit={form.handleSubmit(async (data: FormValues) => {
						if (!id) {
							const res = await insertProperty(data);
						} else {
							const res = await updateProperty(data, id);
						}
						router.push("/dash/properties");
						router.refresh();
					})}
				>
					<FormField
						control={form.control}
						name="domain"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Domain</FormLabel>
								<FormControl>
									<Input placeholder="example.com" {...field} />
								</FormControl>
							</FormItem>
						)}
					></FormField>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem>
								<FormLabel>Property Name</FormLabel>
								<FormControl>
									<Input placeholder="App" {...field} />
								</FormControl>
							</FormItem>
						)}
					></FormField>
					<FormField
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
					></FormField>
					<Button type="submit">Save</Button>
				</form>
			</Form>
		</div>
	);
}
