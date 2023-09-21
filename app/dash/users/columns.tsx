"use client";

import { ColumnDef } from "@tanstack/react-table";
import { users } from "zapatos/schema";

export const columns: ColumnDef<users.JSONSelectable>[] = [
	{
		accessorKey: "id",
		header: "ID",
		enableHiding: true,
	},
	{
		accessorKey: "first_name",
		header: "First Name",
		enableHiding: true,
	},
	{
		accessorKey: "last_name",
		header: "Last Name",
		enableHiding: true,
	},
	{
		accessorKey: "email",
		header: "Email",
		enableHiding: true,
	},
	{
		accessorKey: "email_verified",
		header: "Email Verified",
		enableHiding: true,
	},
	{
		accessorKey: "created_at",
		header: "Created At",
		enableHiding: true,
	},
	{
		accessorKey: "last_logged_in",
		header: "Last Logged In",
		enableHiding: true,
	},
];
