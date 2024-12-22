import React, { memo, useState } from "react";
import { Button } from "./ui/button";
import {
  cn,
  getColorStyles,
  getDateFromIndex,
  getDayOfYear,
} from "@/lib/utils";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Trash2 } from "lucide-react";
import { createId } from "@paralleldrive/cuid2";

interface MemoizedTextProps {
  id: string;
  title: string;
  days: boolean[];
  useAdd: React.Dispatch<
    React.SetStateAction<{ id: string; days: boolean[], title: string }[]>
  >;
}

const MemoizedCard = memo(({ id, days, useAdd, title }: MemoizedTextProps) => {
  const handleDelete = () => {
    useAdd((prev) => {
      return prev.filter((item) => item.id !== id);
    });
  };

  const handleToggleDay = (index: number) => {
    useAdd((prev) => {
      return prev.map((item) => {
        if (item.id === id) {
          const newDays = [...item.days];
          newDays[index] = !newDays[index];
          return { ...item, days: newDays };
        }
        return item;
      });
    });
  };

  const sumDays = days.filter(Boolean).length;

  console.log("Rendered", id);
  return (
    <Card>
      <CardTitle className="my-2 ml-4 py-2 pl-2 flex justify-between items-center">
        {title}, Days Completed: {sumDays}
        <Trash2
          className="text-red-600 hover:bg-red-200 mr-6 rounded-md"
          size={16}
          onClick={handleDelete}
        />
      </CardTitle>
      <CardContent className="grid grid-rows-7 grid-flow-col max-w-[240] mt-4 gap-1">
        {Array.from({ length: 365 }).map((_, index) => (
          <TempBoxSelector
            key={index}
            index={index}
            days={days}
            onToggleDay={handleToggleDay}
          />
        ))}
      </CardContent>
    </Card>
  );
});

export const TestComponent = () => {
  const [add, useAdd] = useState([{ id: "1", title:"temp", days: Array(365).fill(false) }]);

  const handleClick = () => {
    useAdd((prev) => {
      return [
        ...prev,
        { id: createId(), title: "Temp", days: Array(365).fill(false) },
      ];
    });
  };

  const sumDays = add
    .map(({ days }) => days.filter(Boolean).length)
    .reduce((acc, curr) => acc + curr, 0);

  return (
    <>
      <h1>Total Days Completed: {sumDays}</h1>
      <Button variant={"outline"} className="text-black" onClick={handleClick}>
        Add New
      </Button>
      {add.map(({ title, id, days }) => (
        <MemoizedCard
          key={id}
          title={title}
          id={id}
          days={days}
          useAdd={useAdd}
        />
      ))}
    </>
  );
};

const TempBoxSelector = ({
  index,
  days,
  onToggleDay,
}: {
  index: number;
  days: boolean[];
  onToggleDay: (index: number) => void;
}) => {
  const getDayOfYear = (date: Date): number => {
    const start = new Date(date.getFullYear(), 0, 0);
    const diff = date.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    return Math.floor(diff / oneDay) - 1;
  };

  const getDateFromIndex = (index: number): Date => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const date = new Date(start.getTime() + (index + 1) * 24 * 60 * 60 * 1000);
    return date;
  };

  const today = getDayOfYear(new Date());
  const isToday = today === index;
  const date = getDateFromIndex(index);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    weekday: "short",
  });

  const selected = days[index];
  const color = getColorStyles("red");

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "size-5 rounded-sm cursor-pointer border-[1px] border-opacity-40 transition-colors",
              isToday && "ring-[1.5px] ring-offset-1"
            )}
            style={{
              backgroundColor: selected ? color.selected : color.bg,
              borderColor: color.border,
              ...(isToday && ({ "--tw-ring-color": color.border } as any)),
            }}
            onClick={() => {
              onToggleDay(index);
            }}
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
          <p>{formattedDate}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
