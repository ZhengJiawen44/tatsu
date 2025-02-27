import React, { useState } from "react";
import { useSession } from "next-auth/react";
import clsx from "clsx";
import { useMenu } from "@/providers/MenuProvider";
import TodoCollapsible from "./TodoCollapsible";
import NoteCollapsible from "./NoteCollapsible";

const UserPanel = () => {
  const { activeMenu, setActiveMenu, setShowMobileSidebar } = useMenu();
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
          <button
            className={clsx(
              "text-[1.3rem] w-fit hover:text-white ml-1",
              activeMenu === "Vault" && "text-white"
            )}
            onClick={() => {
              setActiveMenu("Vault");
              setShowMobileSidebar(false);
              localStorage.setItem("prevTab", "Vault");
            }}
          >
            Vault
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserPanel;
