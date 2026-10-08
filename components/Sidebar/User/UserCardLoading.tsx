import React from "react";

const UserCardLoading = () => {
  return (
    <>
      <button
        className="flex gap-2 my-3 h-15.5 justify-center items-center w-fit select-none rounded-md py-1 px-2 transition-all duration-200"
        disabled
      >
        <div className="rounded-md w-8 h-8 animate-pulse bg-accent" />
        <p className="w-32 h-8 animate-pulse rounded-sm bg-accent"></p>
      </button>
    </>
  );
};

export default UserCardLoading;
