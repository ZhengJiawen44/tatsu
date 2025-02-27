/* this form appears on initial page load.
 * it collects user passkey and sets up some values for the passKeyProvider
 * to use for decrypting/encrypting vault items
 * */

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import AppInnerLayout from "@/components/AppInnerLayout";
import EyeToggle from "@/components/ui/eyeToggle";
import { usePassKey } from "@/providers/PassKeyProvider";
import { stretchMasterKey } from "@/lib/encryption/stretchMasterKey";
import base64Encode from "@/lib/encryption/base64Encode";
import { base64Decode } from "@/lib/encryption/base64Decode";
import { useToast } from "@/hooks/use-toast";

const DecryptForm = ({
  className,
  email,
  inert,
}: {
  className?: string;
  email: string;
  inert?: boolean;
}) => {
  const { toast } = useToast();
  const { setPassKey, protectedSymmetricKey, setSymKey, symKey } = usePassKey();
  const [inputPassKey, setInputPassKey] = useState<string>("");
  const [showPassword, setShowPassword] = useState(false);

  async function decryptSymKey() {
    try {
      //derive the master key form user pass key
      const masterKey = await stretchMasterKey({
        email: email,
        passKey: inputPassKey,
      });

      //base 64 to uint8Array the sym key
      const protectedSymKeyArray = base64Decode(protectedSymmetricKey!);
      const iv = new Uint8Array(protectedSymKeyArray).slice(0, 16);
      const protectedSymKey = new Uint8Array(protectedSymKeyArray).slice(16);

      const decryptedSymKey = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv },
        masterKey,
        protectedSymKey
      );
      setSymKey(base64Encode(decryptedSymKey));
      setPassKey(inputPassKey);
    } catch (e) {
      toast({ description: "invalid passkey entered" });
    }
  }
  return (
    <AppInnerLayout className={cn("", className)} inert={inert}>
      <div className="flex justify-center items-center h-full w-full">
        <div className="flex flex-col border p-9 w-full sm:w-[85%] md:w-[70%] lg:w-[60%] xl:w-full 2xl:w-1/2  gap-4 rounded-xl">
          <h3>Passkey</h3>
          <div className="block">
            we need your pass key to decrypt your files
          </div>

          <div className="relative h-8">
            <input
              name="passKey"
              value={inputPassKey}
              onChange={(e) => {
                setInputPassKey(e.currentTarget.value);
              }}
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
            className="mt-4 w-full bg-lime rounded-sm text-black h-8"
            onClick={() => decryptSymKey()}
          >
            Enter
          </button>
        </div>
      </div>
    </AppInnerLayout>
  );
};

export default DecryptForm;
