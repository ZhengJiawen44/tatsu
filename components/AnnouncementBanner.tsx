"use client";
import clsx from "clsx";
import Plus from "./ui/icon/plus";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const AnnouncementBanner = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  const [showAnnoucement, setshowAnnoucement] = useState(true);
  useEffect(() => {
    const showAnnoucement = localStorage.getItem("showAnnoucement");
    if (showAnnoucement) setshowAnnoucement(showAnnoucement === "true");
  }, []);
  useEffect(() => {
    localStorage.setItem("showAnnoucement", JSON.stringify(showAnnoucement));
  }, [showAnnoucement]);
  return (
    <div
      className={clsx(
        cn(
          "relative w-full mb-10 rounded-lg border border-gray-700 bg-gray-800 p-4 text-[0.9rem] text-gray-300 shadow-md",
          className
        ),
        !showAnnoucement && "hidden"
      )}
    >
      <div className="m-2">{children}</div>
      <button
        className="absolute top-2 right-2 text-gray-400 hover:text-white transition"
        onClick={() => setshowAnnoucement(false)}
      >
        <Plus className="w-5 h-5 rotate-45" />
      </button>
    </div>
  );
};

export default AnnouncementBanner;
