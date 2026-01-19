import LandingPage from "@/components/LandingPage";
import { auth } from "./auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";

const page = async () => {
  const session = await auth();
  if (!session?.user)
    return (
      <div className="bg-muted">
        {/* Responsive Header/Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3 sm:py-4">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center justify-center flex-shrink-0"
            >
              <Image
                className="rounded-lg shadow-2xl"
                src={"/Logo.png"}
                width={60}
                height={15}
                alt="logo"
                loading="lazy"
              />
            </Link>

            {/* Navigation */}
            <div className="flex items-center gap-2 sm:gap-4">
              <Button
                asChild
                variant={"ghost"}
                className="text-sm sm:text-base px-2 sm:px-4"
              >
                <Link href="/blogs">
                  <span className="hidden sm:inline">Documentation</span>
                  <span className="sm:hidden">Docs</span>
                </Link>
              </Button>
              <div className="text-muted-foreground">|</div>
              <Button
                asChild
                variant={"ghost"}
                className="text-sm sm:text-base px-2 sm:px-4"
              >
                <Link href="/login">Log in</Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Landing Page Content */}
        <LandingPage />
      </div>
    );
  redirect("/app/todo");
};

export default page;
