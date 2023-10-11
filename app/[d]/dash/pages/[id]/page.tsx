"use client";
import DeclarativeForm from "@/components/forms";
import { components, metadata, metadataKey } from "@/components/sections/index";
import { Button } from "@/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { toast } from "@/components/ui/use-toast";
import { shortId } from "@/lib/utils";
import { pageSchema } from "@/schemas";
import {
	ArrowDownIcon,
	ArrowUpIcon,
	ChevronUpDownIcon,
	PencilIcon,
	TrashIcon,
} from "@heroicons/react/20/solid";
import { get } from "lodash";
import { useParams } from "next/navigation";
import { memo, useEffect, useMemo, useReducer, useState } from "react";
import { JSONValue } from "zapatos/db";
import { pages, sections } from "zapatos/schema";
import { getDefaultConfig, getPageById, savePage } from "./actions";
import WidgetCategories, { WidgetSelector } from "./WidgetCategory";

const MemoizedComponentWrapper = memo(function ComponentWrapper({
	position,
	changeOrder,
	canMoveDown,
	setEditing,
	deleteSection,
	code,
	config,
	id,
}: {
	id: string;
	config: SectionType["config"];
	code: SectionType["code"];
	position: number;
	changeOrder: (id: string, to: number) => void;
	canMoveDown: boolean;
	setEditing: (id: string) => void;
	deleteSection: (id: string) => void;
}) {
	const buttons: Array<{
		icon: React.ComponentType<any>;
		title: string;
		disabled: boolean;
		destructive?: boolean;
		onClick: () => void;
	}> = [
		{
			icon: PencilIcon,
			title: "Edit this section",
			disabled: false,
			onClick: () => setEditing(id),
		},
		{
			icon: ArrowDownIcon,
			title: "Move down",
			disabled: !canMoveDown,
			onClick: () => changeOrder(id, position + 1),
		},
		{
			icon: ArrowUpIcon,
			title: "Move up",
			disabled: position === 0,
			onClick: () => changeOrder(id, position - 1),
		},
		{
			icon: TrashIcon,
			title: "Delete",
			disabled: false,
			destructive: true,
			onClick: () => deleteSection(id),
		},
	];
	/* @ts-ignore */
	const cEl = useMemo(() => components[code](config), [code, config]);
	return (
		<div className="group w-full relative">
			<div
				className="hidden group-hover:flex 
        justify-between
        w-full
        transition-all
        top-0 
        absolute
        gap-1 px-2 py-2"
			>
				<p className="text-gray-200">{code}</p>
				<div className="flex gap-1">
					{buttons.map(({ icon: Icon, title, onClick, disabled, destructive }) => {
						return (
							<Button
								key={title}
								title={title}
								onClick={onClick}
								disabled={disabled}
								variant={destructive ? "destructive" : "outline"}
								className="min-w-fit px-2"
							>
								<Icon className="w-6 h-6" />
							</Button>
						);
					})}
				</div>
			</div>
			{cEl}
		</div>
	);
});

type ActionTypes =
	| {
			type: "deleteSection";
			payload: {
				sectionId: string;
			};
	  }
	| {
			type: "addSection";
			payload: {
				section: {
					id: string;
					code: keyof typeof components;
					order: number;
					config: JSONValue;
				};
			};
	  }
	| {
			type: "changeOrder";
			payload: {
				id: string;
				to: number;
			};
	  }
	| {
			type: "setConfig";
			payload: {
				sectionId: string;
				config: JSONValue;
			};
	  }
	| {
			type: "changeWidget";
			payload: {
				sectionId: string;
				code: keyof typeof components;
			};
	  }
	| {
			type: "setFullPage";
			payload: {
				sections: sections.JSONSelectable[];
			};
	  };

type SectionType = Pick<sections.JSONSelectable, "code" | "config">;

type PageType = Pick<pages.JSONSelectable, "title" | "path" | "id">;

export type StateType = {
	sections: Map<string, SectionType>; // id -> section
	order: {
		[id: string]: number;
	}; // id -> order
};

