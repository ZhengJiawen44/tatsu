import LandingPage from "@/components/LandingPage";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
const page = async () => {
  const session = await auth();
  if (!session?.user)
    return (
      <div className="px-96 bg-muted">
        <div className="h-12 flex items-center justify-between p-4 py-8">
          <Link href="/" className="font-semibold text-[1.3rem]">
            Sanity
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant={"ghost"} className="text-md">
              <Link href="/blogs">Documentation</Link>
            </Button>
            <div>|</div>
            <Button asChild variant={"ghost"} className="text-md">
              <Link href="/login">Log in</Link>
            </Button>
          </div>
        </div>
        <LandingPage />
      </div>
    );
  redirect("/app/todo");
};

export default page;
