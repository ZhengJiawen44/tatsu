import LandingPage from "@/components/LandingPage";
import { auth } from "./auth";
import { redirect } from "next/navigation";
const page = async () => {
  const session = await auth();
  if (!session?.user) return <LandingPage />;
  redirect("/app/todo");
};

export default page;
