import { useContext, useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { ToDoContext } from "@/App";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  color: string;
  title: string;
  id: string;
  days: boolean[];
};

const getColorStyles = (color: string) => {
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

export const ToDo = ({ title, color, id, days }: Props) => {
  const { setTodos } = useContext(ToDoContext);

  const handleCardDelete = () => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
    toast({
      title: "Todo Deleted",
    });
  };

  const selectedColor = getColorStyles(color.toLowerCase());

  return (
    <Card
      style={{
        borderColor: selectedColor.border,
        backgroundColor: selectedColor.lightBg,
      }}
    >
      <CardTitle
        className="my-2 ml-4 py-2 pl-2 flex justify-between items-center"
        style={{ color: selectedColor.border }}
      >
        {title}
        <Trash2
          className="text-red-600 hover:bg-red-200 mr-6 rounded-md"
          size={16}
          onClick={handleCardDelete}
        />
      </CardTitle>
      <CardContent className="grid grid-rows-5 grid-flow-col max-w-[240] mt-4 gap-1">
        {Array.from({ length: 365 }).map((_, index) => (
          <SelectComponent key={index} color={selectedColor} index={index} id={id} />
        ))}
      </CardContent>
    </Card>
  );
};

function SelectComponent({
  color,
  index,
  id,
}: {
  color: { lightBg: string; bg: string; selected: string; border: string };
  index: number;
  id: string;
}) {
  const [selected, setSelected] = useState(false);
  const { todos, setTodos } = useContext(ToDoContext);

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

  const handleCheckboxClick = () => {
    setSelected(!selected);
    // Update the day in the todo list
    setTodos((prev) => {
      const newTodos = [...prev];
      const todoIndex = newTodos.findIndex((todo) => todo.id === id);
      newTodos[todoIndex].days[index] = !newTodos[todoIndex].days[index];
      return newTodos;
    })

  }

  return (
    <TooltipProvider>
      <Tooltip delayDuration={0}>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "size-3 rounded-full cursor-pointer border-[1px] border-opacity-40 transition-colors",
              isToday && "ring-[1.5px] ring-offset-1"
            )}
            style={{
              backgroundColor: selected ? color.selected : color.bg,
              borderColor: color.border,
              ...(isToday && ({ "--tw-ring-color": color.border } as any)),
            }}
            onClick={() => {handleCheckboxClick()}}
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
}
