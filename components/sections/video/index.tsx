import { JSONSchemaType } from "ajv";
import { VideoPropsType } from "../types";
import { SCHEMA_IDS } from "../ids";
import * as VDO001 from "./VDO001";

export const schema: JSONSchemaType<VideoPropsType> = {
	$schema: "http://json-schema.org/draft-07/schema#",
	$id: SCHEMA_IDS.video,
	type: "object",
	title: "Video",
	description: "",
	properties: {
		url: {
			type: "string",
			title: "Video URL",
			errorMessage: "Please enter a valid video URL.",
			format: "uri",
			default: "https://www.youtube.com/watch?v=r9zskkM7MH0",
		},
		controls: {
			type: "boolean",
			title: "Show controls",
			default: true,
			nullable: true,
		},
		loop: {
			type: "boolean",
			title: "Loop video",
			default: false,
			nullable: true,
		},
		light: {
			type: "boolean",
			title: "Light mode",
			default: false,
			nullable: true,
		},
		height: {
			type: "number",
			title: "Height",
			default: 360,
			nullable: true,
		},
		width: {
			type: "number",
			title: "Width",
			default: 640,
			nullable: true,
		},
		pip: {
			type: "boolean",
			title: "Enable Picture-in-picture mode",
			default: true,
			nullable: true,
		},
		playing: {
			type: "boolean",
			title: "Autoplay",
			default: false,
			nullable: true,
		},
		muted: {
			type: "boolean",
			title: "Mute",
			default: false,
			nullable: true,
		},
		volume: {
			type: "number",
			title: "Volume",
			default: 0.3,
			nullable: true,
		},
		playbackRate: {
			type: "number",
			title: "Playback rate",
			default: 1,
			nullable: true,
			description: "Only supported by YouTube, Wistia, and file paths",
		},
	},
	required: ["url"],
	errorMessage: {
		required: {
			url: "Please enter a valid video URL.",
		},
	},
};

export const variants = {
	VDO001,
} as const;

export const components = {
	VDO001: VDO001.Component,
} as const;
