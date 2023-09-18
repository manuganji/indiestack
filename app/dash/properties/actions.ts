"use server";

import { preview, prod } from "@/constants";
import { runQuery } from "@/db";
import { requireAuth, requireRoot } from "@/lib/checks";
import { addDomainToVercel } from "@/lib/domains";
import { shortId } from "@/lib/serverUtils";
import { insert, update } from "zapatos/db";
import { properties } from "zapatos/schema";

export async function insertProperty(data: Omit<properties.Insertable, "id">) {
  requireRoot();
  await requireAuth();

  const property = await runQuery(
    insert("properties", {
      ...data,
      id: shortId(10),
    })
  );
  if (prod || preview) {
    await addDomainToVercel(property.domain);
  }
  return property;
}

export async function updateProperty(data: properties.Updatable, id: string) {
  requireRoot();
  await requireAuth();
  return runQuery(update("properties", data, { id }));
}
