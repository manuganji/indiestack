/*
** Please edit this file as needed **
It's been generated by Zapatos as a custom type definition placeholder, and won't be overwritten
*/

declare module "zapatos/custom" {
	import type * as db from "zapatos/db";
	export interface PgPropertySettings {
		auth: {
			allowSignUp: boolean;
			allowSignIn: boolean;
		};
		email: {
			emailFrom: string;
			emailFromName: string;
		};
		analytics: {
			googleAnalyticsId: string;
		};
	}
}
