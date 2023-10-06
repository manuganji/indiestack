"use client";
import DeclarativeForm from "@/components/forms";
import { components } from "@/components/sections/index";
import { Button } from "@/components/ui/button";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import { shortId } from "@/lib/utils";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useReducer } from "react";
import { JSONValue } from "zapatos/db";
import { pages, sections } from "zapatos/schema";
import { PageType, getDefaultConfig, getPageById, savePage } from "./actions";
import {
	PencilIcon,
	TrashIcon,
	ArrowUpIcon,
	ArrowDownIcon,
} from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/components/ui/collapsible";

const ComponentWrapper = function ({
	position,
	moveUp,
	moveDown,
	canMoveDown,
	setEditing,
	deleteSection,
	children,
	section,
}: {
	section: StateType["sections"][0];
	children: React.ReactNode;
	position: number;
	id: string;
	moveUp: () => void;
	moveDown: () => void;
	canMoveDown: boolean;
	setEditing: () => void;
	deleteSection: () => void;
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
			onClick: setEditing,
		},
		{
			icon: ArrowDownIcon,
			title: "Move down",
			disabled: !canMoveDown,
			onClick: moveDown,
		},
		{
			icon: ArrowUpIcon,
			title: "Move up",
			disabled: position === 0,
			onClick: moveUp,
		},
		{
			icon: TrashIcon,
			title: "Delete",
			disabled: false,
			destructive: true,
			onClick: deleteSection,
		},
	];
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
				<p className="text-gray-200">{section.code}</p>
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
			{children}
		</div>
	);
};
type ActionTypes =
	| {
			type: "setPage";
			payload: Partial<StateType["page"]>;
	  }
	| {
			type: "setEditingSection";
			payload?: {
				section?: sections.JSONSelectable["id"];
			};
	  }
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
			type: "setFullPage";
			payload: {
				page: Omit<pages.JSONSelectable, "id">;
				sections: sections.JSONSelectable[];
			};
	  };

export type StateType = PageType & {
	editedSection?: sections.JSONSelectable["id"];
};

function reducer(state: StateType, action: ActionTypes): StateType {
	switch (action.type) {
		case "setPage": {
			return {
				...state,
				page: {
					...state.page,
					...action.payload,
				},
			};
		}
		case "setFullPage": {
			return action.payload;
		}
		case "setConfig": {
			return {
				...state,
				sections: state.sections.map((section) => {
					if (section.id === action.payload.sectionId) {
						return {
							...section,
							config: action.payload.config,
						};
					}
					return section;
				}),
			};
		}
		case "addSection": {
			return {
				...state,
				sections: [...state.sections, action.payload.section],
			};
		}
		case "setEditingSection": {
			return {
				...state,
				editedSection: action.payload?.section,
			};
		}
		case "deleteSection": {
			return {
				...state,
				sections: state.sections.filter(
					(section) => section.id !== action.payload.sectionId,
				),
			};
		}
		case "changeOrder": {
			return {
				...state,
				sections: state.sections.map((section) => {
					if (section.id === action.payload.id) {
						return {
							...section,
							order: action.payload.to,
						};
					}
					return section;
				}),
			};
		}
		default:
			console.log(action);
			return state;
	}
}

