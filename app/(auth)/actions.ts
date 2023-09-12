"use server";

import { createUser, createVerificationToken } from "@/auth";
import { DEFAULT_AUTH_DURATION } from "@/constants";
import {
  deltaFromNow,
  getCurrentProperty,
  getHostName,
  makeAbsoluteUrl,
  sendMailOnSignUp,
  sendWelcomeMail,
} from "@/lib/serverUtils";
import {
  DEFAULT_TOKEN_DURATION,
  TOKEN_IDENTIFIER_COOKIE,
} from "@/serverConstants";
import { cookies } from "next/headers";
import { insert } from "zapatos/db";

export async function signUpAction(data: {
  email: string;
  firstName: string;
  lastName: string;
}) {
  const property = await getCurrentProperty();

  try {
    await createUser({
      property: property.id,
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
    });
  } catch (e) {
    return {
      success: false,
      message: "User already exists",
    };
  }
  const { token } = await createVerificationToken({
    expires: deltaFromNow(DEFAULT_TOKEN_DURATION),
    identifier: data.email,
    property: property.id,
  });
  cookies().set(TOKEN_IDENTIFIER_COOKIE, data.email, {
    expires: deltaFromNow(DEFAULT_TOKEN_DURATION),
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  await sendMailOnSignUp({
    email: data.email,
    firstName: data.firstName,
    blockUrl: makeAbsoluteUrl(`block/${data.email}/`),
    url: makeAbsoluteUrl(`/verify-email/${token}/`),
  });
  return {
    success: true,
  };
}
