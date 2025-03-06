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
          "flex justify-between items-center hover:cursor-pointer hover:bg-border-muted rounded-md py-1 px-2 transition-all duration-200",
          className
        )}
      >
        <div className="overflow-hidden flex gap-2 justify-start items-center select-none">
          {user?.image && (
            <Image
              src={user?.image}
              alt="user image"
              width={28}
              height={28}
              className="rounded-full"
            />
          )}
          <p className="truncate">{user?.name || user?.email?.split("@")[0]}</p>
        </div>
        <Sidebar>
          <SidebarIcon className="w-6 h-6" />
        </Sidebar>
      </div>
    </>
  );
};

export default UserCard;
