"use client";

import { ColumnDef } from "@tanstack/react-table";
import { users } from "zapatos/schema";

export const columns: ColumnDef<users.JSONSelectable>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "first_name",
    header: "First Name",
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
