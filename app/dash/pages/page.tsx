import { DataTable } from "@/components/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { runQuery } from "@/db";
import { getCurrentProperty } from "@/lib/serverUtils";
import Link from "next/link";
import { Suspense } from "react";
import { select } from "zapatos/db";
import { columns } from "./columns";

const PagesTable = async function () {
	const currentProperty = await getCurrentProperty();
	const pages = await runQuery(
		select("pages", {
			property: currentProperty.id,
		}),
	);

	return <DataTable columns={columns} data={pages} />;
};

export default async function PagesAdmin() {
	return (
		<div className="flex flex-col gap-4 w-full mt-4 mx-4">
			<div className="flex justify-between">
				<h1 className="text-2xl font-bold my-2">Pages</h1>

				<form action="/dash/pages/new/" method="POST">
					<Button type="submit">New Page</Button>
				</form>
			</div>
			List of Pages Edit, Delete
			<Suspense
				fallback={
					<div className="flex-col justify-around gap-4">
						<Skeleton className="h-4 bg-gray-400"></Skeleton>
						<Skeleton className="h-96 bg-gray-400"></Skeleton>
					</div>
				}
			>
				<PagesTable />
			</Suspense>
		</div>
	);
}
