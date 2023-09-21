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
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { SIGN_UP_PATH } from "@/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { emailSignIn } from "./actions";
import { emailSignInSchema, signInSchema } from "../schemas";

export default function SignIn({}: {}) {
	const [status, setStatus] = useState<{
		success?: boolean;
		attempted?: "email" | "simple";
		message?: string;
		error?: string;
	}>({});

	const form = useForm<z.infer<typeof signInSchema>>({
		resolver: zodResolver(signInSchema),
		defaultValues: {
			email: "",
			username: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof signInSchema>) => {
		if ("email" in data) {
			const res = await emailSignIn(data);
			console.log(res);
			setStatus({
				...res,
				attempted: "email",
			});
			if (res?.error) {
				form.setError("email", {
					message: res.error,
				});
			}
		} else {
			console.log("simple sign in");
		}
	};

	const successEmail = status?.success && status?.attempted === "email";

	const formEl = !successEmail && (
		<Form {...form}>
			<form
				method="POST"
				className="gap-2 flex flex-col"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<FormField
					name="email"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input placeholder="someone@example.com" {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<Button type="submit" variant="default">
					Get a magic link
				</Button>

				{/* <FormField
          name="username"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="username" placeholder="username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="button" variant="default">
          Sign In with Apple ID
        </Button>
        <Button type="button" variant="default">
          Sign In with Google ID
        </Button>
        <Button type="button" variant="default">
          Sign In with Microsoft ID
        </Button>*/}
			</form>
		</Form>
	);

	return (
		<Card className="mx-auto mt-20">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					No password to remember.
					<Link
						className="text-gray-700 hover:text-gray-600 font-bold"
						href={SIGN_UP_PATH}
					>
						Sign Up
					</Link>{" "}
					instead
				</CardDescription>
			</CardHeader>
			<CardContent>
				{successEmail && <p>Click the link in your email to login.</p>}
				{formEl}
			</CardContent>
			<CardFooter className="flex gap-2 text-xs">
				<span className="text-sm">By clicking Sign In, you agree to our </span>
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
