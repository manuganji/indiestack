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
import { getDefaultConfig, getPage } from "./actions";
import {
	PencilIcon,
	TrashIcon,
	ArrowUpIcon,
	ArrowDownIcon,
} from "@heroicons/react/20/solid";
import { Input } from "@/components/ui/input";

const ComponentWrapper = function ({
	position,
	swap,
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
	swap: (position: number, to: number) => void;
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
			onClick: () => {
				swap(position, position + 1);
			},
		},
		{
			icon: ArrowUpIcon,
			title: "Move up",
			disabled: position === 0,
			onClick: () => {
				swap(position, position - 1);
			},
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
        gap-1 px-2"
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
			type: "swapPositions";
			payload: {
				position: number;
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

type StateType = {
	editedSection?: sections.JSONSelectable["id"];
	sections: Pick<sections.JSONSelectable, "code" | "config" | "order" | "id">[];
	page: Pick<pages.JSONSelectable, "title" | "path">;
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
		case "swapPositions": {
			const { position, to } = action.payload;
			const sections = [...state.sections];
			const outgoing = sections[position];
			const incoming = sections[to];
			[outgoing.order, incoming.order] = [incoming.order, outgoing.order];
			sections[position] = incoming;
			sections[to] = outgoing;
			return {
				...state,
				sections,
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

	const editedSection = useMemo(
		() => state.sections.find((section) => section.id === state.editedSection),
		[state.editedSection, state.sections],
	);
	const sectionSchema = useMemo(
		() => (editedSection ? components[editedSection?.code].schema : undefined),
		[editedSection],
	);

	useEffect(() => {
		getPage(pageId).then(({ sections, ...page }) => {
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
				<Input
					value={state.page?.title}
					className="text-3xl w-auto py-6"
					onChange={({ currentTarget: { value } }) => {
						dispatch({
							type: "setPage",
							payload: {
								title: value,
							},
						});
					}}
				/>
				{state.sections.map((section, index) => {
					return (
						<ComponentWrapper
							section={section}
							key={section.id}
							position={index}
							canMoveDown={index < state.sections.length - 1}
							swap={(position: number, to: number) => {
								dispatch({
									type: "swapPositions",
									payload: {
										position,
										to,
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
