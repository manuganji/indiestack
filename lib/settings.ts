import { z } from "zod";

type SettingsType = {
	[group: string]: {
		desc?: string;
		settings: {
			[key: string]: {
				type: "string" | "boolean" | "number" | "image";
				required?: boolean;
				default?: string | boolean | number;
				min?: number;
				max?: number;
				regex?: RegExp;
				desc?: string;
			};
		};
	};
};

const settings: SettingsType = {
	authentication: {
		settings: {
			INVITE_ONLY: {
				type: "boolean",
				default: false,
				desc: "Whether to only allow access to invited users",
			},
		},
	},
	email: {
		settings: {
			EMAIL_FROM: {
				type: "string",
				required: true,
				desc: "The email address that emails will be sent from",
			},
			EMAIL_FROM_NAME: {
				type: "string",
				required: true,
				desc: "The name that emails will be sent from",
			},
		},
	},
	analytics: {
		desc: "Analytics settings",
		settings: {
			GOOGLE_ANALYTICS_ID: {
				type: "string",
				desc: "The ID of your analytics provider",
			},
		},
	},
};

const convertToZodSchema = (root: SettingsType) => {
	const schemaIp: {
		[key: string]: z.ZodType<any, any, any>;
	} = {};
	for (const group in root) {
		const settings = root[group].settings;
		for (const key in settings) {
			const setting = settings[key];
			let base: z.ZodBoolean | z.ZodNumber | z.ZodString;
			switch (setting.type) {
				case "boolean":
					base = z.boolean();
					break;
				case "image":
					base = z.string().url();
					break;
				case "number":
					base = z.number();
					if (setting?.min) {
						base = base.min(setting.min);
					}
					if (setting?.max) {
						base = base.max(setting.max);
					}

					break;
			}
		}
	}
	return z.object(zodSchema);
};
