import { PublicUser } from "@/components/auth/types";
import { SESSION_COOKIE } from "@/constants";
import { runQuery } from "@/db";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";

import { parent, selectExactlyOne, selectOne } from "zapatos/db";

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

export const GET = async (req: NextRequest): Promise<NextResponse> => {
  const res = await getUserOnServer();
  // if (!res) {
  //   const session = await runQuery(
  //     insert("sessions", {
  //       domain: getHostName(),
  //       expires: add(new Date(), { days: 1 }),
  //       data: {},
  //     })
  //   );

  //   cookies().set(SESSION_COOKIE, session.session_token, {
  //     sameSite: "lax",
  //     path: "/",
  //     httpOnly: true,
  //     secure: prod,
  //   });
  //   return NextResponse.json(session.data);
  // }
  return NextResponse.json(res);
};
