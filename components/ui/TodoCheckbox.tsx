import React from "react";
export default function TodoCheckbox({
  onChange,
  checked,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}) {
  return (
    <label className="" onPointerDown={(e) => e.stopPropagation()}>
      <input
        onPointerDown={(e) => e.stopPropagation()}
        type="checkbox"
        className="peer hidden"
        onChange={onChange}
        defaultChecked={checked}
      />
      <div className="w-[1rem] h-[1rem] border border-lime rounded-full flex items-center hover:cursor-pointer justify-center hover:bg-lime peer-checked:bg-lime peer-checked:border-lime"></div>
    </label>
  );
}
