import LandingPage from "@/components/landing/LandingPage";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import LanguagePicker from "@/components/landing/LanguagePicker";
import { Github } from "lucide-react";
import { MobileNavigation } from "@/components/landing/MobileMenu";

const Page = async () => {
  const session = await auth();
  const dict = await getTranslations("landingPage");
  if (!session?.user)
    return (
      <div className="bg-muted relative">
        {/* Responsive Header/Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-[100]!">
          <div className="flex items-center justify-between py-3 ">
            {/* Logo */}
            <Link
              href="/"
              className="flex items-center justify-center shrink-0"
            >
              <Image
                className="rounded-lg shadow-2xl"
                src={"/favicon.ico"}
                width={23}
                height={23}
                alt="logo"
                loading="lazy"
              />
              <span className="tracking-wide ml-1 font-semibold text-lime brightness-120">
                Tatsu
              </span>
            </Link>

            {/* pc Navigation */}
            <div className="hidden sm:flex items-center gap-2 sm:gap-4">
              <Button
                asChild
                variant={"ghost"}
                className="text-sm sm:text-base px-1! hover:bg-transparent"
              >
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <span className="hidden sm:inline text-sm">
                    {dict("nav.docs")}
                  </span>
                </Link>
              </Button>
              <Button
                asChild
                variant={"ghost"}
                className="text-sm sm:text-base px-1! hover:bg-transparent text-muted-foreground hover:text-foreground"
              >
                <Link
                  href="/login"
                  className="text-sm!"
                  aria-label="Start by logging in"
                >
                  {dict("nav.login")}
                </Link>
              </Button>
              <div className="text-muted-foreground">|</div>

              {/* Github link */}
              <Link
                target="_blank"
                className="flex justify-center items-center p-2 px-3 border rounded-full bg-background hover:bg-popover text-muted-foreground hover:text-foreground"
                href="https://github.com/ZhengJiawen44/tatsu"
              >
                <Github className="w-4 h-4" />
              </Link>

              <LanguagePicker />
            </div>
            {/* mobile Navigation */}
            <MobileNavigation />
          </div>
        </div>

        {/* Landing Page Content */}
        <LandingPage />
      </div>
    );
  redirect("/app/todo");
};

export default Page;
