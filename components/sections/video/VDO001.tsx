"use client";
import dynamic from "next/dynamic";
import { VideoPropsType } from "../types";

export const title = "Video";

export const Component = function VDO001(props: VideoPropsType) {
	const ReactPlayer = dynamic(() => import("react-player/lazy"), {
		ssr: false,
	});
	// https://github.com/cookpete/react-player/issues/1428#issuecomment-1107908096
	return <ReactPlayer {...props} />;
};
