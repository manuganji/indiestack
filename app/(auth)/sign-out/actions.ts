"use server";

import {
	createUser,
	createVerificationToken,
	getUserByEmail,
	logUserIn,
	useVerificationToken,
} from "@/auth";
import { LONG_SESSION_COOKIE, POST_AUTH_REDIRECT_URL, prod } from "@/constants";
import {
	deltaFromNow,
	getCurrentProperty,
	isBlockedEmail,
	isDisposableEmail,
	makeAbsoluteUrl,
	sendMagicLink,
	sendMailOnSignUp,
} from "@/lib/serverUtils";
import {
	DEFAULT_TOKEN_DURATION,
	TOKEN_IDENTIFIER_COOKIE,
} from "@/serverConstants";
import { cookies } from "next/headers";
import { z } from "zod";
import { emailSignInSchema, signUpSchema } from "../schemas";

export async function signUpAction(data: {
	email: string;
	firstName: string;
	lastName: string;
	redirectUrl?: string;
}) {
	const property = await getCurrentProperty();
	const insertable = signUpSchema.parse(data);

	const { email, firstName } = insertable;
	if ((await isDisposableEmail(email)) || (await isBlockedEmail(email))) {
		return {
			error: "Unable to sign you up. This email address is not allowed.",
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
			return {
				error: "A user with this email already exists. Maybe Sign In instead?",
				...insertable,
				exists: true,
			};
		}
		return { error: "Server Error. Please try again or contact support." };
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

export const verifyToken = async function (token: string, email?: string) {
	console.log("cookie value", cookies().get(TOKEN_IDENTIFIER_COOKIE)?.value);
	const identifier = cookies().get(TOKEN_IDENTIFIER_COOKIE)?.value || email;

	if (!identifier) {
		return {
			reconfirm: true,
		};
	} else {
		cookies().delete(TOKEN_IDENTIFIER_COOKIE);
	}

	try {
		// eslint-disable-next-line react-hooks/rules-of-hooks
		await useVerificationToken({ identifier, token });
	} catch (e) {
		return {
			error: "This link is invalid or expired. Please try again.",
		};
	}
	await logUserIn(identifier);
	return {
		success: true,
	};
};

export const emailSignIn = async function ({
	email: data,
	redirectUrl = POST_AUTH_REDIRECT_URL,
}: {
	email: string;
	redirectUrl?: string;
}) {
	// try {
	// 	await checkCaptchaToken(data);
	// } catch (e) {
	// 	console.log('Error verifying captcha token: ', e);
	// 	return fail(HttpStatusCode.BadRequest, {
	// 		error: 'Bot verification failed. Please contact support if you believe this is an error.',
	// 		email
	// 	});
	// }
	// const longSession = data.get("remember-me") as string;
	const longSession = "false";
	let email: string;
	try {
		email = emailSignInSchema.parse({
			email: data,
		}).email;
	} catch (e) {
		if (e instanceof z.ZodError) {
			return {
				error: "Invalid email address",
			};
		} else {
			throw e;
		}
	}
	if ((await isDisposableEmail(email)) || (await isBlockedEmail(email))) {
		return {
			error: "Unable to log you in. This email address is not allowed.",
		};
	}
	const user = await getUserByEmail(email);
	if (!user) {
		return {
			error: "Unable to log you in. Are you sure you have an account with us?",
			email,
		};
	}
	// store long session preference in cookie
	cookies().set(LONG_SESSION_COOKIE, longSession || "false", {
		maxAge: 60 * 60, // 1 hour
		secure: prod,
		path: "/",
	});
	// store email in cookie
	cookies().set(TOKEN_IDENTIFIER_COOKIE, email, {
		maxAge: 60 * 60, // 1 hour
		secure: prod,
		path: "/",
		sameSite: "lax",
		httpOnly: true,
	});

	const property = await getCurrentProperty();
	const vtoken = await createVerificationToken({
		identifier: email,
		expires: deltaFromNow(DEFAULT_TOKEN_DURATION),
		property: property.id,
	});
	const url = makeAbsoluteUrl(
		`/verify-token/${vtoken.token}/?redirectUrl=${redirectUrl}`,
	);
	const blockUrl = makeAbsoluteUrl(`/block-emails/${vtoken.token}`);

	try {
		await sendMagicLink({ email, url, firstName: user.first_name, blockUrl });
		return {
			success: true,
		};
	} catch (e) {
		console.log("Error sending verification email: ", e);
		return {
			error: "Unable to send verification email. Please try again later.",
		};
	}
};
