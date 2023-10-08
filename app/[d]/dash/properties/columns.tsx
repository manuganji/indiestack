"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { properties } from "zapatos/schema";

const columnHelper = createColumnHelper<properties.JSONSelectable>();
export const columns: ColumnDef<properties.JSONSelectable>[] = [
	// columnHelper.display({}),
	{
		accessorKey: "admins",
		header: "",
		cell: ({ row }) => (
			<Link href={`/dash/properties/${row.original.id}/admins/`}>Admins</Link>
		),
	},
	{
		accessorKey: "settings",
		header: "",
		cell: ({ row }) => (
			<Link href={`/dash/properties/${row.original.id}/`}>Settings</Link>
		),
	},
	{
		accessorKey: "id",
		header: () => "ID",
	},
	{
		accessorKey: "domain",
		header: "Domain",
	},
	{
		accessorKey: "name",
		header: "Name",
	},
];
