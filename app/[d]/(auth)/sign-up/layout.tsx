import { SIGN_IN_PATH } from "@/constants";
import { getDomain, getDomainSettings } from "@/lib/domains";

import { redirect } from "next/navigation";
import { Fragment, ReactNode } from "react";

export default async function SignUpLayout({
	params,
	children,
}: {
	params: { d: string };
	children: ReactNode;
}) {
	const property = await getDomainSettings(params.d);
	if (!property.settings?.auth.allowSignUp) {
		redirect(SIGN_IN_PATH);
	}
	return <Fragment>{children}</Fragment>;
}
