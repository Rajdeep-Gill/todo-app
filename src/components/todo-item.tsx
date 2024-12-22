import { memo } from "react";
import {
  cn,
  colorObj,
  getDateFromIndex,
  getDayOfYear,
  getLongestStreak,
} from "@/lib/utils";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import {
  TooltipProvider,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "./ui/tooltip";

type TodoItemProps = {
  id: string;
  title: string;
  days: boolean[];
  color: colorObj;
  handleDelete: (id: string) => void;
  toggleDay: (id: string, index: number) => void;
};

export const TodoItem = memo(
  ({ id, days, title, color, handleDelete, toggleDay }: TodoItemProps) => {
    return (
      <Card
        style={{
          backgroundColor: color.bg,
          borderColor: color.border,
        }}
      >
        <CardTitle
          className="my-2 ml-4 py-2 pl-2 flex justify-between items-center"
          style={{
            color: color.border,
          }}
        >
          {title}
          <Trash2
            className="text-red-600 hover:bg-red-200 mr-6 rounded-md"
            size={16}
            onClick={() => handleDelete(id)}
          />
        </CardTitle>
        <CardContent className="pb-0 grid grid-rows-7 grid-flow-col max-w-[240]  gap-1">
          {days.map((checked, index) => (
            <TodoCheckBox
              key={`${id}-${index}`}
              index={index}
              color={color}
              checked={checked}
              onChange={() => toggleDay(id, index)}
            />
          ))}
        </CardContent>
        <CardFooter className="py-1 mt-0">
          <div
            className="text-center text-sm flex justify-between w-full"
            style={{ color: color.border }}
          >
            <div>{getLongestStreak(days)} day streak!</div>
            <div>
              {days.filter(Boolean).length} / {days.length} days
            </div>
          </div>
        </CardFooter>
      </Card>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.id === nextProps.id &&
      prevProps.title === nextProps.title &&
      prevProps.handleDelete === nextProps.handleDelete &&
      prevProps.toggleDay === nextProps.toggleDay &&
      prevProps.days.every((day, index) => day === nextProps.days[index])
    );
  }
);

type TodoCheckBoxProps = {
  index: number;
  color: colorObj;
  checked: boolean;
  onChange: () => void;
};

const TodoCheckBox = memo(
  ({ index, color, checked, onChange }: TodoCheckBoxProps) => {
    const isToday = index === getDayOfYear(new Date());
    const formattedDate = getDateFromIndex(index).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });

    const disableClick = index > getDayOfYear(new Date());

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "size-3 rounded-full border-[1px] border-opacity-40 transition-colors",
                isToday && "ring-[1.5px] ring-offset-1",
                disableClick ? "" : "cursor-pointer"
              )}
              style={{
                backgroundColor: checked ? color.selected : color.bg,
                borderColor: color.border,
                ...(isToday && { "--tw-ring-color": color.border }),
              }}
              onClick={() => !disableClick && onChange()}
            ></div>
          </TooltipTrigger>
          <TooltipContent
            style={{
              backgroundColor: color.lightBg,
              borderColor: color.selected,
              color: color.border,
            }}
            className="border-2 font-medium"
          >
            <div className="text-xs text-center">{formattedDate}</div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
  (prevProps, nextProps) => prevProps.checked === nextProps.checked
);
