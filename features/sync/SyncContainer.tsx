"use client";

import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import SyncCard from "./SyncCard";
import SyncOptionContainer from "./SyncOptionContainer";


const SyncContainer = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const hasSynced = useRef(false);


    const [syncedTo, setSyncedTo] = useState("Google calendar");
    const [isSyncing, setIsSyncing] = useState(false);

    useEffect(() => {
        const shouldSync = searchParams.get("calendarSync") === "true";
        if (session && shouldSync && !hasSynced.current) {
            hasSynced.current = true;
            fetch("/api/calDav/sync?service=google", { method: "POST" });
        }
    }, [session, searchParams]);
    return (
        <>
            <SyncCard syncedTo={syncedTo} setSyncedTo={setSyncedTo} />
            <SyncOptionContainer setSyncedTo={setSyncedTo} isSyncing={isSyncing} setIsSyncing={setIsSyncing} />
        </>

    );
}
export default SyncContainer