export default function PageEditor() {
	const params = useParams();
	const pageId = Array.isArray(params.id) ? params.id[0] : params.id;
	const [state, dispatch] = useReducer(reducer, {
		sections: [],
		page: {
			title: "Page",
			path: "/unknown",
		},
	});

	const getOrderBetween = (from: number, to: number) => {
		if (to == 0) {
			return state.sections[0].order - 1;
		} else if (to == state.sections.length - 1) {
			return state.sections.at(-1)!.order + 1;
		} else if (from > to) {
			return (state.sections[to].order + state.sections[to - 1].order) / 2;
		} else if (from < to) {
			return (state.sections[to].order + state.sections[to + 1].order) / 2;
		} else {
			return state.sections[from].order;
		}
	};

	const editedSection = useMemo(
		() => state.sections.find((section) => section.id === state.editedSection),
		[state.editedSection, state.sections],
	);
	const sectionSchema = useMemo(
		() => (editedSection ? components[editedSection?.code].schema : undefined),
		[editedSection],
	);

	useEffect(() => {
		getPageById(pageId).then(({ sections, ...page }) => {
			dispatch({
				type: "setFullPage",
				payload: {
					page,
					sections,
				},
			});
		});
	}, [pageId]);

	return (
		<div className="flex gap-4">
			<div className="px-2 flex flex-col">
				<div className="flex gap-2 items-baseline justify-between">
					<Collapsible>
						<CollapsibleTrigger>Page Settings</CollapsibleTrigger>
						<CollapsibleContent>
							<Input
								value={state.page?.title}
								className="w-auto flex-grow"
								onChange={({ currentTarget: { value } }) => {
									dispatch({
										type: "setPage",
										payload: {
											title: value,
										},
									});
								}}
							/>
						</CollapsibleContent>
					</Collapsible>

					<div className="">
						<Button
							onClick={() => {
								savePage(pageId, state).then(() => {
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
				{state.sections
					.sort((a, b) => a.order - b.order)
					.map((section, index) => {
						return (
							<ComponentWrapper
								section={section}
								key={section.id}
								position={index}
								canMoveDown={index < state.sections.length - 1}
								moveUp={() => {
									dispatch({
										type: "changeOrder",
										payload: {
											id: section.id,
											to: getOrderBetween(index, index - 1),
										},
									});
								}}
								moveDown={() => {
									dispatch({
										type: "changeOrder",
										payload: {
											id: section.id,
											to: getOrderBetween(index, index + 1),
										},
									});
								}}
								deleteSection={() => {
									dispatch({
										type: "deleteSection",
										payload: {
											sectionId: section.id,
										},
									});
								}}
								setEditing={() => {
									dispatch({
										type: "setEditingSection",
										payload: {
											section: section.id,
										},
									});
								}}
								id={section.id}
							>
								{/* Wrap with editing controls */}
								{components[section.code].Component(section.config)}
							</ComponentWrapper>
						);
					})}
				<div className="p-4 bg-gray-100 shadow-inner rounded-md flex flex-col gap-2 my-4">
					<h2>Add new section</h2>
					<div className="grid grid-cols-6">
						{Object.entries(components).map(([code, { title }]) => (
							<Button
								key={code}
								onClick={async () => {
									const defaultConfig = await getDefaultConfig(code);
									const newId = shortId();
									dispatch({
										type: "addSection",
										payload: {
											section: {
												code,
												id: newId,
												// creates a long gap between new sections and existing sections for re-ordering
												order: state.sections.length,
												config: defaultConfig,
											},
										},
									});
									dispatch({
										type: "setEditingSection",
										payload: {
											section: newId,
										},
									});
								}}
							>
								{title}
							</Button>
						))}
					</div>
				</div>
			</div>
			<Sheet
				open={!!state.editedSection}
				onOpenChange={(open) => {
					if (!open) {
						dispatch({
							type: "setEditingSection",
							payload: {
								section: undefined,
							},
						});
					}
				}}
			>
				{/* <SheetTrigger>Open</SheetTrigger> */}
				<SheetContent side={"right"}>
					<SheetHeader>
						<SheetTitle>{editedSection?.code}</SheetTitle>
						<SheetDescription>Editing this section</SheetDescription>
					</SheetHeader>
					{sectionSchema ? (
						<DeclarativeForm
							schema={sectionSchema}
							// @ts-ignore
							initialData={editedSection?.config}
							onSubmit={(newConfig) => {
								// console.log(newConfig);
								dispatch({
									type: "setConfig",
									payload: {
										sectionId: editedSection?.id!,
										config: newConfig,
									},
								});
								dispatch({
									type: "setEditingSection",
									payload: {
										section: undefined,
									},
								});
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
