import React from "react";

const UserCard = () => {
  return (
    <>
      <div className="flex gap-2 justify-center items-center w-fit select-none hover:cursor-pointer hover:bg-border rounded-md py-1 px-2 transition-all duration-200">
        <div className="rounded-full w-7 h-7 animate-pulse bg-border" />

        <p className="w-32 h-4 animate-pulse rounded-sm bg-border"></p>
      </div>
    </>
  );
};

export default UserCard;
