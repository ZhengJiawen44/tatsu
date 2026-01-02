import clsx from "clsx";
import React, { useEffect, useState } from "react";
import { TbRefresh } from "react-icons/tb";
import { GoCheck } from "react-icons/go";
import { cn } from "@/lib/utils";
import { useRef } from "react";

export default function TodoCheckbox({
  complete,
  onChange,
  checked,
  priority,
  variant = "outline",
}: {
  complete: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  priority: "Low" | "Medium" | "High";
  variant?: "repeat" | "outline";
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
      {variant == "outline" ? (
        <div
          onMouseDown={(e) => {
            e.stopPropagation();
            setExpand(true);
          }}
          className={clsx(
            "group w-[1rem] h-[1rem] rounded-full flex items-center justify-center border-[2.25px]",
            "hover:cursor-pointer transition-transform duration-200 ease-out",
            expand && "scale-125",
            priority === "Low" &&
              "border-lime peer-checked:bg-lime hover:bg-lime/40",
            priority === "Medium" &&
              "border-orange peer-checked:bg-orange hover-orange",
            priority === "High" && "border-red peer-checked:bg-red hover-red",
          )}
        >
          <Check priority={priority} />
        </div>
      ) : (
        <div className="relative group">
          <TbRefresh
            strokeWidth={2.3}
            onMouseDown={(e) => {
              e.stopPropagation();
              setExpand(true);
            }}
            className={clsx(
              " group w-5 h-5 flex items-center justify-center",
              "hover:cursor-pointer transition-transform duration-200 ease-out",
              expand && "scale-125",
              priority === "Low" && "text-lime peer-checked:bg-lime",
              priority === "Medium" && "text-orange peer-checked:bg-orange",
              priority === "High" && "text-red peer-checked:bg-red ",
            )}
          />
          <Check
            priority={priority}
            className="pointer-events-none absolute bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2"
          />
        </div>
      )}
    </label>
  );
}

const Check = function ({
  priority,
  className,
}: {
  priority: "Low" | "Medium" | "High";
  className?: string;
}) {
  return (
    <GoCheck
      className={cn(
        className,
        clsx(
          "w-2 h-2 text-lime hidden group-hover:block",
          priority == "Low" && "text-lime",
          priority == "Medium" && "text-orange",
          priority == "High" && "text-red",
        ),
      )}
      strokeWidth={4}
    />
  );
};
