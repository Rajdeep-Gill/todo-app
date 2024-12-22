import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay) - 1;
}

export function getDateFromIndex(index: number): Date {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const date = new Date(start.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
  return date;
}

export type colorObj = {
  lightBg: string;
  bg: string;
  selected: string;
  border: string;
}

export function getColorStyles(color: string) {
  const colorMap = {
    red: {
      lightBg: "rgb(254 226 226)",
      bg: "rgb(254 202 202)",
      selected: "rgb(248 113 113)",
      border: "rgb(239 68 68)",
    },
    blue: {
      lightBg: "rgb(219 234 254)",
      bg: "rgb(191 219 254)",
      selected: "rgb(59 130 246)",
      border: "rgb(37 99 235)",
    },
    green: {
      lightBg: "rgb(220 252 231)",
      bg: "rgb(187 247 208)",
      selected: "rgb(34 197 94)",
      border: "rgb(22 163 74)",
    },
    yellow: {
      lightBg: "rgb(254 249 195)",
      bg: "rgb(254 240 138)",
      selected: "rgb(234 179 8)",
      border: "rgb(202 138 4)",
    },
  };

  return colorMap[color as keyof typeof colorMap] || colorMap.red;
};

export function getLongestStreak(days: boolean[]): number {
  let streak = 0;
  let longestStreak = 0;

  for (const day of days) {
    if (day) {
      streak++;
    } else {
      longestStreak = Math.max(streak, longestStreak);
      streak = 0;
    }
  }

  return longestStreak;
}
