"use client";

import clsx from "clsx";
import React, { useEffect, useRef, useState } from "react";
import { RefreshCcw } from "lucide-react";
import { cn } from "@/lib/utils";

// Matching cubic commands so the circle can interpolate into a check.
const CIRCLE_PATH =
  "M3 12C3 16.971 7.029 21 12 21C16.971 21 21 16.971 21 12C21 7.029 16.971 3 12 3C7.029 3 3 7.029 3 12";
const CHECK_PATH =
  "M4 12C4.833 12.833 5.667 13.667 6.5 14.5C7.333 15.333 8.167 16.167 9 17C10.833 15.167 12.667 13.333 14.5 11.5C16.333 9.667 18.167 7.833 20 6";

function interpolatePath(from: string, to: string, t: number) {
  const a = from.match(/-?\d*\.?\d+/g)!.map(Number);
  const b = to.match(/-?\d*\.?\d+/g)!.map(Number);
  let i = 0;
  return from.replace(/-?\d*\.?\d+/g, () => {
    const v = a[i] + (b[i] - a[i]) * t;
    i += 1;
    return v.toFixed(3);
  });
}

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

function MorphingCircleCheck({
  active,
  className,
}: {
  active: boolean;
  className?: string;
}) {
  const pathRef = useRef<SVGPathElement>(null);
  const progressRef = useRef(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;

    const from = progressRef.current;
    const to = active ? 1 : 0;
    const start = performance.now();
    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const duration = reduced ? 0 : 320 * Math.max(0.001, Math.abs(to - from));

    cancelAnimationFrame(rafRef.current);

    const tick = (now: number) => {
      const p = duration === 0 ? 1 : Math.min(1, (now - start) / duration);
      const t = from + (to - from) * easeInOutCubic(p);
      progressRef.current = t;
      path.setAttribute("d", interpolatePath(CIRCLE_PATH, CHECK_PATH, t));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [active]);

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      className={cn("pointer-events-none h-full w-full overflow-visible", className)}
    >
      <path
        ref={pathRef}
        d={CIRCLE_PATH}
        stroke="currentColor"
        strokeWidth="2.23"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function TodoCheckbox({
  className,
  complete,
  onChange,
  checked,
  priority,
  icon: Icon,
  variant = "outline-solid",
}: {
  className?: string;
  complete: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  priority: "Low" | "Medium" | "High";
  icon: React.ElementType;
  variant?: "repeat" | "outline-solid";
}) {
  const [expand, setExpand] = useState(false);
  const [hovered, setHovered] = useState(false);
  const popAudio = useRef<HTMLAudioElement | null>(null);
  const unpopAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    popAudio.current = new Audio("/pop.mp3");
    unpopAudio.current = new Audio("/unpop.mp3");
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
          if (!popAudio.current || !unpopAudio.current) return;
          if (!complete) {
            popAudio.current.currentTime = 0;
            popAudio.current.play();
          } else {
            unpopAudio.current.currentTime = 0;
            unpopAudio.current.play();
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
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={cn(
            clsx(
              "relative group flex items-center justify-center p-2 -m-2 text-current",
              "hover:cursor-pointer",
              priority === "Low" && "text-lime",
              priority === "Medium" && "text-orange",
              priority === "High" && "text-red",
            ),
            className,
          )}
        >
          <div
            className={clsx(
              "relative w-5 h-5 transition-transform duration-200 ease-out",
              expand && "scale-125",
            )}
          >
            <MorphingCircleCheck
              active={hovered && !complete}
              className={complete ? "group-hover:opacity-0" : undefined}
            />
            {complete && (
              <Icon
                className={clsx(
                  "pointer-events-none absolute bottom-1/2 translate-y-1/2 right-1/2 translate-x-1/2",
                  "hidden group-hover:block stroke-3 w-5 h-5",
                )}
              />
            )}
          </div>
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
