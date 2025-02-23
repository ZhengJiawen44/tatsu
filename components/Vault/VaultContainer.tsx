import React from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "../AppInnerLayout";
import SearchBar from "../ui/SearchBar";
import VaultMenuContainer from "./VaultMenu/VaultMenuContainer";
import VaultListItem from "./VaultListItem";

const Vault = ({ className }: { className?: string }) => {
  return (
    <AppInnerLayout className={cn("mt-20", className)}>
      <SearchBar />
      <VaultMenuContainer />
      <VaultListItem />
    </AppInnerLayout>
  );
};

export default Vault;
