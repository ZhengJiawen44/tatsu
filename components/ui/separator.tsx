import React from "react";
import { cn } from "@/lib/utils";
const Separator = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
}) => {
  return (
    <div className={cn("relative w-full h-4", className)} {...props}>
      {children}
    </div>
  );
};

const SeparatorWord = ({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <p
      className={cn(
        "text-form-border text-[0.85rem] absolute w-fit left-1/2 translate-x-[-50%] top-1/2 translate-y-[-50%] leading-none bg-form-background px-4 z-10",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
};

const SeparatorLine = ({ className, ...props }: { className?: string }) => {
  return (
    <p
      className={cn(className, "w-full h-1 border-t-[1px] border-form-border")}
      {...props}
    ></p>
  );
};

export { Separator, SeparatorLine, SeparatorWord };
