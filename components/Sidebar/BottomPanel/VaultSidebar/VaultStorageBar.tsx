import React from "react";
import LineSeparator from "@/components/ui/lineSeparator";
import { getDisplaySize } from "@/components/getDisplaySize";

interface VaultStorageBarProps {
  usedStorage: number;
  maxStorage: number;
  percentage: string;
}

const VaultStorageBar = ({
  usedStorage,
  maxStorage,
  percentage,
}: VaultStorageBarProps) => {
  return (
    <>
      <div className="mb-10">
        <h2 className="flex gap-2 items-center text-[1.4rem]">Vault</h2>
        <LineSeparator />
      </div>

      <div className="w-full h-8 rounded-full bg-border relative mb-4">
        <div
          style={{ width: `${percentage}%` }}
          className="left-0 top-0  h-8 rounded-full bg-lime absolute transition-all duration-500 ease-in-out shadow-[0_0_1px_#aaff00,0_0_2px_#aaff00,0_0_15px_#aaff00]"
        ></div>
      </div>

      <p>{`${getDisplaySize(usedStorage)} of ${getDisplaySize(
        maxStorage
      )} used`}</p>
    </>
  );
};

export default VaultStorageBar;
