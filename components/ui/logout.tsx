"use client";
import React from "react";
import Image from "next/image";

import { signOut } from "next-auth/react";

const LogoutBtn = () => {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/login" });
  };
  return (
    <button
      onClick={() => handleLogout()}
      className="flex justify-start items-center gap-2 w-full hover:bg-form-border rounded-md px-3 py-1"
    >
      <Image src={"x.svg"} alt="logout-icon" height={20} width={20} />
      logout
    </button>
  );
};

export default LogoutBtn;
