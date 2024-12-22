import { memo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Trash2 } from 'lucide-react';

type TodoItemProps = {
  id: string;
  title: string;
  days: boolean[];
  handleDelete: (id: string) => void;
  toggleDay: (id: string, index: number) => void;
};

export const TodoItem = memo(({ id, days, title, handleDelete, toggleDay }: TodoItemProps) => {
  return (
    <Card>
      <CardTitle className="my-2 ml-4 py-2 pl-2 flex justify-between items-center">
        {title}
        <Trash2
          className="text-red-600 hover:bg-red-200 mr-6 rounded-md"
          size={16}
          onClick={() => handleDelete(id)}
        />
      </CardTitle>
      <CardContent className="grid grid-rows-7 grid-flow-col max-w-[240] mt-4 gap-1">
      {days.map((checked, index) => (
          <TodoCheckBox
            key={`${id}-${index}`}
            checked={checked}
            onChange={() => toggleDay(id, index)}
          />
        ))}
      </CardContent>
    </Card>
  );
}, (prevProps, nextProps) => {
  return (
    prevProps.id === nextProps.id &&
    prevProps.title === nextProps.title &&
    prevProps.handleDelete === nextProps.handleDelete &&
    prevProps.toggleDay === nextProps.toggleDay &&
    prevProps.days.every((day, index) => day === nextProps.days[index])
  );
});

type TodoCheckBoxProps = {
  checked: boolean;
  onChange: () => void;
};

const TodoCheckBox = memo(({ checked, onChange }: TodoCheckBoxProps) => {
  console.log("rendering TodoCheckBox");
  console.log("--------------------");
  return (
    <div
      className={cn(
        "size-3 rounded-sm cursor-pointer border-[1px] bg-red-400 border-red-600",
        checked ? "bg-red-600 border-red-800" : "bg-blue-300"
      )}
      onClick={onChange}
    ></div>
  );
}, (prevProps, nextProps) => prevProps.checked === nextProps.checked);
