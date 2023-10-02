"use client";

import { ModeToggle } from "@/components/ModeToggle";
import { Toaster } from "@/components/ui/toaster";
import { Fragment } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
	// {/* <ThemeProvider> */}

	// {/* </ThemeProvider> */}
	return (
		<Fragment>
			<div className="place-self-end p-2">
				<ModeToggle />
			</div>
			<Toaster />
			{children}
		</Fragment>
	);
}
