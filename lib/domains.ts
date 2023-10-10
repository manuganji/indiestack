import { runQuery } from "@/db";
import {
	DomainConfigResponse,
	DomainResponse,
	DomainVerificationResponse,
} from "@/lib/types";
import { cache } from "react";
import { PgPropertySettings } from "zapatos/custom";
import { insert, selectExactlyOne, sql } from "zapatos/db";
import { properties } from "zapatos/schema";
import { shortId } from "./utils";
import { DEFAULT_FEATURES } from "@/constants";

export const insertDomain = async (domain: string, name?: string) => {
	const property = await runQuery(
		insert("properties", {
			id: shortId(10),
			domain,
			name: name ?? domain,
		}),
	);
	await runQuery(
		insert(
			"feature_flags",
			Array.from(DEFAULT_FEATURES).map((f) => ({
				property: property.id,
				feature: f,
			})),
		),
	);
	return property;
};

export const getDomain = cache(
	async (params: { domain: string; withSettings?: boolean }) => {
		const { domain: ipDomain, withSettings = false } = params ?? {};
		let domain: string = decodeURIComponent(ipDomain);
		// console.log("get current property", domain);
		try {
			const property = await runQuery(
				selectExactlyOne(
					"properties",
					{
						domain,
					},
					withSettings
						? {}
						: {
								columns: ["domain", "id", "name"],
								extras: {
									settings: sql<properties.SQL, PgPropertySettings>`'{}'::jsonb`,
								},
						  },
				),
			);
			return property;
		} catch (e) {
			// console.error(e);
			const property = insertDomain(domain);
			return property;
		}
	},
);

export const getDomainSettings = cache(async (domain: string) => {
	const property = await runQuery(
		selectExactlyOne(
			"properties",
			{
				domain,
			},
			{
				columns: ["settings"],
			},
		),
	);
	return property;
});

export const addDomainToVercel = async (domain: string) => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains?teamId=${process.env.TEAM_ID_VERCEL}`,
		{
			body: JSON.stringify({ name: domain }),
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
				"Content-Type": "application/json",
			},
			method: "POST",
		},
	).then((res) => res.json());
};

export const removeDomainFromVercelProject = async (domain: string) => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
			},
			method: "DELETE",
		},
	).then((res) => res.json());
};

export const removeDomainFromVercelTeam = async (domain: string) => {
	return await fetch(
		`https://api.vercel.com/v6/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
		{
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
			},
			method: "DELETE",
		},
	).then((res) => res.json());
};

export const getDomainResponse = async (
	domain: string,
): Promise<DomainResponse & { error: { code: string; message: string } }> => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}?teamId=${process.env.TEAM_ID_VERCEL}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
				"Content-Type": "application/json",
			},
		},
	).then((res) => {
		return res.json();
	});
};

export const getConfigResponse = async (
	domain: string,
): Promise<DomainConfigResponse> => {
	return await fetch(
		`https://api.vercel.com/v6/domains/${domain}/config?teamId=${process.env.TEAM_ID_VERCEL}`,
		{
			method: "GET",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
				"Content-Type": "application/json",
			},
		},
	).then((res) => res.json());
};

export const verifyDomain = async (
	domain: string,
): Promise<DomainVerificationResponse> => {
	return await fetch(
		`https://api.vercel.com/v9/projects/${process.env.PROJECT_ID_VERCEL}/domains/${domain}/verify?teamId=${process.env.TEAM_ID_VERCEL}`,
		{
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.VERCEL_AUTH_BEARER_TOKEN}`,
				"Content-Type": "application/json",
			},
		},
	).then((res) => res.json());
};

export const getSubdomain = (name: string, apexName: string) => {
	if (name === apexName) return null;
	return name.slice(0, name.length - apexName.length - 1);
};

export const getApexDomain = (url: string) => {
	let domain;
	try {
		domain = new URL(url).hostname;
	} catch (e) {
		return "";
	}
	const parts = domain.split(".");
	if (parts.length > 2) {
		// if it's a subdomain (e.g. dub.vercel.app), return the last 2 parts
		return parts.slice(-2).join(".");
	}
	// if it's a normal domain (e.g. dub.sh), we return the domain
	return domain;
};

// courtesy of ChatGPT: https://sharegpt.com/c/pUYXtRs
export const validDomainRegex = new RegExp(
	/^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/,
);
