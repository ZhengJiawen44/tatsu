import LandingPage from "@/components/landing/LandingPage";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getTranslations } from "next-intl/server"
import LanguagePicker from "@/components/landing/LanguagePicker";
import { Github } from "lucide-react";


const Page = async () => {
  const session = await auth();
  const dict = await getTranslations("landingPage");
  if (!session?.user)
    return (
      <div className="bg-muted">
        {/* Responsive Header/Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
          <div className="flex items-center justify-between py-3 ">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center justify-center shrink-0"
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
                  <span className="hidden sm:inline">{dict("nav.docs")}</span>
                  <span className="sm:hidden">{dict("nav.docsShort")}</span>
                </Link>
              </Button>
              <div className="text-muted-foreground">|</div>
              <Button
                asChild
                variant={"ghost"}
                className="text-sm sm:text-base px-2 sm:px-4"
              >
                <Link href="/login" aria-label="Start by logging in">{dict("nav.login")}</Link>
              </Button>

              {/* Github link */}
              <Link
                target="_blank"
                className="flex justify-center items-center p-2 px-3 border rounded-full bg-background hover:bg-popover text-muted-foreground hover:text-foreground"
                href="https://github.com/ZhengJiawen44/tatsu">
                <Github className="w-4 h-4" />
              </Link>

              <LanguagePicker />
            </div>
          </div>

        </div>

        {/* Landing Page Content */}
        <LandingPage />


      </div>
    );
  redirect("/app/todo");
};

export default Page;
