import React from "react";
import Link from "next/link";
const page = () => {
  return (
    <>
      <div className="font-poppins text-[2rem] p-4 rounded-xl bg-card w-40 m-auto mt-10">
        <Link href="/login" className="block m-auto w-fit">
          login
        </Link>
      </div>
      <div className="font-poppins text-[2rem] p-4 rounded-xl bg-card w-40 m-auto mt-10">
        <Link href="/register" className="block m-auto w-fit">
          register
        </Link>
      </div>
    </>
  );
};

export default page;
