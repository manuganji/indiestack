import { PublicUser } from "@/components/auth/types";
import { SESSION_COOKIE } from "@/constants";
import { runQuery } from "@/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

import { parent, selectExactlyOne, selectOne } from "zapatos/db";

/**
 * Reads the session cookie and returns the user if it exists.
 * Wrapped with React `cache` so that multiple calls to `getUserOnServer` in a single request
 * will only hit the database once.
 * @returns {Promise<PublicUser | null>} The user or null
 */
export const getUserOnServer = cache(async (): Promise<PublicUser | null> => {
  const session_token_cookie = cookies().get(SESSION_COOKIE);
  // console.log("upsert domain", getHostName());
  // await upsertDomain(getHostName());
  if (!session_token_cookie) {
    return null;
  } else {
    const session = await runQuery(
      selectOne(
        "sessions",
        {
          session_token: session_token_cookie.value,
        },
        {
          lateral: {
            user: selectExactlyOne(
              "users",
              {
                id: parent("user_id"),
              },
              {
                columns: [
                  "email",
                  "id",
                  "name",
                  "image",
                  "email_verified",
                  "is_admin",
                ],
              }
            ),
          },
        }
      )
    );
    return session?.user ?? null;
  }
});

export const GET = async (): Promise<NextResponse> => {
  const res = await getUserOnServer();
  return NextResponse.json(res);
};
