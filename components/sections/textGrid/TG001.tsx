import classnames from "classnames";
import { TextGridPropsType } from "../types";

export const title = "Text Grid";

export const Component = function TG001({
	items,
	cols,
	gap,
}: TextGridPropsType) {
	const gridClasses = classnames({
		"grid my-10 mx-auto w-4/5": true,
		"grid-cols-1 xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2": !cols,
		"lg:grid-cols-4": cols?.lg === 4,
		"lg:grid-cols-3": cols?.lg === 3,
		"sm:grid-cols-3": cols?.md === 3,
		"sm:grid-cols-2": cols?.md === 2,
		"sm:grid-cols-1": cols?.md === 1,
		"grid-cols-2": cols?.sm === 2,
		"grid-cols-1": cols?.sm === 1,
		"gap-2": gap === 2,
		"gap-4": gap === 4,
		"gap-8": gap === 8,
		"gap-16": gap === 16,
	});
	return (
		<div className="flex flex-col w-full items-center justify-center">
			<div className={gridClasses}>
				{items.map((item) => (
					<div className="prose" key={item.text}>
						{item.text}
					</div>
				))}
			</div>
		</div>
	);
};
