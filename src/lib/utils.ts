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
    purple: {
      lightBg: "rgb(243 232 255)",
      bg: "rgb(233 213 255)",
      selected: "rgb(168 85 247)",
      border: "rgb(147 51 234)",
    },
    orange: {
      lightBg: "rgb(255 237 213)",
      bg: "rgb(255 215 164)",
      selected: "rgb(249 115 22)",
      border: "rgb(234 88 12)",
    },
    pink: {
      lightBg: "rgb(252 231 243)",
      bg: "rgb(251 207 232)",
      selected: "rgb(236 72 153)",
      border: "rgb(219 39 119)",
    },
    teal: {
      lightBg: "rgb(204 251 241)",
      bg: "rgb(153 246 228)",
      selected: "rgb(20 184 166)",
      border: "rgb(13 148 136)",
    },
    gray: {
      lightBg: "rgb(243 244 246)",
      bg: "rgb(229 231 235)",
      selected: "rgb(107 114 128)",
      border: "rgb(75 85 99)",
    },
  }    
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
