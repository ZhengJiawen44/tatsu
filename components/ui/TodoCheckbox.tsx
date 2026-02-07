"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw } from "lucide-react";

export default function TodoCheckbox({
  complete,
  onChange,
  checked,
  priority,
  icon: Icon,
  variant = "outline-solid"
}: {
  complete: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  priority: "Low" | "Medium" | "High";
  icon: React.ElementType;
  variant?: "repeat" | "outline-solid";
}) {
  const [expand, setExpand] = useState(false);
  const popAudio = useRef<HTMLAudioElement | null>(null);
  const unpopAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popAudio.current = new Audio("/pop.mp3");
    unpopAudio.current = new Audio("/unPop.mp3");
  }, []);

  useEffect(() => {
    if (expand) {
      const timeout = setTimeout(() => setExpand(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [complete, expand]);

  return (
    <label onPointerDown={(e) => e.stopPropagation()}>
      <input
        onPointerDown={(e) => e.stopPropagation()}
        type="checkbox"
        className="peer hidden"
        onChange={(e) => {
          onChange(e);
        }}
        onClick={() => {
          if (!complete) {
            if (popAudio.current) popAudio.current.currentTime = 0;
            popAudio.current?.play();
          } else {
            if (unpopAudio.current) unpopAudio.current.currentTime = 0;
            unpopAudio.current?.play();
          }
        }}
        checked={checked}
      />

      {variant === "outline-solid" ? (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            setExpand(true);
          }}
          className={clsx(
            "relative group w-5 h-5 rounded-full flex items-center justify-center border-[2.23px]",
            "hover:cursor-pointer transition-transform duration-200 ease-out hover:border-transparent",
            expand && "scale-125",
            priority === "Low" && "border-lime ",
            priority === "Medium" && "border-orange ",
            priority === "High" && "border-red",
          )}
        >
          <Icon
            className={clsx(
              "pointer-events-none absolute bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2",
              "hidden group-hover:block stroke-3 w-5 h-5",
              priority === "Low" && "text-lime",
              priority === "Medium" && "text-orange",
              priority === "High" && "text-red",
            )}
          />
        </div>
      ) : (
        <div className="relative group">
          <RefreshCcw
            strokeWidth={2.35}
            onMouseDown={(e) => {
              e.stopPropagation();
              setExpand(true);
            }}
            className={clsx(
              "group w-[1.35rem] h-[1.35rem] flex items-center justify-center",
              "hover:cursor-pointer hover:stroke-transparent",
              priority === "Low" && "text-lime peer-checked:bg-lime",
              priority === "Medium" && "text-orange peer-checked:bg-orange",
              priority === "High" && "text-red peer-checked:bg-red",
            )}
          />

          <Icon
            className={clsx(
              "pointer-events-none absolute bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2 transition-transform duration-200 ease-out",
              "hidden group-hover:block stroke-3 w-5 h-5",
              expand && "scale-125",
              priority === "Low" && "text-lime",
              priority === "Medium" && "text-orange",
              priority === "High" && "text-red",
            )}
          />
        </div>
      )}
    </label>
  );
}
