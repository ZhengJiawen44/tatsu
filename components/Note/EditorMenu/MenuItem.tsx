import clsx from "clsx";
import { cn } from "@/lib/utils";
export const MenuItem = ({
  title,
  className,
  children,
  onClick,
  isActive,
}: {
  title: string;
  className?: string;
  children: React.ReactNode;
  onClick: () => void;
  isActive: () => boolean;
}) => {
  const active = isActive();
  return (
    <button
      title={title}
      className={cn(
        clsx(
          "px-[0.6rem] rounded-md hover:bg-border aspect-square",
          active && "text-white bg-border"
        ),
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
