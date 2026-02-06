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
import { useEffect, useRef, useState } from "react";
import QueryProvider from "@/providers/QueryProvider";
import NewFeaturesAnnouncement from "@/components/popups/NewFeaturesPopup";


const Provider = ({ children }: { children: React.ReactNode }) => {
  const { showMenu, isResizing } = useMenu();
  const segment = useSelectedLayoutSegment();
  const [mounted, setMounted] = useState(false);

  let variant = "default";
  if (segment == "calendar") variant = "fullWidth";
  const router = useRouter();
  const seqRef = useRef<string[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target?.isContentEditable ||
        ["INPUT", "TEXTAREA"].includes(target.tagName)
      )
        return;

      const key = e.key.toLowerCase();

      if (e.ctrlKey || e.metaKey || e.altKey) return;
      if (key.length !== 1) return;

      seqRef.current.push(key);

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

      if (seqRef.current.length === 1 && seqRef.current[0] !== "g") {
        seqRef.current = [];
      }
    };

    document.addEventListener("keydown", handler, true);
    return () => document.removeEventListener("keydown", handler, true);
  }, [router]);

  return (
    <QueryProvider>
      <NotificationProvider>
        <div className="flex min-h-screen h-screen text-xs sm:text-sm md:text-md w-full">
          <SidebarContainer />

          <div className="flex flex-col z-0 flex-1 min-w-0">
            <div
              className={clsx(
                variant == "default" &&
                "px-4 md:px-[clamp(5px,5%,10%)] lg:px-[clamp(10px,10%,20%)] xl:px-[clamp(10px,15%,20%)] 2xl:px-[clamp(10px,20%,30%)] pt-4 sm:pt-20",
                variant == "fullWidth" && "px-[clamp(5px,2%,5%)] ",
                "w-full m-auto h-full overflow-scroll scrollbar-none",
                isResizing && "",
              )}
            >
              {mounted && !showMenu && <Toaster />}
              {!showMenu && (
                <SidebarToggle className="mb-4 sm:fixed left-0 p-0 sm:left-2 md:left-3 sm:top-[35px] text-muted-foreground hover:text-foreground">
                  <SidebarIcon className="w-6 h-6 " />
                </SidebarToggle>
              )}
              <NewFeaturesAnnouncement />
              {children}
            </div>
          </div>
        </div>
      </NotificationProvider>
    </QueryProvider>
  );
};

export default Provider;