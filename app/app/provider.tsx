"use client";
import React from "react";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import NotificationProvider from "@/providers/NotificationProvider";
import { useMenu } from "@/providers/MenuProvider";
import clsx from "clsx";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { Toaster } from "@/components/ui/toaster";
import { useSelectedLayoutSegment } from "next/navigation";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import Announcement from "./announcement";
// import AnnouncementBanner from "@/components/AnnouncementBanner";

const Provider = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  const segment = useSelectedLayoutSegment();
  let variant = "default";
  if (segment == "calendar") variant = "fullWidth";
  const router = useRouter();
  const seqRef = useRef<string[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target.tagName)
      )
        return;

      const key = e.key.toLowerCase();

      // ignore modifiers
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (key.length !== 1) return;

      seqRef.current.push(key);

      // reset timer
      if (timerRef.current) window.clearTimeout(timerRef.current);

      timerRef.current = window.setTimeout(() => {
        seqRef.current = [];
      }, 600);

      const seq = seqRef.current.join("");

      const routes = {
        gt: { path: "/app/todo", name: "Todo" },
        gc: { path: "/app/calendar", name: "Calendar" },
        gd: { path: "/app/completed", name: "Completed" },
        gv: { path: "/app/vault", name: "Vault" },
      };

      const route = routes[seq as keyof typeof routes];

      if (route) {
        e.preventDefault();
        e.stopPropagation();

        const { path, name } = route;

        localStorage.setItem("tab", JSON.stringify({ name }));

        router.push(path);

        seqRef.current = [];
      }

      // only allow sequences starting with g
      if (seqRef.current.length === 1 && seqRef.current[0] !== "g") {
        seqRef.current = [];
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [router]);

  return (
    <NotificationProvider>
      <div className="flex min-h-screen h-screen text-xs sm:text-sm md:text-md">
        <SidebarContainer />

        <div className="flex flex-col flex-1 z-0">
          <div
            className={clsx(
              variant == "default" &&
                "px-4  md:px-[clamp(5px,5%,10%)] lg:px-[clamp(10px,10%,20%)] xl:px-[clamp(10px,15%,20%)] 2xl:px-[clamp(10px,20%,30%)]",
              variant == "fullWidth" && "px-[clamp(10px,5%,10%)]",
              "w-full m-auto h-full p-12 overflow-scroll scrollbar-none pt-[5rem]",
              isResizing && "select-none",
            )}
          >
            {!showMenu && <Toaster />}
            {!showMenu && (
              <SidebarToggle className="fixed left-2 sm:left-4 md:left-10 top-[25px] sm:top-[35px] text-muted-foreground hover:text-foreground">
                <SidebarIcon className="w-6 h-6 " />
              </SidebarToggle>
            )}
            <Announcement />
            {/* <AnnouncementBanner>
                <p className="mb-1">
                  Thank you for trying out
                  <span className="font-semibold text-white">
                    &nbsp;Tatsu.gg
                  </span>
                  ! We appreciate you exploring our demo and value your
                  feedback.
                </p>
                <p>
                  A special shoutout to
                  <span className="text-yellow-400 font-semibold">
                    &nbsp; JustPowerful Plays &nbsp;
                  </span>
                  for catching an issue where the sidebar toggle shortcut
                  conflicts with the rich text editor’s bold command.
                  <span className="italic"> You have my gratitude.</span>
                </p>
              </AnnouncementBanner> */}
            {children}
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};

export default Provider;
