"use server";

import { runQuery } from "@/db";
import { requireAdmin, requireRoot } from "@/lib/checks";
import { update } from "zapatos/db";

export const addAdmin = async function (email: string, property: string) {
	await Promise.all([requireRoot(), requireAdmin()]);
	await runQuery(
		update(
			"users",
			{
				is_admin: true,
			},
			{
				email,
				property,
			},
		),
	);
	return {
		success: true,
	};
};

export const deleteAdmin = async function (email: string, property: string) {
	await Promise.all([requireRoot(), requireAdmin()]);
	await runQuery(
		update(
			"users",
			{
				is_admin: false,
			},
			{
				email,
				property,
			},
		),
	);
  return {
    success: true,
  };
};
