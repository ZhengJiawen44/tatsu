import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import UserCardLoading from "./UserCardLoading";

const UserCard = () => {
  const { data } = useSession();
  if (!data) {
    return <UserCardLoading />;
  }
  const { user } = data;

  return (
    <>
      <div className=" flex gap-2 justify-center items-center w-fit select-none hover:cursor-pointer hover:bg-border rounded-md py-1 px-2 transition-all duration-200">
        {user?.image && (
          <Image
            src={user?.image}
            alt="user image"
            width={28}
            height={28}
            className="rounded-full"
          />
        )}
        <p>{user?.name || user?.email}</p>
      </div>
    </>
  );
};

export default UserCard;
