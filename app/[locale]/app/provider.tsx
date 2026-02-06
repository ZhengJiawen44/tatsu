import React from "react";
import QueryProvider from "@/providers/QueryProvider";
import { MenuProvider } from "@/providers/MenuProvider";
const Provider = async ({ children }: { children: React.ReactNode }) => {
  return (
    <MenuProvider>
      <QueryProvider>
        {children}
      </QueryProvider>
    </MenuProvider>
  );
};

export default Provider;