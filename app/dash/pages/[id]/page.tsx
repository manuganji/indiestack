"use client";
import { components } from "@/components/sections/index";
import { useParams } from "next/navigation";
import { useEffect, useReducer } from "react";
import { pages, sections } from "zapatos/schema";
import { getDefaultConfig, getPage } from "./actions";
import { Button } from "@/components/ui/button";
import { JSONValue } from "zapatos/db";

type ActionTypes =
	// | {
	// 		type: "loadPage";
	// 		payload: {
	// 			id: string;
	// 			dispatch: React.Dispatch<ActionTypes>;
	// 		};
	//   }
	| {
			type: "addSection";
			payload: {
				section: {
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
				section: {
					code: keyof typeof components;
					order: number;
					config: JSONValue;
				};
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
	editedIndex?: number;
	sections: Pick<sections.JSONSelectable, "code" | "config" | "order">[];
	page: Pick<pages.JSONSelectable, "title" | "path">;
};

function reducer(state: StateType, action: ActionTypes): StateType {
	switch (action.type) {
		case "setPage": {
			return action.payload;
		}
		case "addSection": {
			return {
				...state,
				sections: [...state.sections, action.payload.section],
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
						<div key={section.order}>
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
									dispatch({
										type: "addSection",
										payload: {
											section: {
												code,
												// creates a long gap between new sections and existing sections for re-ordering
												order: state.sections.length,
												config: defaultConfig,
											},
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
			<div className="">Settings</div>
		</div>
	);
}