const getSortedOrder = (state: StateType) =>
	Object.entries(state.order).sort(([_, a], [__, b]) => {
		return a - b;
	});

const getNewOrder = (state: StateType, id: string, to: number) => {
	const sortedOrder = getSortedOrder(state);
	let from: number;

	for (from = 0; from < sortedOrder.length; from++) {
		if (sortedOrder[from][0] == id) {
			break;
		}
	}

	if (to == 0) {
		return sortedOrder[0][1] - 1;
	} else if (to == state.sections.size - 1) {
		return sortedOrder.at(-1)![1] + 1;
	} else if (from > to) {
		return (sortedOrder[to][1] + sortedOrder[to - 1][1]) / 2;
	} else if (from < to) {
		return (sortedOrder[to][1] + sortedOrder[to + 1][1]) / 2;
	} else {
		return sortedOrder[from][1];
	}
};

function reducer(state: StateType, { type, payload }: ActionTypes): StateType {
	switch (type) {
		case "setFullPage": {
			return {
				sections: new Map(
					payload.sections.map(({ id, code, config }) => [id, { code, config }]),
				),
				order: Object.fromEntries(
					payload.sections.map((section) => [section.id, section.order]),
				),
			};
		}
		case "setConfig": {
			const section = state.sections.get(payload.sectionId)!;
			section["config"] = payload.config;
			return {
				...state,
				sections: state.sections.set(payload.sectionId, section),
			};
		}
		case "changeWidget": {
			const section = state.sections.get(payload.sectionId)!;
			section["code"] = payload.code;
			return {
				...state,
				sections: state.sections.set(payload.sectionId, section),
			};
		}
		case "addSection": {
			return {
				...state,
				sections: state.sections.set(payload.section.id, {
					code: payload.section.code,
					config: payload.section.config,
				}),
				order: {
					...state.order,
					[payload.section.id]: payload.section.order,
				},
			};
		}
		case "deleteSection": {
			state.sections.delete(payload.sectionId);
			const order = {
				...state.order,
			};
			delete order[payload.sectionId];
			return {
				...state,
				sections: state.sections,
				order,
			};
		}
		case "changeOrder": {
			return {
				...state,
				order: {
					...state.order,
					[payload.id]: getNewOrder(state, payload.id, payload.to),
				},
			};
		}
		default:
			console.log({ type, payload });
			return state;
	}
}

