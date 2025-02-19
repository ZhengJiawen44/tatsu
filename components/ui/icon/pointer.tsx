import React from "react";
import { cn } from "@/lib/utils";
const Pointer = ({
  className,
  onClick,
  variant = "right",
}: {
  className?: string;
  onClick?: () => void;
  variant?: "left" | "right";
}) => {
  return (
    <svg
      onClick={onClick}
      width="22"
      height="38"
      viewBox="0 0 22 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      transform={variant === "left" ? "" : "scale(-1,1)"}
      className={cn(
        "hover:stroke-white stroke-card-foreground-muted hover:cursor-pointer",
        className
      )}
    >
      <path
        d="M19.0417 3L2.99999 19.0417L19.0417 35.0833"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Pointer;
