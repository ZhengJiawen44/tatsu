import React from "react";
export default function TodoCheckbox({
  onChange,
  checked,
}: {
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  checked: boolean;
}) {
  return (
    <label className="">
      <input
        type="checkbox"
        className="peer hidden"
        onChange={onChange}
        defaultChecked={checked}
      />
      <div className="w-6 h-6 border-2 border-lime rounded-full flex items-center hover:cursor-pointer justify-center hover:bg-lime peer-checked:bg-lime peer-checked:border-lime"></div>
    </label>
  );
}
