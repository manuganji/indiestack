import { TextPropsType } from "../types";

export const title = "Plain Text";

export const Component = function T001({ text }: TextPropsType) {
	return <div className="flex p-10 items-center">{text}</div>;
};
