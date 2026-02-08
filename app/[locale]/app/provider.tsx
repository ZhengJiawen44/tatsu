import QueryProvider from "@/providers/QueryProvider";
import React from "react";
import { MenuProvider } from "@/providers/MenuProvider";
import { UserPreferencesProvider } from "@/providers/UserPreferencesProvider";
const Provider = ({ children }: { children: React.ReactNode }) => {

  return (
    <>
      <QueryProvider>
        <MenuProvider>
          <UserPreferencesProvider>
            {children}
          </UserPreferencesProvider>
        </MenuProvider>
      </QueryProvider>
    </>
  );
};

export default Provider;