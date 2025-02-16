import React from "react";
import { auth } from "../auth";
const page = async () => {
  const session = await auth();
  if (session?.user) {
    return <></>;
  }
  return <div>page</div>;
};

export default page;
