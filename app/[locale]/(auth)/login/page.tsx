import { redirect } from "next/navigation";
import { auth } from "@/app/auth";

import LoginPage from "./Login";
const page = async () => {
  const session = await auth();
  if (!session?.user) return <LoginPage />;
  redirect("/app/todo");
};
export default page;
