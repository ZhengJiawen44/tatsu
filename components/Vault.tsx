import React from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "./AppInnerLayout";
const Vault = ({ className }: { className?: string }) => {
  return <AppInnerLayout className={cn("", className)}>Vault</AppInnerLayout>;
};

export default Vault;
