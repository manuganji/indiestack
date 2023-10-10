import { TextPropsType } from "../types";

export const title = "Header";

export const Component = function H001({ text }: TextPropsType) {
	return <h1 className="text-6xl my-4 font-bold w-full">{text}</h1>;
};
