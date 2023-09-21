"use client";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SIGN_IN_PATH } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signUpAction } from "./actions";
import { signUpSchema } from "../schemas";
import { defaults } from "lodash";

export default function SignUp({
	searchParams,
}: {
	searchParams: {
		email?: string;
		firstName?: string;
		lastName?: string;
	};
}) {
	const [status, setStatus] = useState<{
		success?: boolean;
		attempted: boolean;
		message?: string;
		error?: string;
	}>({ success: false, attempted: false });
	const form = useForm({
		resolver: zodResolver(signUpSchema),
		defaultValues: defaults({}, searchParams, {
			email: "",
			firstName: "",
			lastName: "",
		}),
		mode: "onTouched",
		progressive: true,
	});

	let content;
	if (status.success) {
		content = (
			<p>
				Thanks for signing up! Click the link sent to your inbox to activate your
				account.
			</p>
		);
	} else {
		content = (
			<Form {...form}>
				<form
					method="POST"
					className="gap-2 flex flex-col"
					onSubmit={form.handleSubmit(async (data) => {
						const res = await signUpAction(data);
						console.log(res);
						setStatus({
							...res,
							attempted: true,
						});
						if (res?.error) {
							form.setError("email", {
								message: res.error,
							});
						}
					})}
				>
					<FormField
						control={form.control}
						name="firstName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>First Name</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="lastName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Last Name</FormLabel>
								<FormControl>
									<Input type="text" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						name="email"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input type="email" placeholder="someone@example.com" {...field} />
								</FormControl>
								<FormDescription></FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type="submit" variant="default">
						Sign Up
					</Button>
				</form>
			</Form>
		);
	}
	return (
		<Card className="mx-auto mt-20 max-w-md">
			<CardHeader>
				<CardTitle>Sign Up</CardTitle>
				<CardDescription>
					No password to remember.{" "}
					<Link
						className="text-gray-700 hover:text-gray-600 font-bold"
						href={SIGN_IN_PATH}
					>
						Sign In
					</Link>{" "}
					instead
				</CardDescription>
			</CardHeader>
			<CardContent>{content}</CardContent>

			<CardFooter className="flex gap-2 text-xs">
				<span className="text-sm">By clicking Sign Up, you agree to our </span>
				<Link className=" text-xs underline" href="/privacy">
					Privacy Policy
				</Link>
				&amp;
				<Link className=" text-xs underline" href="/terms-conditions">
					Terms
				</Link>
			</CardFooter>
		</Card>
	);
}
