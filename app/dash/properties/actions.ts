"use server";

import { runQuery } from "@/db";
import { shortId } from "@/lib/serverUtils";
import { insert, update } from "zapatos/db";
import { properties } from "zapatos/schema";

export async function insertProperty(data: Omit<properties.Insertable, "id">) {
  return runQuery(
    insert("properties", {
      ...data,
      id: shortId(10),
    })
  );
}

export async function updateProperty(data: properties.Updatable, id: string) {
  return runQuery(update("properties", data, { id }));
}
