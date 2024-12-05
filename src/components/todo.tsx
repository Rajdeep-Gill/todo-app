import { useState } from "react";
import { Card, CardContent, CardTitle } from "./ui/card";
import { cn } from "@/lib/utils";

type Props = {
  color: string;
  title: string;
};
export const ToDo = ({ title, color }: Props) => {
  return (
    <Card>
      <CardTitle className="mt-2 ml-2 pt-2 pl-2">{title}</CardTitle>
      <CardContent className="grid grid-rows-5 grid-flow-col w-[240] mt-4 gap-1">
        {Array.from({ length: 365 }).map((_, index) => (
          <SelectComponent key={index} color={color} />
        ))}
      </CardContent>
    </Card>
  );
};

function SelectComponent({ color }: { color: string }) {
  const [selected, setSelected] = useState(false);

  const className = cn(
    `size-3 rounded-sm border-${color}-400 border-[1px] cursor-pointer`,
    selected ? `bg-${color}-400` : `bg-${color}-200`
  );
  return (
    <div className={className} onClick={() => setSelected(!selected)}></div>
  );
}
