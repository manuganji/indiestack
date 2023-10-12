import { ImageTextPropsType } from "../types";
import Image from "next/image";
import classnames from "classnames";
export const title = "Image with Text";

export const Component = function IT001({
	img,
	text,
	padding,
	margin,
	justify,
	items,
	gap,
}: ImageTextPropsType) {
	const classes = classnames({
		"flex flex-row": true,
		"justify-center": justify === "center",
		"justify-start": justify === "start",
		"justify-end": justify === "end",
		"justify-between": justify === "between",
		"justify-around": justify === "around",
		"justify-evenly": justify === "evenly",
		"flex-row-reverse": !img.left,
		"gap-2": gap === 2,
		"gap-4": gap === 4,
		"gap-8": gap === 8,
		"my-2": margin?.y === 2,
		"my-4": margin?.y === 4,
		"my-8": margin?.y === 8,
		"mx-2": margin?.x === 2,
		"mx-4": margin?.x === 4,
		"mx-8": margin?.x === 8,
		"py-2": padding?.y === 2,
		"py-4": padding?.y === 4,
		"py-8": padding?.y === 8,
		"items-start": items === "start",
		"items-center": items === "center",
		"items-end": items === "end",
		"items-stretch": items === "stretch",
	});
	const imgClasses = classnames({
		"rounded-none": img.radius === 0,
		"rounded-sm": img.radius === 2,
		"rounded-md": img.radius === 4,
		"rounded-lg": img.radius === 8,
		"rounded-full": img.radius === 9999,
	});
	return (
		<div className={classes}>
			<img
				className={imgClasses}
				src={img.src}
				alt={img.alt || text}
				width={img.width}
				height={img.height}
			/>
			<div className="prose text-black">{text}</div>
		</div>
	);
};
