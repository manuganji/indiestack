import { redirect } from "next/navigation";
import { getHostName, getUserOnServer } from "./serverUtils";
import { SIGN_IN_PATH } from "@/constants";
import { logUserOut } from "@/auth";

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
