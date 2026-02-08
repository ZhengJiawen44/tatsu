import React from "react";

const UserCardLoading = () => {
  return (
    <>
      <button
        className="flex gap-2 justify-center items-center w-fit select-none rounded-md py-1 px-2 transition-all duration-200"
        disabled
      >
        <div className="rounded-full w-7 h-7 animate-pulse bg-border" />
        <p className="w-32 h-4 animate-pulse rounded-md bg-border"></p>
      </button>
    </>
  );
};

export default UserCardLoading;
