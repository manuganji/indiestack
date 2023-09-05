import { headers } from "next/headers";
import { notFound } from "next/navigation";
import "server-only";

export const getPage = async function (path?: string) {
  const hostname = headers().get("host");
  console.log("From func", hostname, path);
  const INT_HOST = "app.localhost:3000";
  const INT_PATH = "some/thing3";

  if (hostname == INT_HOST && path == INT_PATH) {
    notFound();
  }
  return {
    title: "Great Page",
    body: [
      {
        type: "COVER",
        content: "Best Page",
      },
    ],
    updated: new Date().toJSON(),
  };
};
