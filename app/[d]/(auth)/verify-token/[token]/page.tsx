"use client";
import { useRouter } from "next/navigation";
import { Fragment, useEffect, useState } from "react";
import { verifyToken } from "./actions";
import DeclarativeForm from "@/components/forms";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { SIGN_IN_PATH } from "@/constants";
import { reconfirmEmailSchema } from "@/schemas";
import Link from "next/link";

export default function VerifyEmail({
	params: { token },
	searchParams: { redirectUrl },
}: {
	params: { token: string };
	searchParams: { redirectUrl?: string };
}) {
	const router = useRouter();
	const [status, setStatus] = useState<{
		reconfirm?: boolean;
		success?: boolean;
		error?: string;
	}>({ reconfirm: false, success: false });

	useEffect(() => {
		verifyToken(token).then((res) => {
			setStatus(res);
		});
	}, [token]);

	useEffect(() => {
		// console.log("status", status);
		if (status?.success) {
			// @ts-ignore
			router.push(redirectUrl || "/");
		}
	}, [status?.success, redirectUrl, router]);

	return (
		<Card className="mx-auto max-w-md my-20 p-4">
			<CardHeader>
				<CardTitle>Verify and Sign In</CardTitle>
				<CardDescription>
					{status.reconfirm &&
						`Looks like you've opened the link in a different browser. Please re-confirm
        your email address.`}
					{status.success &&
						`Thanks for signing up. We are excited to see what you'll build.`}
				</CardDescription>
			</CardHeader>
			<CardContent>
				{status.reconfirm && (
					<DeclarativeForm
						schema={reconfirmEmailSchema}
						method="POST"
						className="gap-2 flex flex-col"
						onSubmit={async (data, setErrors) => {
							const res = await verifyToken(token, data.email);
							if (res?.errors) {
								setErrors(res.errors);
							}
							if (res?.success) {
								setStatus(res);
							}
						}}
					>
						{/* <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input placeholder="someone@example.com" {...field} />
										</FormControl>
										<FormDescription></FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/> */}
						<Button type="submit">Submit</Button>
						{/* </form> */}
					</DeclarativeForm>
				)}
				{"error" in status && (
					<Fragment>
						<h2>{status.error}</h2>
						<br />
						<Button type="button">
							<Link href={SIGN_IN_PATH}>Sign In</Link>
						</Button>
					</Fragment>
				)}
				{status?.success && <h2>Success</h2>}
			</CardContent>
		</Card>
	);
}
