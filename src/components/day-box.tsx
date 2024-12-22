import { useState, useContext } from "react";
import { ToDoContext } from "@/App";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";
import { cn } from "@/lib/utils";

export const DayBox = ({
    color,
    index,
    id,
}: {
    color: { lightBg: string; bg: string; selected: string; border: string };
    index: number;
    id: string;
}) => {

    const [selected, setSelected] = useState(false);
    const { setTodos } = useContext(ToDoContext);

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
                            "size-5 rounded-sm cursor-pointer border-[1px] border-opacity-40 transition-colors",
                            isToday && "ring-[1.5px] ring-offset-1"
                        )}
                        style={{
                            backgroundColor: selected ? color.selected : color.bg,
                            borderColor: color.border,
                            ...(isToday && ({ "--tw-ring-color": color.border } as any)),
                        }}
                        onClick={() => { handleCheckboxClick() }}
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
