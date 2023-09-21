"use server";

import { logUserIn, useVerificationToken } from "@/auth";
import { TOKEN_IDENTIFIER_COOKIE } from "@/serverConstants";
import { cookies } from "next/headers";

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
