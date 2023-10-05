import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { customAlphabet } from "nanoid";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

// https://zelark.github.io/nano-id-cc/
const ALPHABET =
	"0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const ID_LENGTH = 10;

export const shortId = customAlphabet(ALPHABET, ID_LENGTH);
