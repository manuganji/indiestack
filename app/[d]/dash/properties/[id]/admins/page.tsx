import { runQuery } from "@/db";
import { getProperty } from "@/lib/serverUtils";
import { select } from "zapatos/db";
import PropertyAdminComponent from "./PropertyAdminComponent";

export default async function PropertyAdmins({
	params: { id },
}: {
	params: { id: string };
}) {
	const admins = await runQuery(
		select("users", {
			property: id,
			is_admin: true,
		}),
	);
	const property = await getProperty(id);
	return (
		<div>
			<h1 className="text-2xl font-bold">Property Admins {property.name}</h1>
			<p className="text-gray-700 font-normal">{property.domain}</p>
			<PropertyAdminComponent property={property} admins={admins} />
		</div>
	);
}
