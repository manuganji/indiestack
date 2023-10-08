import { SESSION_PATH } from "@/constants";
import { PublicUser } from "./types";

export async function getUserOnClient() {
	const user: PublicUser | null = await fetch(`${SESSION_PATH}`)
		.then<PublicUser | null>((res) => {
			// console.log("res", res);
			return res.json();
		})
		.catch((e) => {
			console.error("CLIENT_SESSION_ERROR", "Failed to fetch session", e);
			return null;
		});
	return user;
}
/** Returns the number of seconds elapsed since January 1, 1970 00:00:00 UTC. */
export function now() {
	return Math.floor(Date.now() / 1000);
}
