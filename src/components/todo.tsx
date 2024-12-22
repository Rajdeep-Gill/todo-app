import { memo, useContext } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { Trash2 } from "lucide-react";
import { ToDoContext } from "@/App";
import { toast } from "@/hooks/use-toast";

import { DayBox } from "./day-box";

type Props = {
  color: string;
  title: string;
  id: string;
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

export const ToDo = memo(({ title, color, id }: Props) => {
  const { setTodos } = useContext(ToDoContext);
  console.log("Rendering", id)

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
      <CardContent className="grid grid-rows-7 grid-flow-col max-w-[240] mt-4 gap-1">
        {Array.from({ length: 365 }).map((_, index) => (
          <DayBox key={index} color={selectedColor} index={index} id={id} />
        ))}
      </CardContent>
    </Card>
  );
})
