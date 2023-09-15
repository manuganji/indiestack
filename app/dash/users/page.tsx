import { runQuery } from "@/db";
import { getCurrentProperty } from "@/lib/serverUtils";
import { select } from "zapatos/db";
import { columns } from "./columns";
import { DataTable } from "./table";

export default async function UsersHome() {
  const property = await getCurrentProperty();
  const users = await runQuery(
    select(
      "users",
      {
        property: property.id,
      },
      {
        order: {
          by: "created_at",
          direction: "DESC",
        },
      }
    )
  );
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Users</h1>
      <DataTable columns={columns} data={users} />
    </div>
  );
}
