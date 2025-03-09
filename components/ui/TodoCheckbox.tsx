import clsx from "clsx";
import React, { useEffect, useState } from "react";

export default function TodoCheckbox({
  complete,
  onChange,
  checked,
  priority,
}: {
  complete: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
  priority: "Low" | "Medium" | "High";
}) {
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const pop = new Audio("/pop.mp3");
    const unpop = new Audio("/unPop.mp3");
    if (expand) {
      if (complete) {
        unpop.play();
      } else {
        pop.play();
      }

      const timeout = setTimeout(() => setExpand(false), 150); // Slightly longer for visibility
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
          setExpand(true); // Trigger animation on change
          onChange(e);
        }}
        checked={checked} // Ensure reactivity
      />
      <div
        onMouseDown={(e) => {
          e.stopPropagation();
          setExpand(true);
        }}
        className={clsx(
          "w-[1rem] h-[1rem] rounded-full flex items-center justify-center border-2",
          "hover:cursor-pointer hover:bg-lime peer-checked:bg-lime peer-checked:border-lime",
          "transition-transform duration-200 ease-out",
          expand && "scale-125",
          priority === "Low"
            ? "border-lime"
            : priority === "Medium"
            ? " border-orange"
            : " border-red"
        )}
      ></div>
    </label>
  );
}
