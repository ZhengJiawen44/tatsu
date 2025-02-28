"use client";
import React from "react";
import Image from "next/image";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

const LogoutBtn = ({ className }: { className?: string }) => {
  const handleLogout = async () => {
    await signOut({ redirectTo: "/login" });
  };
  return (
    <button
      onClick={() => handleLogout()}
      className={cn(
        "flex justify-start items-center gap-2 w-full hover:bg-form-border rounded-lg px-3 py-1",
        className
      )}
    >
      <Image src={"x.svg"} alt="logout-icon" height={15} width={15} />

      <p className="text-[1rem]">Log out</p>
    </button>
  );
};

export default LogoutBtn;
