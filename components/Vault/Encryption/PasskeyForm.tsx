import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { stretchMasterKey } from "@/lib/encryption/stretchMasterKey";
import { genSymmetricKey } from "@/lib/encryption/genSymmetricKey";
import { toast } from "@/hooks/use-toast";
import AppInnerLayout from "@/components/AppInnerLayout";
import EyeToggle from "@/components/ui/eyeToggle";
import { cn } from "@/lib/utils";

const PasskeyForm = ({
  className,
  email,
}: {
  className?: string;
  email: string;
}) => {
  const [passKey, setPassKey] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();
  const { mutate: enableEncMutate } = useMutation({
    mutationFn: async ({ enable }: { enable: boolean }) => {
      const res = await fetch(`/api/user?enableEncryption=${enable}`, {
        method: "PATCH",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encryptionStatus"] });
    },
  });

  // mutate for setting a protected symmetric key
  const { mutate } = useMutation({
    mutationFn: async () => {
      if (email && passKey) {
        //derive master key from user input pass key
        const masterKey = await stretchMasterKey({ email: email, passKey });
        //generate protected symmetric key
        const protectedSymmetricKey = await genSymmetricKey(masterKey);
        //base64 encode the string for transport
        const encodedKey = btoa(String.fromCharCode(...protectedSymmetricKey));

        //post the symmetric key to database
        const res = await fetch("/api/user", {
          method: "PATCH",
          body: JSON.stringify({ protectedSymmetricKey: encodedKey }),
        });
        const body = await res.json();
        toast({ description: body.message });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["encryptionStatus"] });
    },
  });
  return (
    <AppInnerLayout className={cn("", className)}>
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col border p-9 w-1/2 gap-4 rounded-xl">
          <h3>encryption passkey</h3>
          <div className="block">
            we encrypt your files if you provide a passkey. keep this secure as
            we would not be able to replace it if lost.
          </div>

          <div className="relative h-8">
            <input
              onChange={(e) => setPassKey(e.currentTarget.value)}
              value={passKey}
              name="passKey"
              required
              type={showPassword !== true ? "password" : "text"}
              className="bg-transparent outline-none border h-full px-2 pr-9 absolute w-full rounded-md"
            />
            <EyeToggle
              show={showPassword}
              setShow={setShowPassword}
              className="right-2"
            />
          </div>

          <button
            onClick={() => mutate()}
            className="mt-4 w-full bg-lime rounded-sm text-black h-8"
          >
            Enter
          </button>

          <div className="text-[0.9rem]">
            you may optionally skip this feature for now.
            <button
              className="ml-2 border hover:underline hover:bg-card-foreground hover:text-black rounded-md px-2"
              onClick={() => enableEncMutate({ enable: false })}
            >
              skip
            </button>
          </div>
        </div>
      </div>
    </AppInnerLayout>
  );
};

export default PasskeyForm;
