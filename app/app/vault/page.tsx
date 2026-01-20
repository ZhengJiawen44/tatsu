"use client";
import React from "react";
import Vault from "@/features/vault/component/VaultContainer";
import PassKeyProvider from "@/providers/PassKeyProvider";
const Page = () => {
  return (
    <PassKeyProvider>
      <Vault />
    </PassKeyProvider>
  );
};

export default Page;
