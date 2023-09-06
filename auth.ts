import { HttpStatusCode } from "axios";
import { add } from "date-fns";
import {
  all,
  conditions as dc,
  deletes,
  insert,
  parent,
  selectExactlyOne,
  selectOne,
  sql,
  update,
} from "zapatos/db";
import type { accounts, users } from "zapatos/schema";
import {
  DEFAULT_SESSION_DURATION,
  LONG_SESSION_COOKIE,
  LONG_SESSION_DURATION,
  SECS_IN_DAY,
  SESSION_COOKIE,
  SIGN_IN_PATH,
} from "./constants";
import { runQuery } from "./db";
// import { sendWelcomeMail } from "./serverSideUtils";
import { getHostName } from "@/lib/utils";
import { NextAuthOptions } from "next-auth";
import { Adapter, AdapterAccount, AdapterUser } from "next-auth/adapters";
import Email from "next-auth/providers/email";
// const SC_ORG_ID = env.SC_ORG_ID;
import camelcaseKeys from "camelcase-keys";
import decamelizeKeys from "decamelize-keys";

export const getUserByAccount = ({
  provider_account_id,
  provider,
}: {
  provider_account_id: string;
  provider: string;
}) =>
  runQuery(
    selectOne("users", all, {
      lateral: {
        account: selectOne("accounts", {
          user_id: parent("id"),
          provider_account_id,
          provider,
        }),
      },
    })
  );

const mapUsers = function (user: users.JSONSelectable) {
  return {
    ...user,
    emailVerified: user.email_verified ? new Date(user.email_verified) : null,
  } satisfies AdapterUser;
};

const findVerificatonToken = async function (
  identifier: string,
  token: string
) {
  const res = await runQuery(
    selectOne("verification_tokens", {
      token,
      expires: dc.gte(sql`LOCALTIMESTAMP(0)`),
    })
  );
  return res
    ? {
        ...res,
      }
    : null;
};

// export async function logUserIn(email: string, cookies: Cookies) {
//   const isLongSession = cookies.get(LONG_SESSION_COOKIE) === "true";
//   const user = await getUserByEmail(email);
//   if (!user) {
//     throw new Error("User not found");
//   }
//   // send welcome email if user is new

//   if (!user.welcomed) {
//     await sendWelcomeMail({
//       email: user.email,
//       firstName: user.first_name,
//     });
//     await runQuery(update("users", { welcomed: true }, { id: user.id }));
//   }

//   const session = await createSession({
//     user_id: user.id,
//     expires: isLongSession
//       ? add(Date.now(), LONG_SESSION_DURATION)
//       : add(Date.now(), DEFAULT_SESSION_DURATION),
//   });

//   // cookies.delete(LONG_SESSION_COOKIE);
//   // cookies.delete(EMAIL_COOKIE);
//   cookies.set(SESSION_COOKIE, session.session_token, {
//     path: "/",
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//     sameSite: "lax",
//     maxAge: isLongSession
//       ? LONG_SESSION_DURATION.days * SECS_IN_DAY
//       : DEFAULT_SESSION_DURATION.days * SECS_IN_DAY,
//   });
//   return session;
// }

