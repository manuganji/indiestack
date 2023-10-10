import { redirect } from "next/navigation";
import { getHostName, getUserOnServer } from "./serverUtils";
import { SIGN_IN_PATH } from "@/constants";
import { logUserOut } from "@/auth";
import { param, selectExactlyOne, selectOne, sql } from "zapatos/db";
import { PgFeatureCode, PgOrgRole } from "zapatos/custom";
import { runQuery } from "@/db";
import { features, org_members } from "zapatos/schema";

export async function requireAdmin() {
	const user = await getUserOnServer();
	if (!user?.is_admin) {
		console.error("User is not admin", user);
		logUserOut();
		redirect(SIGN_IN_PATH);
	}
	return user;
}

export function isRoot() {
	return getHostName() === process.env.ROOT_DOMAIN;
}

export function requireRoot() {
	if (!isRoot()) {
		throw new Error("You are not allowed to perform this action");
	}
}

export async function requireAuth() {
	const user = await getUserOnServer();
	if (!user) {
		redirect(SIGN_IN_PATH);
	}
	return user;
}

export async function requirePropertyFeature(
	feature: PgFeatureCode,
	property: string,
) {
	const res = await runQuery(
		selectOne("feature_flags", {
			property,
			feature: sql<features.SQL>`feature @>${param(feature)}`,
			status: true,
		}),
	);
	if (!res) {
		throw new Error("This feature is not enabled on this property");
	}
}

export async function requireOrgRole(role: PgOrgRole, org: string) {
	const user = await getUserOnServer();
	const res = await runQuery(
		selectOne("org_members", {
			org,
			role: sql<org_members.SQL>`role @>${param(role)}`,
			user: user?.id,
		}),
	);
	if (!res) {
		throw new Error(
			"This user doesn't have the required permissions in this org",
		);
	}
}
