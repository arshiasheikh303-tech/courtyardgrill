import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPKR(amount: number) {
  return `Rs ${amount.toLocaleString("en-PK")}`;
}

export function generateOrderNumber() {
  const now = new Date();
  const stamp = now.getTime().toString().slice(-6);
  const rand = Math.floor(100 + Math.random() * 900);
  return `CYG-${stamp}${rand}`;
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
