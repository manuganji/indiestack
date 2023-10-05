"use client";
import { components } from "@/components/sections/index";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useReducer } from "react";
import { pages, sections } from "zapatos/schema";
import { getDefaultConfig, getPage } from "./actions";
import { Button } from "@/components/ui/button";
import { JSONValue } from "zapatos/db";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import { shortId } from "@/lib/utils";
import DeclarativeForm from "@/components/forms";

type ActionTypes =
	// | {
	// 		type: "loadPage";
	// 		payload: {
	// 			id: string;
	// 			dispatch: React.Dispatch<ActionTypes>;
	// 		};
	//   }
	| {
			type: "editSection";
			payload?: {
				section?: sections.JSONSelectable["id"];
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
			type: "validateConfig";
			payload: {
				section: {
					code: keyof typeof components;
					config: JSONValue;
				};
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
			type: "setPage";
			payload: {
				page: Omit<pages.JSONSelectable, "id">;
				sections: sections.JSONSelectable[];
			};
	  }
	| {
			type: "savePage";
			payload: {
				page: pages.JSONSelectable;
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
		case "editSection": {
			return {
				...state,
				editedSection: action.payload?.section,
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
				type: "setPage",
				payload: {
					page,
					sections,
				},
			});
		});
	}, [pageId]);

	return (
		<div className="flex gap-4">
			<div className="">
				<p>{state.page?.title}</p>
				{state.sections.map((section) => {
					return (
						<div key={section.id}>
							{/* Wrap with editing controls */}
							{components[section.code].Component(section.config)}
						</div>
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
										type: "editSection",
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
							type: "editSection",
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
							onSubmit={(newConfig) => {
								console.log(newConfig);
								dispatch({
									type: "setConfig",
									payload: {
										sectionId: editedSection?.id!,
										config: newConfig,
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
