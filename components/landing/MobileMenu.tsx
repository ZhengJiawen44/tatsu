"use client";

import { Menu } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useTranslations } from "next-intl";

export const MobileNavigation = () => {
  const [showMenu, setShowMenu] = useState(false);
  const dict = useTranslations("landingPage");
  return (
    <div className="sm:hidden">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        variant="ghost"
        className="text-muted-foreground hover:text-foreground! hover:bg-border"
      >
        <Menu />
      </Button>
      {showMenu && (
        <>
          <div
            onClick={() => setShowMenu(!showMenu)}
            className="bg-black opacity-85 absolute z-100 top-17 bottom-0 right-0 left-0"
          />
          <div className="absolute top-17 z-200 right-0 left-0 h-fit bg-muted pb-4 flex flex-col gap-2">
            <div className="w-full py-2 px-4 hover:bg-card">
              <Link href="/blogs">{dict("nav.docs")}</Link>
            </div>
            <div className="w-full py-2 px-4 hover:bg-card">
              <Link href="/login" aria-label="Start by logging in">
                {dict("nav.login")}
              </Link>
            </div>
            <div className="w-full py-2 px-4 hover:bg-card">
              <Link
                target="_blank"
                href="https://github.com/ZhengJiawen44/tatsu"
              >
                Github
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
