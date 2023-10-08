"use client";

import { Toaster } from "@/components/ui/toaster";
import { Fragment } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	// {/* <ThemeProvider> */}

	// {/* </ThemeProvider> */}
	return (
		<Fragment>
			<Toaster />
			{children}
		</Fragment>
	);
}
