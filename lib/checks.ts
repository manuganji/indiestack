import { redirect } from "next/navigation";
import { getHostName, getUserOnServer } from "./serverUtils";
import { SIGN_IN_PATH } from "@/constants";
import { logUserOut } from "@/auth";

export async function requireAdmin() {
	const user = await getUserOnServer();
	if (!user?.is_admin) {
		logUserOut();
		redirect(SIGN_IN_PATH);
	}
	return user;
}

export function requireRoot() {
	const isRoot = getHostName() === process.env.ROOT_DOMAIN;
	if (!isRoot) {
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
