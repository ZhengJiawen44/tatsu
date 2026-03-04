import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react';
import React, { SetStateAction, useState } from 'react'
import { BasicAuthForm } from './BasicAuthForm';

type SyncOptionContainerProp = {
    isSyncing: boolean,
    setIsSyncing: React.Dispatch<SetStateAction<boolean>>
    setSyncedTo: React.Dispatch<SetStateAction<string>>
}

export default function SyncOptionContainer({ setSyncedTo, isSyncing, setIsSyncing }: SyncOptionContainerProp) {
    const [showAppleBasicAuthForm, setShowAppleBasicAuthForm] = useState(false);
    const [showBaikalBasicAuthForm, setShowBaikalBasicAuthForm] = useState(false);
    const [showDavicalBasicAuthForm, setShowDavicalBasicAuthForm] = useState(false);


    return (

        <>
            <BasicAuthForm
                isSyncing={isSyncing}
                setIsSyncing={setIsSyncing}
                open={showAppleBasicAuthForm}
                setOpen={setShowAppleBasicAuthForm}
                title="Sync to Apple Calendar"
                service="apple"
                description={
                    <span>
                        Follow <a className="underline text-foreground" target="_blank" href="https://support.apple.com/en-us/102654">this guide</a> to get your Apple ID and app-specific password.
                    </span>
                }
                fields={[
                    { id: "username", name: "username", label: "Apple ID" },
                    { id: "password", name: "password", label: "App specific password", type: "password" },
                ]}
                onSuccess={(data) => {
                    setSyncedTo("Apple");
                    console.log(data)
                }
                }

            />

            <BasicAuthForm
                isSyncing={isSyncing}
                setIsSyncing={setIsSyncing}
                open={showBaikalBasicAuthForm}
                setOpen={setShowBaikalBasicAuthForm}
                title="Sync to Baikal"
                service="baikal"
                description={
                    <span>
                        <a className="underline text-foreground" href="https://sabre.io/baikal/" target="_blank">
                            Baikal
                        </a>{" "}
                        is an open-source self-hosted CalDAV server. Use the username and password
                        you created in your Baikal admin panel. The server URL is the address of
                        your Baikal instance followed by <code className="text-foreground">/dav.php</code>{" "}
                        (e.g. <code className="text-foreground">http://localhost:8800/dav.php</code>).
                    </span>
                }
                fields={[
                    { id: "serverUrl", name: "serverUrl", label: "Server URL" },
                    { id: "username", name: "username", label: "Username" },
                    { id: "password", name: "password", label: "Password", type: "password" },
                ]}
                onSuccess={(data) => {
                    setSyncedTo("Baikal");
                    console.log(data)
                }
                }
            />
            <BasicAuthForm
                isSyncing={isSyncing}
                setIsSyncing={setIsSyncing}
                open={showDavicalBasicAuthForm}
                setOpen={setShowDavicalBasicAuthForm}
                title="Sync to DAViCal"
                service="davical"
                description={
                    <span>
                        <a className="underline text-foreground" href="https://www.davical.org" target="_blank">
                            DAViCal
                        </a>{" "}
                        is an open-source self-hosted CalDAV server. Use the
                        username and password you created in your DAViCal admin panel. The server
                        URL is your DAViCal instance followed by{" "}
                        <code className="text-foreground">/caldav.php/username/</code>{" "}
                        (e.g.{" "}
                        <code className="text-foreground">http://localhost:8080/caldav.php/username/</code>
                        ).
                    </span>
                }
                fields={[
                    { id: "serverUrl", name: "serverUrl", label: "Server URL" },
                    { id: "username", name: "username", label: "Username" },
                    { id: "password", name: "password", label: "Password", type: "password" },
                ]}
                onSuccess={(data) => {
                    setSyncedTo("DAViCal");
                    console.log(data)
                }}
            />
            <div className="flex gap-4">
                <Button
                    variant="outline"
                    className=""
                    onClick={() => setShowAppleBasicAuthForm(true)}
                >
                    Apple Calendar
                </Button>
                <Button
                    variant="outline"
                    className=""
                    onClick={() => setShowBaikalBasicAuthForm(true)}
                >
                    Baikal Calendar
                </Button>
                <Button
                    variant="outline"
                    className=""
                    onClick={() => setShowDavicalBasicAuthForm(true)}
                >
                    DAViCal Calendar
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

            </div>

        </>

    )
}
