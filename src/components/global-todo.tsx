import { ToDoContext } from "@/App";
import { useContext, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

export const GlobalTodo = () => {
  const { todos } = useContext(ToDoContext);

  // Loop over every todo, and check at every day if it is completed
  // increment the totalCompleted at that index.
  // End result should be an array of 365 numbers, each number representing the total completed todos for that day.

  const totalCompleted = Array.from({ length: 365 }).map((_, index) => {
    return todos.reduce((acc, todo) => {
      return acc + (todo.days[index] ? 1 : 0);
    }, 0);
  });

  const maxColor = "#193acf";
  const borderColor = "#1d318a";
  const minColor = "#f7f7f7";

  const colorListLen = todos.length;

  // interpolate between maxColor and minColor to get the color for the various completed at that day
  const interpolateColor = (index: number): string => {
    const totalColors = colorListLen;
    const hexToRgb = (hex: string) => ({
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    });

    const rgbToHex = ({ r, g, b }: { r: number; g: number; b: number }) =>
      `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;

    const maxRgb = hexToRgb(maxColor);
    const minRgb = hexToRgb(minColor);

    const ratio = index / (totalColors);

    const interpolated = {
      r: Math.round(maxRgb.r * ratio + minRgb.r * (1 - ratio)),
      g: Math.round(maxRgb.g * ratio + minRgb.g * (1 - ratio)),
      b: Math.round(maxRgb.b * ratio + minRgb.b * (1 - ratio)),
    };

    return rgbToHex(interpolated);
  };

  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) - 1;
  };

  const today = getDayOfYear(new Date());

  const getDateFromIndex = (index: number): Date => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const date = new Date(start.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
    return date;
  };

  return (
    <Card
      style={{
        borderColor: maxColor,
        backgroundColor: minColor,
      }}
    >
      <CardTitle
        className="my-2 ml-4 py-2 pl-2 flex justify-between items-center"
        style={{ color: maxColor }}
      >
        Total Completed
      </CardTitle>
      <CardContent className="grid grid-rows-5 grid-flow-col max-w-[240] mt-4 gap-1">
        {Array.from({ length: 365 }).map((_, index) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "size-3 rounded-full cursor-pointer border-[1px] border-opacity-40 transition-colors",
                    today===index && "ring-[1.5px] ring-offset-1"
                  )}
                  style={{
                    backgroundColor: interpolateColor(totalCompleted[index]),
                    borderColor: borderColor,
                    ...(index === today &&
                      ({ "--tw-ring-color": borderColor } as any)),
                  }}
                  key={index}
                ></div>
              </TooltipTrigger>
              <TooltipContent
                style={{
                  backgroundColor: minColor,
                  borderColor: borderColor,
                  color: borderColor,
                }}
                className="border-2 font-medium"
              >
                <h1>
                  {getDateFromIndex(index).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    weekday: "short",
                  })}
                </h1>
                {totalCompleted[index]} / {colorListLen}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </CardContent>
    </Card>
  );
};
