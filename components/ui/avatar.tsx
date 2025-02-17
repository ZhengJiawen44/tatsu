import React from "react";
import clsx from "clsx";
import Image from "next/image";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import LogoutBtn from "./logoutBtn";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
const Avatar = async () => {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  const { image, name, email } = session?.user;

  return (
    <Popover>
      <PopoverTrigger>
        <div
          className={clsx(
            "hover:bg-white hover:bg-opacity-15 p-[1.8px]",
            image ? "rounded-full" : "rounded-md"
          )}
        >
          <Image
            src={image || "avatar.svg"}
            alt="avatar-icon"
            height={35}
            width={35}
            className="rounded-full"
          />
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-fit h-fit bg-popover text-white border-none backdrop-blur-lg">
        <div className=" p-4 bg-[#D9D9D9] bg-opacity-10 rounded-t-xl  pr-10">
          <p className="text-[17px]">{name}</p>
          <p className="text-[15px] text-muted font-extralight opacity-50">
            {email}
          </p>
        </div>
        {/* menu items */}
        <div className="flex flex-col gap-2 p-1">
          <LogoutBtn />
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default Avatar;
