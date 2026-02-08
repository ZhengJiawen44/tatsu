import QueryProvider from "@/providers/QueryProvider";
import React from "react";
import { MenuProvider } from "@/providers/MenuProvider";
const Provider = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <QueryProvider>
        <MenuProvider>
          {children}
        </MenuProvider>
      </QueryProvider>
    </>
  );
};

export default Provider;