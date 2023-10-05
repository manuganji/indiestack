"use client";
import DeclarativeForm from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SIGN_IN_PATH } from "@/constants";
import { signUpSchema } from "@/schemas/index";
import Link from "next/link";
import { useState } from "react";
import { signUpAction } from "./actions";
import { useToast } from "@/components/ui/use-toast";

export default function SignUp({
	searchParams,
}: {
	searchParams: {
		email?: string;
		firstName?: string;
		lastName?: string;
	};
}) {
	const { toast } = useToast();
	const [status, setStatus] = useState<{
		success?: boolean;
		attempted: boolean;
		message?: string;
		error?: string;
	}>({ success: false, attempted: false });

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
			<DeclarativeForm
				schema={signUpSchema}
				method="POST"
				className="gap-2 flex flex-col"
				initialData={searchParams}
				onSubmit={async (data, setErrors) => {
					const res = await signUpAction(data);
					setStatus({
						...res,
						attempted: true,
					});

					if (res?.errors) {
						setErrors(res?.errors);
					}
					if (res?.error) {
						toast({
							description: res?.error,
						});
					}
				}}
			>
				<Button type="submit" variant="default">
					Sign Up
				</Button>
			</DeclarativeForm>
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
