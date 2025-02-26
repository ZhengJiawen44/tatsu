import React, { SetStateAction, useEffect, useState } from "react";
import VaultMenuItem from "./VaultMenuItem";
import Plus from "@/components/ui/icon/plus";
import Clock from "@/components/ui/icon/clock";
import Star from "@/components/ui/icon/star";
import Caret from "@/components/ui/icon/caret";
import Spinner from "@/components/ui/spinner";
import { useCreateFile } from "@/hooks/useVault";
import { usePassKey } from "@/providers/PassKeyProvider";

const VaultMenuContainer = ({
  isProcessing,
  setProcessing,
}: {
  isProcessing: boolean;
  setProcessing: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const { symKey, enableEncryption } = usePassKey();
  const [file, setFile] = useState<File | null>(null);

  //upload a file mutation function
  const { createFile, createLoading } = useCreateFile();
  // useEffect to trigger upload when file changes
  useEffect(() => {
    if (file && typeof enableEncryption === "boolean") {
      createFile({ file, symKey, enableEncryption });
    }
  }, [file]);

  //update pending state
  useEffect(() => {
    setProcessing(createLoading);
  }, [createLoading]);
  return (
    <div className="mt-24">
      <div className="flex justify-between">
        <div className="flex gap-5 mb-5 text-[0.9rem]">
          <label className="flex justify-center items-center gap-2 bg-border rounded-lg p-1 px-3 hover:cursor-pointer hover:bg-tooltip transition-all duration-150">
            <Plus className="w-5 h-5" />
            <input
              type="file"
              className="hidden"
              onInput={(e) => {
                const files = e.currentTarget.files;
                if (files && files.length > 0) {
                  setFile(files[0]);
                  // Reset input
                  e.currentTarget.value = "";
                }
              }}
            />
            new
          </label>

          <VaultMenuItem>
            <Clock className="w-5 h-5" />
            recent
          </VaultMenuItem>
          <VaultMenuItem>
            <Star className="w-4 h-4" />
            favourite
          </VaultMenuItem>
          <VaultMenuItem>
            Type
            <Caret className="w-4 h-4" />
          </VaultMenuItem>
          <VaultMenuItem>
            Modified
            <Caret className="w-4 h-4" />
          </VaultMenuItem>
        </div>
        {isProcessing && <Spinner />}
      </div>
    </div>
  );
};

export default VaultMenuContainer;
