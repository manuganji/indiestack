import { SCHEMA_IDS } from "@/components/sections/ids";
import { metadata } from "@/components/sections/index";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { PgPageSectionCode } from "zapatos/custom";

export function WidgetSelector({
	cat,
	selected,
	onWidgetSelect,
}: {
	selected?: PgPageSectionCode;
	cat: keyof typeof metadata;
	onWidgetSelect: (code: PgPageSectionCode) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const { title, desc, variants } = metadata[cat];
	const numVariants = Object.keys(variants).length;
	return (
		<Collapsible open={isOpen} onOpenChange={setIsOpen} className="w-full">
			<div className="flex items-center justify-between w-full">
				<h4 className="text-sm font-semibold">
					{/* @ts-ignore */}
					{selected ? metadata[cat].variants[selected].title : title}
				</h4>
				<CollapsibleTrigger asChild>
					<Button variant="ghost" size="sm">
						<CaretSortIcon className="h-4 w-4" />
						<span className="sr-only">Toggle</span>
					</Button>
				</CollapsibleTrigger>
			</div>
			{/* <div className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm">
				{selected ? metadata[cat].variants[selected].title : desc}
			</div> */}
			<CollapsibleContent className="gap-2 flex flex-col my-2">
				{Object.entries(variants).map(([code, { title }]) => (
					<Button
						variant={"outline"}
						key={code}
						onClick={() => {
							onWidgetSelect(code as PgPageSectionCode);
							setIsOpen(false);
						}}
						// className="rounded-md border px-4 py-2 font-mono text-sm shadow-sm"
					>
						{title}
					</Button>
				))}
			</CollapsibleContent>
		</Collapsible>
	);
}
export default function WidgetCategories({
	onWidgetSelect,
}: {
	onWidgetSelect: (widget: PgPageSectionCode) => void;
}) {
	const sortedCats = Object.keys(metadata).sort((a, b) =>
		a.localeCompare(b),
	) as Array<keyof typeof SCHEMA_IDS>;

	return (
		<div className="grid grid-cols-3 gap-1">
			{sortedCats.map((cat) => (
				<WidgetSelector cat={cat} onWidgetSelect={onWidgetSelect} key={cat} />
			))}
		</div>
	);
}
