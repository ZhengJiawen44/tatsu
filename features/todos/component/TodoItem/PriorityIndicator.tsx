import { cn } from "@/lib/utils";
import clsx from "clsx";

export function PriorityIndicator({
  className,
  level,
  onClick,
}: {
  className?: string;
  level: number;
  onClick?: () => void;
}) {
  return (
    <div className={cn("rounded-md hover:cursor-pointer")} onClick={onClick}>
      <div
        className={clsx(
          cn(
            "w-5 h-5 border-2 rounded-md flex justify-center items-center",
            className
          ),
          level === 1
            ? "border-lime"
            : level === 2
            ? "border-orange"
            : "border-red "
        )}
      >
        {level}
      </div>
    </div>
  );
}
