import "server-only";

import { runQuery } from "@/db";
import { headers } from "next/headers";
import { upsert } from "zapatos/db";

export const getHostName = () => {
  return headers().get("host")!;
};

export const upsertDomain = async (domain: string, name?: string) => {
  try {
    const res = await runQuery(
      upsert(
        "properties",
        {
          domain,
          name: name ?? domain,
        },
        {
          value: "properties_pkey",
        }
      )
    );
    return res;
  } catch (e) {
    console.log(e);
  }
};
