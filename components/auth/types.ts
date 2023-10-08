import { users } from "zapatos/schema";

export type PublicUser = Pick<
	users.JSONSelectable,
	| "first_name"
	| "last_name"
	| "email"
	| "id"
	| "image"
	| "email_verified"
	| "is_admin"
>;

/**
 * Util type that matches some strings literally, but allows any other string as well.
 * @source https://github.com/microsoft/TypeScript/issues/29729#issuecomment-832522611
 */
export type LiteralUnion<T extends U, U = string> =
	| T
	| (U & Record<never, never>);

export interface SignInOptions extends Record<string, unknown> {
	/**
	 * Specify to which URL the user will be redirected after signing in. Defaults to the page URL the sign-in is initiated from.
	 *
	 * [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl)
	 */
	callbackUrl?: string;
	/** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option) */
	redirect?: boolean;
}

export interface SignInResponse {
	error: string | undefined;
	status: number;
	ok: boolean;
	url: string | null;
}

/** Match `inputType` of `new URLSearchParams(inputType)` */
export type SignInAuthorizationParams =
	| string
	| string[][]
	| Record<string, string>
	| URLSearchParams;

/** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1) */
export interface SignOutResponse {
	url: string;
}

export interface SignOutParams<R extends boolean = true> {
	/** [Documentation](https://next-auth.js.org/getting-started/client#specifying-a-callbackurl-1) */
	callbackUrl?: string;
	/** [Documentation](https://next-auth.js.org/getting-started/client#using-the-redirect-false-option-1 */
	redirect?: R;
}

/** [Documentation](https://next-auth.js.org/getting-started/client#options) */
export interface SessionProviderProps {
	children: React.ReactNode;
	// session?: Session | null;
	/**
	 * A time interval (in seconds) after which the session will be re-fetched.
	 * If set to `0` (default), the session is not polled.
	 */
	refetchInterval?: number;
}
