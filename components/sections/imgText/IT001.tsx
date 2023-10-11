import { ImageTextPropsType } from "../types";
import Image from "next/image";

export const title = "Video";

export const Component = function IT001({ img, text }: ImageTextPropsType) {
	return (
		<div className={"flex flex-row"}>
			<Image
				src={img.src}
				alt={img.alt || text}
				width={img.width}
				height={img.height}
			/>
			<p>{text}</p>
		</div>
	);
};
