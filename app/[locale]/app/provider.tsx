"use client"
import React from "react";
import { MenuProvider } from "@/providers/MenuProvider";
const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <MenuProvider>
      {children}
    </MenuProvider>
  );
};

export default Provider;