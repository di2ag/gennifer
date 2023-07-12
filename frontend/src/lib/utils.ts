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

export const formatDate = (dateString: string) => {
  const options:Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
}