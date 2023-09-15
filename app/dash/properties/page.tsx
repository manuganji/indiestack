import { runQuery } from "@/db";
import { all, select } from "zapatos/db";
import { columns } from "./columns";
import { DataTable } from "./table";

export default async function PropertiesHome() {
  const properties = await runQuery(
    select("properties", all, {
      order: {
        by: "name",
        direction: "ASC",
      },
    })
  );
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-4">Properties</h1>
      <DataTable columns={columns} data={properties} />
    </div>
  );
}
