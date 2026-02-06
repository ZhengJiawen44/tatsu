"use client"
import React, { useEffect, useRef, useState } from 'react'
import { useMenu } from "@/providers/MenuProvider";
import SidebarIcon from "@/components/ui/icon/sidebar";
import SidebarToggle from "@/components/ui/SidebarToggle";
import { Toaster } from "@/components/ui/toaster";
import { useRouter } from 'next/navigation';

export default function SidebarToggleContainer() {
  const { showMenu } = useMenu();
  const [mounted, setMounted] = useState(false);
  const seqRef = useRef<string[]>([]);
  const router = useRouter();
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

  return (<>
    {mounted && !showMenu && <Toaster />}
    {!showMenu && (
      <SidebarToggle className="mb-4 sm:fixed left-0 p-0 sm:left-2 md:left-3 sm:top-[35px] text-muted-foreground hover:text-foreground">
        <SidebarIcon className="w-6 h-6 " />
      </SidebarToggle>
    )}
  </>
  )
}
