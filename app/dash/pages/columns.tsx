"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { pages } from "zapatos/schema";

const columnHelper = createColumnHelper<pages.JSONSelectable>();
export const columns: ColumnDef<pages.JSONSelectable>[] = [
	{
		accessorKey: "title",
		enableColumnFilter: true,
		enableSorting: true,
		cell({
			row: {
				original: { id, title },
			},
		}) {
			return <Link href={`/dash/pages/${id}`}>{title}</Link>;
		},
	},
	{
		accessorKey: "path",
		enableSorting: true,
		cell({
			row: {
				original: { path },
			},
		}) {
			return <Link href={`/${path}`}>{path}</Link>;
		},
	},
	{
		enableHiding: true,
		accessorKey: "created_at",
	},
	{ enableHiding: true, accessorKey: "updated_at" },
];
