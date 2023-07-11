import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getGenniferUrl() {
  const url = process.env.NEXT_PUBLIC_GENNIFER_BASE_URL
  if (!url || url.length === 0) {
      throw new Error("Missing GenNIFER URL.");
  }
  return url;
}