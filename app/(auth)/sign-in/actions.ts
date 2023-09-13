"use server";

import {
  createVerificationToken,
  getUserByEmail
} from "@/auth";
import { LONG_SESSION_COOKIE, POST_AUTH_REDIRECT_URL, prod } from "@/constants";
import {
  deltaFromNow,
  getCurrentProperty,
  isBlockedEmail,
  isDisposableEmail,
  makeAbsoluteUrl,
  sendMagicLink
} from "@/lib/serverUtils";
import {
  DEFAULT_TOKEN_DURATION,
  TOKEN_IDENTIFIER_COOKIE,
} from "@/serverConstants";
import { cookies } from "next/headers";
import { z } from "zod";
import { emailSignInSchema } from "../schemas";


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
    `/verify-token/${vtoken.token}/?redirectUrl=${redirectUrl}`
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
