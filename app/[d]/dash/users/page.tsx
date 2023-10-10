import { runQuery } from "@/db";
import { select } from "zapatos/db";
import { columns } from "./columns";
import { DataTable } from "@/components/table";
import { getDomain } from "@/lib/domains";

export default async function UsersHome({
	params: { d },
}: {
	params: { d: string };
}) {
	const property = await getDomain({ domain: d });
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
			},
		),
	);
	return (
		<div className="container mx-auto py-10">
			<h1 className="text-2xl font-bold mb-4">Users</h1>
			<DataTable columns={columns} data={users} />
		</div>
	);
}
