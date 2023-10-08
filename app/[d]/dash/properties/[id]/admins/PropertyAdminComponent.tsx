"use client";

import { columns } from "@/app/[d]/dash/users/columns";
import { DataTable } from "@/components/table";
import DeclarativeForm from "@/components/forms";
import { Button } from "@/components/ui/button";
import { addAdminSchema } from "@/schemas";
import { useRouter, useSearchParams } from "next/navigation";
import { properties, users } from "zapatos/schema";
import { addAdmin, deleteAdmin } from "./actions";

export default function PropertyAdminComponent({
	property,
	admins,
}: {
	property: properties.JSONSelectable;
	admins: users.JSONSelectable[];
}) {
	const router = useRouter();
	return (
		<div className="flex flex-col gap-2 my-4">
			<DataTable
				data={admins}
				columns={[
					...columns,
					{
						accessorKey: "is_admin",
						header: "Admin",
					},
					{
						accessorKey: "delete",
						header: "Delete",
						cell(props) {
							return (
								<Button
									onClick={async () => {
										await deleteAdmin(props.row.original.email, property.id);
										router.refresh();
									}}
								>
									Delete
								</Button>
							);
						},
					},
				]}
			/>
			<h2 className="font-bold text-xl mt-2">Add Admin</h2>
			<DeclarativeForm
				schema={addAdminSchema}
				onSubmit={async (data) => {
					await addAdmin(data.email, property.id);
					router.refresh();
				}}
			>
				<Button type="submit">Save</Button>
			</DeclarativeForm>
		</div>
	);
}