const authAdapter: Adapter = {
  createUser: async function createUser(user: Omit<AdapterUser, "id">) {
    const domain = getHostName();
    const res = await runQuery(
      insert("users", {
        ...user,
        domain,
      })
    );
    return mapUsers(res);
  },
  createSession: async function (session) {
    const res = await runQuery(
      // async (txNClient) => {
      // await update(
      //   "users",
      //   {
      //     email_verified: true,
      //     last_login: sql`LOCALTIMESTAMP(0)`,
      //   },
      //   { id: session.userId }
      // ).run(txNClient);
      // return await
      insert(
        "sessions",
        {
          ...decamelizeKeys(session),
          domain: getHostName(),
        },
        {
          returning: ["session_token", "user_id", "expires"],
        }
      )
      // .run(txNClient);
    );
    return {
      ...camelcaseKeys(res),
      expires: new Date(res.expires),
    };
  },
  deleteSession: async function (sessionToken) {
    await runQuery(
      deletes("sessions", {
        domain: getHostName(),
        session_token: sessionToken,
      })
    );
  },
  createVerificationToken: async function (params) {
    const res = await runQuery(
      insert("verification_tokens", {
        domain: getHostName(),
        ...params,
      })
    );
    return {
      ...res,
      expires: new Date(res.expires),
    };
  },
  updateUser: async (user) => {
    const res = await runQuery(
      update("users", decamelizeKeys(user), {
        domain: getHostName(),
        id: user.id,
      })
    );
    return camelcaseKeys(mapUsers(res[0])) as AdapterUser;
  },
  deleteUser: async (userId: string) => {
    runQuery(deletes("users", { id: userId, domain: getHostName() }));
  },
  useVerificationToken: async function ({ identifier, token }) {
    const [item, ...res] = await runQuery(
      update(
        "verification_tokens",
        { expires: sql`LOCALTIMESTAMP(0)` },
        {
          identifier,
          token,
          expires: dc.gte(sql`LOCALTIMESTAMP(0)`),
          domain: getHostName(),
        },
        {
          returning: ["identifier", "token", "expires"],
        }
      )
    );
    if (!item) {
      throw new Error("Verification token invalid or expired");
    }
    return {
      ...item,
      expires: new Date(item.expires),
    };
  },
  getUser: async function getUser(id: string) {
    const user = await runQuery(
      selectOne("users", { id, domain: getHostName() })
    );
    return user ? mapUsers(user) : null;
  },
  getUserByEmail: async (email: string) => {
    const user = await runQuery(
      selectOne("users", { email, domain: getHostName() })
    );
    return user ? mapUsers(user) : null;
  },
  getSessionAndUser: async function getSessionAndUser(session_token: string) {
    const res = await runQuery(
      selectOne(
        "sessions",
        {
          session_token,
          expires: dc.gt(sql`LOCALTIMESTAMP(0)`),
          domain: getHostName(),
        },
        {
          lateral: {
            user: selectOne("users", {
              id: parent("user_id"),
              domain: getHostName(),
            }),
          },
        }
      )
    );
    if (!res) return null;

    const { user, ...session } = res;

    if (!user) return null;

    return {
      session: {
        ...session,
        sessionToken: session.session_token,
        userId: session.user_id,
        expires: new Date(session.expires),
      },
      user: mapUsers(user),
    };
  },
  getUserByAccount: async function ({ provider, providerAccountId }) {
    const user = await runQuery(
      selectExactlyOne(
        "accounts",
        {
          provider_account_id: providerAccountId,
          provider,
          domain: getHostName(),
        },
        {
          lateral: {
            user: selectExactlyOne("users", {
              id: parent("user_id"),
            }),
          },
        }
      )
    );
    return mapUsers(user.user);
  },
  linkAccount: async ({
    provider,
    providerAccountId: provider_account_id,
    userId: user_id,
    type,
    access_token,
    refresh_token,
    expires_at,
    id_token,
    scope,
    session_state,
    token_type,
  }: AdapterAccount) => {
    await runQuery(
      insert("accounts", {
        domain: getHostName(),
        provider,
        type,
        provider_account_id,
        user_id,
        token_type,
        access_token,
        expires_at,
        id_token,
        refresh_token,
        scope,
        session_state,
      })
    );
  },
  unlinkAccount: async ({
    providerAccountId: provider_account_id,
    provider,
  }) => {
    await runQuery(
      deletes("accounts", {
        provider_account_id,
        provider,
        domain: getHostName(),
      })
    );
  },
  updateSession: async function ({ sessionToken: session_token, expires }) {
    const [session] = await runQuery(
      update(
        "sessions",
        { expires },
        { session_token, domain: getHostName() },
        {
          returning: ["session_token", "user_id", "expires"],
        }
      )
    );
    return {
      ...camelcaseKeys(session),
      expires: new Date(session.expires),
    };
  },
};

export const authOptions: NextAuthOptions = {
  providers: [Email({})],
  adapter: authAdapter,
  pages: {
    signIn: "/auth/sign-in/",
    newUser: "/",
    signOut: "/auth/sign-out/",
    error: "/auth/error/",
    verifyRequest: "/auth/verify/",
  },
  session: {
    strategy: "database",
  },
};
