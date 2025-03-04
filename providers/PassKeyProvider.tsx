import React, {
  createContext,
  SetStateAction,
  useState,
  useContext,
} from "react";
import { useQuery } from "@tanstack/react-query";

interface passKeyContextProp {
  passKey?: string;
  setPassKey: React.Dispatch<SetStateAction<string | undefined>>;
  protectedSymmetricKey?: string;
  setProtectedSymmetricKey: React.Dispatch<SetStateAction<string | undefined>>;
  enableEncryption?: boolean;
  passKeyLoading: boolean;
  symKey?: string;
  setSymKey: React.Dispatch<SetStateAction<string | undefined>>;
}

//initialize a passkey provider to store user passKey client-side, should use session storage
const passKeyContext = createContext<passKeyContextProp | undefined>(undefined);

const PassKeyProvider = ({ children }: { children: React.ReactNode }) => {
  const [passKey, setPassKey] = useState<string | undefined>();
  const [enableEncryption, setEnableEncryption] = useState<
    boolean | undefined
  >();
  const [protectedSymmetricKey, setProtectedSymmetricKey] = useState<
    string | undefined
  >();
  const [symKey, setSymKey] = useState<string | undefined>();
  const { data, isLoading: passKeyLoading } = useQuery({
    queryFn: async () => {
      const user = await fetch("/api/user", { method: "GET" });
      const body = await user.json();
      const { queriedUser } = body;
      setProtectedSymmetricKey(queriedUser.protectedSymmetricKey);
      setEnableEncryption(queriedUser.enableEncryption);
      return queriedUser.protectedSymmetricKey;
    },
    queryKey: ["encryption"],
  });

  //debugging
  // console.log("pass key: ", passKey);
  // console.log("protSymKey: ", protectedSymmetricKey);
  // console.log("symKey: ", symKey);
  // console.log("enable Enc: ", enableEncryption);

  return (
    <passKeyContext.Provider
      value={{
        symKey,
        setSymKey,
        passKeyLoading,
        passKey,
        setPassKey,
        protectedSymmetricKey,
        setProtectedSymmetricKey,
        enableEncryption,
      }}
    >
      {children}
    </passKeyContext.Provider>
  );
};
export function usePassKey() {
  const context = useContext(passKeyContext);
  if (!context) {
    throw new Error("usePassKey must be used in NoteProvider");
  }
  return context;
}

export default PassKeyProvider;
