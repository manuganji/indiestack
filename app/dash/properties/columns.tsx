"use client";

import { ColumnDef } from "@tanstack/react-table";
import { properties } from "zapatos/schema";

export const columns: ColumnDef<properties.JSONSelectable>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
