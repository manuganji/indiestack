"use client";
import { useLocalStorage } from "usehooks-ts";
import { getUserOnClient, now } from "./utils";

import type { PublicUser } from "./types";

import { LOCAL_USER, SIGN_IN_PATH, dev } from "@/constants";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

function useOnline() {
	const [isOnline, setIsOnline] = useState(
		typeof navigator !== "undefined" ? navigator.onLine : false,
	);

	const setOnline = () => setIsOnline(true);
	const setOffline = () => setIsOnline(false);

	useEffect(() => {
		window.addEventListener("online", setOnline);
		window.addEventListener("offline", setOffline);

		return () => {
			window.removeEventListener("online", setOnline);
			window.removeEventListener("offline", setOffline);
		};
	}, []);

	return isOnline;
}

export type AuthContextValueType =
	| {
			user: PublicUser;
			status: "authenticated";
	  }
	| { user: null; status: "loading" | "unauthenticated" };

export const AuthContext = createContext?.<AuthContextValueType | undefined>(
	undefined,
);

export function useAuth(options: {
	required?: boolean;
	onUnauthenticated?: () => void;
}) {
	const router = useRouter();
	if (!AuthContext) {
		throw new Error("React Context is unavailable in Server Components");
	}

	const value = useContext(AuthContext);
	if (!value && dev) {
		throw new Error(
			"[next-auth]: `useAuth` must be wrapped in a <SessionProvider />",
		);
	}

	const { required, onUnauthenticated } = options ?? {
		required: false,
		onUnauthenticated: undefined,
	};

	const requiredAndNotLoading = required && value?.status === "unauthenticated";

	useEffect(() => {
		if (requiredAndNotLoading) {
			if (onUnauthenticated) onUnauthenticated();
			else router.push(SIGN_IN_PATH);
		}
	}, [requiredAndNotLoading, onUnauthenticated, router]);

	return value;
}

export function AuthProvider({
	children,
	refetchInterval,
	...props
}: {
	children: React.ReactNode;
	user?: PublicUser | null;
	refetchInterval?: number;
}) {
	const [user, setUser] = useLocalStorage<PublicUser | null>(
		LOCAL_USER,
		props.user ?? null,
	);
	// const [lastSync, setLastSync] = useState(!isNil(props.user) ? now() : 0);
	const [lastSync, setLastSync] = useState(now());
	const [visibility, setVisibility] = useState<"visible" | "hidden">("visible");
	const isOnline = useOnline();
	if (!AuthContext) {
		throw new Error("React Context is unavailable in Server Components");
	}
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (loading) return;
		if (lastSync + (refetchInterval ?? 60) > now()) return;
		if (visibility != "visible" || !isOnline) {
			// console.log("conditions", {
			// 	visibility,
			// 	loading,
			// 	isOnline,
			// });
			return;
		}
		getUserOnClient().then((user) => {
			if (user) {
				setUser(user);
				setLastSync(now());
			}
			setLoading(false);
		});
	}, [visibility, isOnline, lastSync]);

	useEffect(() => {
		// Listen for when the page is visible, if the user switches tabs
		// and makes our tab visible again, re-fetch the session, but only if
		// this feature is not disabled.
		const visibilityHandler = () => {
			setVisibility(document.visibilityState);
		};
		document.addEventListener("visibilitychange", visibilityHandler, false);
		return () =>
			document.removeEventListener("visibilitychange", visibilityHandler, false);
	}, []);

	const value: any = {
		data: user,
		status: loading ? "loading" : user ? "authenticated" : "unauthenticated",
	};

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
