import React from "react";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
const page = () => {
  return (
    <>
      <ErrorBoundary
        fallback={
          <>something went wrong, dont worry, we sent an error report.</>
        }
      >
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
      </ErrorBoundary>
    </>
  );
};

export default page;
