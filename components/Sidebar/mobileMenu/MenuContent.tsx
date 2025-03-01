import React, { useState } from "react";
import { useSession } from "next-auth/react";
import TodoCollapsible from "./TodoCollapsible";
import NoteCollapsible from "./NoteCollapsible";
import VaultCollapsible from "./VaultCollapsible";
import LogoutBtn from "@/components/ui/logoutBtn";
import LineSeparator from "@/components/ui/lineSeparator";
import Image from "next/image";

const UserPanel = () => {
  const session = useSession()?.data;
  const user = session?.user;

  // Track open states
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div>
      <div className="ml-1 flex gap-3 justify-start items-start w-full ">
        {user?.image ? (
          <Image
            alt="user image"
            src={user.image}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full"
          />
        ) : (
          ""
        )}
        <div className="w-full pr-7">
          <p>{user?.name || user?.email}</p>
          <p className="text-card-foreground-muted">{user?.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2 my-16 w-full pr-4">
        {/* Todo section */}
        <TodoCollapsible
          openSection={openSection}
          setOpenSection={setOpenSection}
        />
        {/* Note section */}
        <NoteCollapsible
          openSection={openSection}
          setOpenSection={setOpenSection}
        />

        {/* Vault Section */}
        <VaultCollapsible />
        <LineSeparator className="mb-3" />
        <LogoutBtn className="hover:bg-transparent text-[1rem] hover:text-white" />
      </div>
    </div>
  );
};

export default UserPanel;
