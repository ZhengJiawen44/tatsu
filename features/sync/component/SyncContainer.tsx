"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import SyncCard from "./SyncCard";
import SyncOptionContainer from "./SyncOptionContainer";


const SyncContainer = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const hasSynced = useRef(false);

    useEffect(() => {
        const shouldSync = searchParams.get("calendarSync") === "true";
        if (session && shouldSync && !hasSynced.current) {
            hasSynced.current = true;
            fetch("/api/calDav/sync?service=google", { method: "POST" });
        }
    }, [session, searchParams]);
    return (
        <>
            <SyncCard />
            <SyncOptionContainer />
            <h1 className="text-muted-foreground mt-40 -rotate-12 m-auto  w-fit">Work in progress</h1>
        </>

    );
}
export default SyncContainer


