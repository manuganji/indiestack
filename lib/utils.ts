import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { headers } from "next/headers";

export const getHostName = () => {
  return headers().get("host")!;
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
