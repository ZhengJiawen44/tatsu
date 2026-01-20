import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserCardLoading from "./UserCardLoading";
import SidebarIcon from "@/components/ui/icon/sidebar";
import Sidebar from "@/components/ui/SidebarToggle";
import { cn } from "@/lib/utils";
import { redirect } from "next/navigation";
const UserCard = ({ className }: { className?: string }) => {
  const { data, status } = useSession();

  if (status === "loading") return <UserCardLoading />;
  if (!data) return redirect("/login");

  const { user } = data;

  return (
    <>
      <div
        className={cn(
          "my-3 flex justify-between items-center rounded-lg py-2 px-2 transition-all duration-200",
          className,
        )}
      >
        <div className="overflow-hidden flex gap-3 justify-start items-center select-none">
          {user?.image && (
            <Image
              src={user?.image}
              alt="user image"
              width={32}
              height={32}
              className="rounded-md"
            />
          )}
          <div className="flex flex-col gap-[3px]">
            <p className=" truncate font-[500]">
              {user?.name || user?.email?.split("@")[0] || "User"}
            </p>
            <p className="truncate text-muted-foreground  text-xs">
              {user?.email}
            </p>
          </div>
        </div>
        <Sidebar className="text-muted-foreground hover:text-foreground">
          <SidebarIcon className="w-6 h-6  " />
        </Sidebar>
      </div>
    </>
  );
};

export default UserCard;
