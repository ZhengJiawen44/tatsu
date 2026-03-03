"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Modal, ModalClose, ModalContent, ModalDescription, ModalHeader, ModalOverlay, ModalTitle } from "@/components/ui/Modal";
import { X } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { SetStateAction, useEffect, useRef, useState } from "react";


const Page = () => {
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const hasSynced = useRef(false);

    const [showBasicAuthForm, setShowBasicAuthForm] = useState(false);
    useEffect(() => {
        const shouldSync = searchParams.get("calendarSync") === "true";
        if (session && shouldSync && !hasSynced.current) {
            hasSynced.current = true;
            fetch("/api/calDav/sync?service=google", { method: "POST" });
        }
    }, [session, searchParams]);
    return (
        <>
            {showBasicAuthForm && <BasicAuthForm open={showBasicAuthForm} setOpen={setShowBasicAuthForm} />}
            <Button
                variant="outline"
                className=""
                onClick={() => setShowBasicAuthForm(true)}
            >
                Apple Calendar
            </Button>
            <Button
                variant="outline"
                className=""
                onClick={() =>
                    signIn(
                        "google",
                        { callbackUrl: "/app/sync?calendarSync=true" },
                        {
                            prompt: "consent",
                            access_type: "offline",
                            scope: "openid email profile https://www.googleapis.com/auth/calendar",
                        }
                    )
                }
            >
                Google Calendar
            </Button>
        </>

    );
}
export default Page

type BasicAuthFormProps = {
    open: boolean,
    setOpen: React.Dispatch<SetStateAction<boolean>>
}

const BasicAuthForm = ({ open, setOpen }: BasicAuthFormProps) => {
    return (
        <Modal open={open} onOpenChange={setOpen}>
            <ModalOverlay>
                <ModalContent className="relative">
                    <ModalHeader>
                        <ModalTitle>Sync to apple calendar</ModalTitle>
                        <ModalDescription className="my-2">
                            <span>For apple you want to go to this <a className="underline text-foreground" target="_blank" href="https://support.apple.com/en-us/102654">page</a> and after following the guide, you will have Apple ID and app-specific password.</span>
                        </ModalDescription>
                    </ModalHeader>
                    <ModalClose className="absolute top-2 right-4 text-muted-foreground hover:text-foreground h-4 w-4"><X /></ModalClose>

                    <form className="flex flex-col gap-4" onSubmit={
                        async (e) => {
                            e.preventDefault()
                            const formData = new FormData(e.currentTarget);
                            const data = Object.fromEntries(formData.entries());
                            await fetch("/api/calDav/sync?service=apple", { method: "POST", body: JSON.stringify(data) });
                        }}>
                        <div>
                            <label className="block" htmlFor="appleId">Apple ID *</label>
                            <Input id="appleId" name="appleId" type="text"></Input>
                        </div>
                        <div>
                            <label htmlFor="appSpecificPassword">App specific password *</label>
                            <Input id="appSpecificPassword" name="appSpecificPassword" type="text"></Input>
                        </div>

                        <div className="flex gap-4 mt-4 justify-end">
                            <ModalClose>
                                <Button
                                    type="button"
                                    variant="destructive">
                                    Cancel
                                </Button>
                            </ModalClose>

                            <Button
                                type="submit"
                                variant="outline">
                                Sync
                            </Button>
                        </div>

                    </form>
                </ModalContent>
            </ModalOverlay>

        </Modal>
    )
}