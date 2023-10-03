/*
** Please edit this file as needed **
It's been generated by Zapatos as a custom type definition placeholder, and won't be overwritten
*/

declare module "zapatos/custom" {
	import type * as db from "zapatos/db";
	type LinkType = {
		type: "link";
		label: string;
		path: string;
    desc?: string;
	};

	type PostButtonType = {
		type: "post";
		label: string;
		path: string;
	};

	// replace with your custom type or interface as desired
	export type PgMenuItems = Array<
		Array<
			| LinkType
			| {
					type: "button";
          label: string;
					path: string;
			  }
			| {
					type: "dropdown";
          desc?: string;
					label: string;
					items: LinkType[];
			  }
			| PostButtonType
		>
	>;
}