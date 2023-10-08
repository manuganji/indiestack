import { getProperty } from "@/lib/serverUtils";
import PropertyForm from "../PropertyForm";

export default async function PropertyHome({
	params: { id },
}: {
	params: {
		id: string;
	};
}) {
	const property = await getProperty(id, true);
	return <PropertyForm defaultValues={property} id={property.id} />;
}
