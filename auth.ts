import {
	conditions as dc,
	deletes,
	insert,
	parent,
	select,
	selectExactlyOne,
	selectOne,
	sql,
	update,
	upsert,
} from "zapatos/db";
import type {
	accounts,
	org_members,
	sessions,
	users,
	verification_tokens,
} from "zapatos/schema";
import { runQuery, runQueryTxn } from "./db";
// import { sendWelcomeMail } from "./serverSideUtils";
import { deltaFromNow, getHostName, sendWelcomeMail } from "@/lib/serverUtils";
import { cookies } from "next/headers";
import { LONG_SESSION_COOKIE, SESSION_COOKIE, prod } from "./constants";
import { DEFAULT_AUTH_DURATION, LONG_AUTH_DURATION } from "./serverConstants";
import { getDomain } from "./lib/domains";
import { shortId } from "./lib/utils";

// const SC_ORG_ID = env.SC_ORG_ID;

export const findVerificatonToken = async function (
	identifier: string,
	token: string,
) {
	const res = await runQuery(
		selectOne("verification_tokens", {
			identifier,
			token,
			expires: dc.gte(sql`LOCALTIMESTAMP(0)`),
		}),
	);
	return res ?? null;
};

export const getUserByEmail = async (email: string) => {
	const property = await getDomain({ domain: getHostName() });
	return runQuery(selectOne("users", { email, property: property.id }));
};

export const getOneUserOrg = (userId: string) => {
	return runQuery(
		selectOne(
			"org_members",
			{
				user: userId,
			},
			{
				columns: ["org"],
			},
		),
	);
};

export const updateLastOrg = async (userId: string, orgId: string) => {
	return runQuery(
		update(
			"users",
			{
				last_org: orgId,
			},
			{
				id: userId,
			},
		),
	);
};

export const addUserToOrg = async (
	userId: string,
	orgId: string,
	role?: org_members.Insertable["role"],
) => {
	return runQuery(
		insert("org_members", {
			user: userId,
			org: orgId,
			role: role ?? "admin.user",
		}),
	);
};

export const removeUserFromOrg = async (userId: string, orgId: string) => {
	return runQueryTxn(async (client) => {
		await Promise.all([
			// remove user from org
			deletes("org_members", {
				user: userId,
				org: orgId,
			}).run(client),
			// update last used org
			update(
				"users",
				{
					last_org: null,
				},
				{
					id: userId,
					last_org: orgId,
				},
			).run(client),
			// remove sessions with this org
			deletes("sessions", {
				user_id: userId,
				org: orgId,
			}).run(client),
		]);
	});
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

	// get last used org
	let orgId: org_members.JSONSelectable["org"] | null = user.last_org;
	if (!orgId) {
		const oneOrg = await getOneUserOrg(user.id);
		orgId = oneOrg?.org ?? null;
	}

	// create session
	const [session, _] = await createSession({
		user_id: user.id,
		org: orgId,
		expires: isLongSession
			? deltaFromNow(LONG_AUTH_DURATION)
			: deltaFromNow(DEFAULT_AUTH_DURATION),
		property: user.property,
	});

	// update last used org
	if (orgId) {
		try {
			updateLastOrg(user.id, orgId);
		} catch (e) {
			console.log(e);
		}
	}

	cookies().set(SESSION_COOKIE, session.session_token, {
		path: "/",

		// https://developer.mozilla.org/en-US/docs/Web/HTTP/Cookies#define_where_cookies_are_sent
		// If Domain is specified, then subdomains are always included.
		// Therefore, specifying Domain is less restrictive than omitting it.

		secure: prod,
		httpOnly: true,
		sameSite: "lax",
		expires: Date.parse(session.expires),
	});
	return session;
}

export async function logUserOut() {
	await runQuery(
		deletes("sessions", { session_token: cookies().get(SESSION_COOKIE)?.value }),
	);
	cookies().delete(SESSION_COOKIE);
	cookies().delete(LONG_SESSION_COOKIE);
}

export function hasSessionCookie() {
	return cookies().has(SESSION_COOKIE);
}

export const createUser = async function createUser(user: users.Insertable) {
	const property = await getDomain({
		domain: getHostName(),
		withSettings: true,
	});
	return runQueryTxn(async (client) => {
		const newUser = await insert("users", {
			...user,
			property: property.id,
		}).run(client);
		const newOrgId = shortId();
		await Promise.all([
			insert("orgs", {
				id: newOrgId,
				name: "Personal",
				property: property.id,
			}).run(client),
			insert(
				"org_members",
				property.settings!.auth.defaultRoles.map((r) => ({
					org: newOrgId,
					user: newUser.id,
					role: r,
				})),
			).run(client),
		]);
		return newUser;
	});
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
				},
			).run(txNClient),
		]);
	});
};

export const deleteSession = async function (
	sessionToken: sessions.JSONSelectable["session_token"],
) {
	return runQuery(
		deletes("sessions", {
			session_token: sessionToken,
		}),
	);
};

export const createVerificationToken = async function (
	item: verification_tokens.Insertable,
) {
	return runQuery(insert("verification_tokens", item));
};

export const updateUser = async (user: users.JSONSelectable) => {
	return runQuery(
		update("users", user, {
			property: user.property,
			id: user.id,
		}),
	);
};

export const deleteUser = async (userId: string) => {
	const property = await getDomain({ domain: getHostName() });
	runQuery(deletes("users", { id: userId, property: property.id }));
};

export const useVerificationToken = async function ({
	identifier,
	token,
}: {
	identifier: string;
	token: string;
}) {
	const property = await getDomain({ domain: getHostName() });
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
			},
		),
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

export const getSessionAndUser = async function getSessionAndUser(
	session_token: string,
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
					org: selectOne("orgs", {
						id: parent("org"),
					}),
				},
			},
		),
	);
	if (!res) return null;

	const { user, org, ...session } = res;

	if (!user) return null;

	return {
		session: {
			...session,
			sessionToken: session.session_token,
			userId: session.user_id,
			expires: new Date(session.expires),
		},
		org,
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
	const property = await getDomain({ domain: getHostName() });
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
			},
		),
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
	const property = await getDomain({ domain: getHostName() });
	return runQuery(
		deletes("accounts", {
			provider_account_id,
			provider,
			property: property.id,
		}),
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
			},
		),
	);
	return session;
};
