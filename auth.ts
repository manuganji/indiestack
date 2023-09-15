import {
  conditions as dc,
  deletes,
  insert,
  parent,
  selectExactlyOne,
  selectOne,
  sql,
  update,
} from "zapatos/db";
import type {
  accounts,
  sessions,
  users,
  verification_tokens,
} from "zapatos/schema";
import { runQuery, runQueryTxn } from "./db";
// import { sendWelcomeMail } from "./serverSideUtils";
import {
  deltaFromNow,
  getCurrentProperty,
  sendWelcomeMail,
} from "@/lib/serverUtils";
import { cookies } from "next/headers";
import {
  LONG_SESSION_COOKIE,
  SECS_IN_DAY,
  SESSION_COOKIE,
  prod,
} from "./constants";
import { DEFAULT_AUTH_DURATION, LONG_AUTH_DURATION } from "./serverConstants";

// const SC_ORG_ID = env.SC_ORG_ID;

export const findVerificatonToken = async function (
  identifier: string,
  token: string
) {
  const res = await runQuery(
    selectOne("verification_tokens", {
      identifier,
      token,
      expires: dc.gte(sql`LOCALTIMESTAMP(0)`),
    })
  );
  return res ?? null;
};

export async function logUserIn(email: string) {
  const isLongSession = cookies().get(LONG_SESSION_COOKIE)?.value === "true";
  const user = await getUserByEmail(email);
  if (!user) {
    throw new Error("User not found");
  }
  // send welcome email if user is new

  if (!user.welcomed) {
    await sendWelcomeMail({
      email: user.email,
      firstName: user.first_name,
    });
    await runQuery(update("users", { welcomed: true }, { id: user.id }));
  }

  const [session, _] = await createSession({
    user_id: user.id,
    expires: isLongSession
      ? deltaFromNow(LONG_AUTH_DURATION)
      : deltaFromNow(DEFAULT_AUTH_DURATION),
    property: user.property,
  });

  cookies().set(SESSION_COOKIE, session.session_token, {
    path: "/",
    secure: prod,
    httpOnly: true,
    sameSite: "lax",
    expires: Date.parse(session.expires),
  });
  return session;
}

export const createUser = async function createUser(user: users.Insertable) {
  const property = await getCurrentProperty();
  return runQuery(
    insert("users", {
      ...user,
      property: property.id,
    })
  );
};

export const createSession = async function (session: sessions.Insertable) {
  return runQueryTxn(async (txNClient) => {
    return Promise.all([
      insert("sessions", session, {
        returning: ["session_token", "user_id", "expires"],
      }).run(txNClient),
      update(
        "users",
        {
          last_logged_in: sql`now()`,
        },
        {
          id: session.user_id,
        }
      ).run(txNClient),
    ]);
  });
};

export const deleteSession = async function (
  sessionToken: sessions.JSONSelectable["session_token"]
) {
  return runQuery(
    deletes("sessions", {
      session_token: sessionToken,
    })
  );
};

export const createVerificationToken = async function (
  item: verification_tokens.Insertable
) {
  return runQuery(insert("verification_tokens", item));
};

export const updateUser = async (user: users.JSONSelectable) => {
  return runQuery(
    update("users", user, {
      property: user.property,
      id: user.id,
    })
  );
};

export const deleteUser = async (userId: string) => {
  const property = await getCurrentProperty();
  runQuery(deletes("users", { id: userId, property: property.id }));
};

export const useVerificationToken = async function ({
  identifier,
  token,
}: {
  identifier: string;
  token: string;
}) {
  const property = await getCurrentProperty();
  const [item, ...res] = await runQuery(
    update(
      "verification_tokens",
      { expires: sql`LOCALTIMESTAMP(0)` },
      {
        identifier,
        token,
        expires: dc.gte(sql`LOCALTIMESTAMP(0)`),
        property: property.id,
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
};

export const getUser = async function getUser(id: string) {
  return runQuery(selectOne("users", { id }));
};

export const getUserByEmail = async (email: string) => {
  const property = await getCurrentProperty();
  return runQuery(selectOne("users", { email, property: property.id }));
};

export const getSessionAndUser = async function getSessionAndUser(
  session_token: string
) {
  const res = await runQuery(
    selectOne(
      "sessions",
      {
        session_token,
        expires: dc.gt(sql`LOCALTIMESTAMP(0)`),
      },
      {
        lateral: {
          user: selectOne("users", {
            id: parent("user_id"),
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
    user,
  };
};

export const getUserByAccount = async function ({
  provider,
  providerAccountId,
}: {
  provider: string;
  providerAccountId: string;
}) {
  const property = await getCurrentProperty();
  const account = await runQuery(
    selectExactlyOne(
      "accounts",
      {
        provider_account_id: providerAccountId,
        provider,
        property: property.id,
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
  return account.user;
};

export const linkAccount = async (account: accounts.Insertable) => {
  return runQuery(insert("accounts", account));
};

export const unlinkAccount = async ({
  provider_account_id,
  provider,
}: accounts.Selectable) => {
  const property = await getCurrentProperty();
  return runQuery(
    deletes("accounts", {
      provider_account_id,
      provider,
      property: property.id,
    })
  );
};
export const updateSession = async function ({
  session_token,
  expires,
}: sessions.Selectable) {
  const [session, ..._] = await runQuery(
    update(
      "sessions",
      { expires },
      { session_token },
      {
        returning: ["session_token", "user_id", "expires"],
      }
    )
  );
  return session;
};
