import { Todo } from "@/App";
import { cn, getLongestStreak } from "@/lib/utils";
import { Card, CardContent, CardFooter, CardTitle } from "./ui/card";
import {
  Tooltip,
  TooltipProvider,
  TooltipTrigger,
  TooltipContent,
} from "./ui/tooltip";

type Props = {
  allTodos: Todo[];
};
const maxColor = "#193acf";
const borderColor = "#1d318a";
const minColor = "#f7f7f7";
export const GlobalTodo = ({ allTodos }: Props) => {

  const totalCompleted = Array.from({ length: 365 }).map((_, index) =>
    allTodos.reduce(
      (acc, { days }) => (days[index] ? acc + 1 : acc),
      0
    )
  );

  const totalCompletedBool = Array.from({ length: 365 }).map((_, index) =>
    totalCompleted[index] === allTodos.length );
  
  const colorListLen = allTodos.length + 1;
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
    const ratio = index / (totalColors - 1);
    const interpolated = {
      r: Math.round(maxRgb.r * ratio + minRgb.r * (1 - ratio)),
      g: Math.round(maxRgb.g * ratio + minRgb.g * (1 - ratio)),
      b: Math.round(maxRgb.b * ratio + minRgb.b * (1 - ratio)),
    };
    return rgbToHex(interpolated);
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
      <CardContent className="grid grid-rows-7 grid-flow-col max-w-[240] gap-1 pb-0">
        {Array.from({ length: 365 }).map((_, index) => (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    "size-3 rounded-full cursor-pointer border-[1px] border-opacity-40 transition-colors"
                  )}
                  style={{
                    backgroundColor: interpolateColor(totalCompleted[index]),
                    borderColor: borderColor,
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
                {totalCompleted[index]} / {colorListLen}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
      </CardContent>
      <CardFooter className = "py-1 mt-0">
        <div className="text-center text-sm flex justify-between w-full"
          style={{ color: maxColor }}
        >
          Longest Streak: {getLongestStreak(totalCompletedBool)} 
          {getLongestStreak(totalCompletedBool) === 1 ? " day" : " days"}!
        </div>
      </CardFooter>
    </Card>
  );
};
