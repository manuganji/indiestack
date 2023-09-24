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
import { SIGN_UP_PATH } from "@/constants";
import { loginSchema } from "@/schemas";
import { loginValidator } from "@/schemas/validators";
import Link from "next/link";
import { useState } from "react";
import { emailSignIn } from "./actions";

export default function SignIn({}: {}) {
	const [status, setStatus] = useState<{
		success?: boolean;
		attempted?: "email" | "simple";
		message?: string;
		error?: string;
	}>({});

	const successEmail = status?.success && status?.attempted === "email";

	const formEl = !successEmail && (
		<DeclarativeForm
			schema={loginSchema}
			validator={loginValidator}
			method="POST"
			className="gap-2 flex flex-col"
			onSubmit={async (data, setErrors) => {
				const res = await emailSignIn(data);
				if (res?.errors) {
					setErrors(res.errors);
					return;
				}
				setStatus({
					...res,
					attempted: "email",
				});
			}}
		>
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
		</DeclarativeForm>
	);

	return (
		<Card className="mx-auto mt-20">
			<CardHeader>
				<CardTitle>Sign In</CardTitle>
				<CardDescription>
					No password to remember.{" "}
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
