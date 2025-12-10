import { cn } from "@/lib/utils";
import clsx from "clsx";

export function PriorityIndicator({
  className,
  level,
  onClick,
  isSelected
}: {
  className?: string;
  level: number;
  onClick?: () => void;
  isSelected?: boolean;
}) {
  return (
    <div className={cn("rounded-md hover:cursor-pointer")} onClick={onClick}>
      <div
        className={clsx(
          cn(
            "w-5 h-5 border-2 rounded-sm flex justify-center items-center p-0 m-0 gap-0",
            className
          ),
          level === 1
            ? "border-lime"
            : level === 2
              ? "border-orange"
              : "border-red "
        )}
      >
        {isSelected &&
          <div className={clsx("rounded-full w-[40%] h-[40%] m-0 p-0", level == 1 ? "bg-lime" : level == 2 ? "bg-orange" : "bg-red")}></div>
        }
      </div>
    </div>
  );
}
