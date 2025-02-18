import Image from "next/image";
import { cn } from "@/lib/utils";
import React from "react";

const Spinner = ({ className }: { className?: string }) => {
  return (
    <Image
      src="spinner.svg"
      alt="spinner"
      priority={false}
      height={28}
      width={28}
      className={cn("animate-spin", className)}
    />
  );
};

export default Spinner;