export default function PageEditor() {
	const params = useParams();

	const pageId = Array.isArray(params.id) ? params.id[0] : params.id;
	const [pageFormOpen, setPageFormOpen] = useState(false);
	const [editSectionId, setEditSectionId] = useState<
		sections.JSONSelectable["id"] | undefined
	>();
	const [page, setPage] = useState<PageType>({
		id: pageId,
		title: "Page",
		path: "/unknown",
	});
	const [state, dispatch] = useReducer(reducer, {
		sections: new Map(),
		order: {},
	});

	useEffect(() => {
		getPageById(pageId).then(({ sections, ...page }) => {
			dispatch({
				type: "setFullPage",
				payload: {
					sections,
				},
			});
			setPage(page);
		});
	}, [pageId]);

	const sections = state.sections;
	const editedSection = editSectionId ? sections.get(editSectionId) : undefined;

	const sortedOrder = useMemo(() => getSortedOrder(state), [state.order]);

	const sectionSchema = useMemo(
		() =>
			editSectionId && editedSection?.code && metadataKey.has(editedSection?.code)
				? metadata[metadataKey.get(editedSection?.code)!].schema
				: undefined,
		[editSectionId, editedSection?.code],
	);

	const changeOrder = useMemo(
		() => (id: string, to: number) => {
			dispatch({
				type: "changeOrder",
				payload: {
					id,
					to,
				},
			});
		},
		[],
	);

	const deleteSection = useMemo(
		() => (id: string) => {
			dispatch({
				type: "deleteSection",
				payload: {
					sectionId: id,
				},
			});
		},
		[],
	);

	const preview = sortedOrder.map(([id], index) => {
		const section = sections.get(id)!;
		return (
			<MemoizedComponentWrapper
				code={section.code}
				config={section.config}
				key={`section${id}`}
				position={index}
				canMoveDown={index < sections.size - 1}
				id={id}
				changeOrder={changeOrder}
				deleteSection={deleteSection}
				setEditing={setEditSectionId}
			/>
		);
	});

	return (
		<div className="flex gap-4">
			<div className="px-2 flex flex-col">
				<div className="flex gap-2 items-baseline justify-between">
					<Collapsible
						className="flex-grow"
						open={pageFormOpen}
						onOpenChange={setPageFormOpen}
					>
						<div className="flex items-center justify-between space-x-4 px-4 w-full">
							<p className="font-bold">Page Settings</p>
							<CollapsibleTrigger asChild>
								<Button variant={"ghost"}>
									<ChevronUpDownIcon className="h-5 w-5"></ChevronUpDownIcon>
									<span className="sr-only">Toggle</span>
								</Button>
							</CollapsibleTrigger>
						</div>
						<CollapsibleContent>
							<DeclarativeForm
								schema={pageSchema}
								initialData={page}
								onSubmit={(pageVal) => {
									setPage({ id: pageId, ...pageVal });
									setPageFormOpen(false);
								}}
							>
								<Button type="submit">Save</Button>
							</DeclarativeForm>
						</CollapsibleContent>
					</Collapsible>

					<div className="">
						<Button
							onClick={() => {
								savePage(pageId, {
									page,
									sections: sortedOrder.map(([id, order]) => ({
										id,
										order,
										...sections.get(id)!,
									})),
								}).then(() => {
									toast({
										title: "Saved",
										description: "Page saved successfully",
										type: "background",
									});
								});
							}}
							variant={"outline"}
						>
							Save Page
						</Button>
					</div>
				</div>
				{preview}
				<div className="p-4 border-t border-gray-400 flex flex-col gap-2 my-4">
					<h2>Add new section</h2>
					<WidgetCategories
						onWidgetSelect={async (code) => {
							const defaultConfig = await getDefaultConfig(metadataKey.get(code)!);
							const newId = shortId();
							dispatch({
								type: "addSection",
								payload: {
									section: {
										code,
										id: newId,
										// creates a long gap between new sections and existing sections for re-ordering
										order: sortedOrder.length > 0 ? sortedOrder.at(-1)![1] + 1 : 1,
										config: defaultConfig,
									},
								},
							});
							setEditSectionId(newId);
						}}
					/>
				</div>
			</div>
			<Sheet
				open={!!editSectionId}
				onOpenChange={(open) => {
					if (!open) {
						setEditSectionId(undefined);
					}
				}}
			>
				{/* <SheetTrigger>Open</SheetTrigger> */}
				<SheetContent side={"right"}>
					<SheetHeader>
						<SheetTitle>
							{editedSection?.code ? (
								<WidgetSelector
									cat={metadataKey.get(editedSection.code)!}
									selected={editedSection?.code}
									onWidgetSelect={(newcode) => {
										dispatch({
											type: "changeWidget",
											payload: {
												sectionId: editSectionId!,
												code: newcode,
											},
										});
									}}
								/>
							) : null}
							{/* {editedSection?.code} */}
						</SheetTitle>
						<SheetDescription>Editing this section</SheetDescription>
					</SheetHeader>
					{sectionSchema && editSectionId ? (
						<DeclarativeForm
							schema={sectionSchema}
							uiSchema={get(components, `${editedSection?.code}.uiSchema`, undefined)}
							// @ts-ignore
							initialData={editedSection?.config}
							onSubmit={(newConfig) => {
								// console.log(newConfig);
								dispatch({
									type: "setConfig",
									payload: {
										sectionId: editSectionId!,
										config: newConfig,
									},
								});
								setEditSectionId(undefined);
							}}
						>
							<Button type="submit">Save</Button>
						</DeclarativeForm>
					) : null}
				</SheetContent>
			</Sheet>
		</div>
	);
}
