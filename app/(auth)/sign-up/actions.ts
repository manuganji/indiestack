"use server";

import { createUser, createVerificationToken } from "@/auth";
import { POST_AUTH_REDIRECT_URL, prod } from "@/constants";
import {
	createErrorObject,
	deltaFromNow,
	getCurrentProperty,
	isBlockedEmail,
	isDisposableEmail,
	makeAbsoluteUrl,
	sendMailOnSignUp,
} from "@/lib/serverUtils";
import {
	DEFAULT_TOKEN_DURATION,
	TOKEN_IDENTIFIER_COOKIE,
} from "@/serverConstants";
import { cookies } from "next/headers";
import { signUpValidator } from "@/schemas/validators";

export async function signUpAction(data: {
	email: string;
	firstName: string;
	lastName: string;
	redirectUrl?: string;
}) {
	const property = await getCurrentProperty();
	const isValid = signUpValidator(data);

	if (!isValid) {
		return {
			// @ts-ignore
			errors: signUpValidator?.errors,
			success: false,
		};
	}
	const { email, firstName } = data;
	if ((await isDisposableEmail(email)) || (await isBlockedEmail(email))) {
		return {
			errors: [
				createErrorObject(
					"email",
					"Unable to sign you up. This email address is not allowed.",
				),
			],
			...data,
		};
	}
	const redirectUrl = data?.redirectUrl || POST_AUTH_REDIRECT_URL;

	try {
		await createUser({
			property: property.id,
			email: data.email,
			first_name: data.firstName,
			last_name: data.lastName,
		});
	} catch (e) {
		// @ts-ignore
		if (e.code === "23505") {
			const res = {
				errors: [
					createErrorObject(
						"email",
						"A user with this email already exists. Maybe sign in instead?",
					),
				],
				success: false,
			};
			return res;
		}
		return {
			error: "Server Error. Please try again or contact support.",
			success: false,
		};
	}
	// store email in cookie
	cookies().set(TOKEN_IDENTIFIER_COOKIE, email, {
		maxAge: 60 * 60, // 1 hour
		secure: prod,
		path: "/",
		sameSite: "lax",
		httpOnly: true,
	});

	const vtoken = await createVerificationToken({
		identifier: email,
		expires: deltaFromNow(DEFAULT_TOKEN_DURATION),
		property: property.id,
	});
	const url = makeAbsoluteUrl(
		`/verify-token/${vtoken.token}/?redirectUrl=${redirectUrl}`,
	);
	const blockUrl = makeAbsoluteUrl(`/block-emails/${vtoken.token}`);
	await sendMailOnSignUp({ email, url, firstName, blockUrl });
	return {
		success: true,
	};
}
