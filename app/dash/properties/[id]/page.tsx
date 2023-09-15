import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { runQuery } from "@/db";
import { select, selectExactlyOne } from "zapatos/db";
import PropertyForm from "../PropertyForm";

export default async function PropertyHome({
  params: { id },
}: {
  params: {
    id: string;
  };
}) {
  const property = await runQuery(selectExactlyOne("properties", { id }));
  return <PropertyForm defaultValues={property} id={property.id} />;
}
