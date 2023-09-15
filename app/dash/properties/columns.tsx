"use client";

import { ColumnDef, createColumnHelper } from "@tanstack/react-table";
import Link from "next/link";
import { properties } from "zapatos/schema";

const columnHelper = createColumnHelper<properties.JSONSelectable>();
export const columns: ColumnDef<properties.JSONSelectable>[] = [
  // columnHelper.display({}),
  {
    accessorKey: "id",
    header: () => "ID",
    cell: ({ row }) => (
      <Link href={`/dash/properties/${row.original.id}/`}>
        {row.original.id}
      </Link>
    ),
  },
  {
    accessorKey: "domain",
    header: "Domain",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email_from",
    header: "Default Email From",
  },
];
