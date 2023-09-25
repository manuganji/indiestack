import { SIGN_IN_PATH } from "@/constants";
import { getCurrentProperty } from "@/lib/serverUtils";
import { redirect } from "next/navigation";
import { Fragment, ReactNode } from "react";

export default async function SignUpLayout({
	children,
}: {
	children: ReactNode;
}) {
	const property = await getCurrentProperty(true);
	if (!property.settings?.auth.allowSignUp) {
		redirect(SIGN_IN_PATH);
	}
	return <Fragment>{children}</Fragment>;
}
