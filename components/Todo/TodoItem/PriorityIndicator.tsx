import { cn } from "@/lib/utils";
import clsx from "clsx";

export function PriorityIndicator({
  className,
  level,
  onClick,
}: {
  className?: string;
  level: number;
  onClick: () => void;
}) {
  return (
    <div
      className={cn("hover:bg-card rounded-md", className)}
      onClick={onClick}
    >
      <div
        className={clsx(
          "w-5 h-5 border-2 rounded-md flex justify-center items-center",
          level === 1
            ? "border-lime"
            : level === 2
            ? "border-orange"
            : "border-red"
        )}
      >
        {level}
      </div>
    </div>
  );
}
