import { ImgPropsType } from "../types";

export const title = "Image";

export const Component = function IMG001({ img }: ImgPropsType) {
	return <img src={img} />;
};
