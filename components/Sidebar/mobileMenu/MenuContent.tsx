import React, { useState } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { useMenu } from "@/providers/MenuProvider";
import TodoCollapsible from "./TodoCollapsible";
import NoteCollapsible from "./NoteCollapsible";
import VaultCollapsible from "./VaultCollapsible";

const UserPanel = () => {
  const session = useSession()?.data;
  const user = session?.user;

  // Track open states
  const [openSection, setOpenSection] = useState<string | null>(null);

  return (
    <div className="ml-1 flex gap-3 justify-start items-start">
      {user?.image ? (
        <img src={user.image} className="w-10 h-10 rounded-full"></img>
      ) : (
        ""
      )}
      <div>
        <p>{user?.name || user?.email}</p>
        <p className="text-card-foreground-muted">{user?.email}</p>
        <div className="flex flex-col gap-2 my-16">
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
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
