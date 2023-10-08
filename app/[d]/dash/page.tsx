import { SIGN_IN_PATH } from "@/constants";
import { getHostName, getUserOnServer } from "@/lib/serverUtils";
import { redirect } from "next/navigation";
import PropertyDashHome from "./PropertyDash";
import RootDashHome from "./RootDash";

export default async function Dashboard() {
	const user = await getUserOnServer();
	const domain = getHostName();
	const isRoot = domain === process.env.ROOT_DOMAIN;
	if (!user) {
		redirect(SIGN_IN_PATH);
	}

	// console.log("status", auth?.status);
	if (isRoot) {
		return <RootDashHome />;
	} else {
		return <PropertyDashHome />;
	}
}
