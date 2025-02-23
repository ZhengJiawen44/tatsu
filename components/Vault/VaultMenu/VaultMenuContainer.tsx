import React, { SetStateAction, useEffect, useState } from "react";
import VaultMenuItem from "./VaultMenuItem";
import Plus from "@/components/ui/icon/plus";
import Clock from "@/components/ui/icon/clock";
import Star from "@/components/ui/icon/star";
import Caret from "@/components/ui/icon/caret";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";
import Spinner from "@/components/ui/spinner";
const VaultMenuContainer = ({
  isPending,
  setPending,
}: {
  isPending: boolean;
  setPending: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);

  //post file
  async function handleFileUpload() {
    if (!file) {
      toast({ description: "the given file was not found" });
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/vault", {
      method: "POST",
      body: formData,
    });
    const body = await res.json();
    toast({ description: body.message });
  }
  const { mutate, isPending: createPending } = useMutation({
    mutationFn: handleFileUpload,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vault"] });
    },
  });
  useEffect(() => {
    setPending(createPending);
  }, [createPending]);

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
                  mutate();
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
        {isPending && <Spinner />}
      </div>
    </div>
  );
};

export default VaultMenuContainer;
