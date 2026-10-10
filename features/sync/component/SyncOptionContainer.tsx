import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { BasicAuthForm } from "./BasicAuthForm";

export default function SyncOptionContainer() {
  const t = useTranslations("sync");
  const [showAppleBasicAuthForm, setShowAppleBasicAuthForm] = useState(false);
  const [showBaikalBasicAuthForm, setShowBaikalBasicAuthForm] = useState(false);
  const [showDavicalBasicAuthForm, setShowDavicalBasicAuthForm] =
    useState(false);
  const [showNextcloudBasicAuthForm, setShowNextcloudBasicAuthForm] =
    useState(false);

  const code = (chunks: React.ReactNode) => (
    <code className="text-foreground">{chunks}</code>
  );

  return (
    <>
      <BasicAuthForm
        open={showAppleBasicAuthForm}
        setOpen={setShowAppleBasicAuthForm}
        title={t("syncToApple")}
        service="apple"
        description={
          <span>
            {t.rich("appleDescription", {
              guide: (chunks) => (
                <a
                  className="underline text-foreground"
                  target="_blank"
                  href="https://support.apple.com/en-us/102654"
                >
                  {chunks}
                </a>
              ),
            })}
          </span>
        }
        fields={[
          { id: "username", name: "username", label: t("appleId") },
          {
            id: "password",
            name: "password",
            label: t("appSpecificPassword"),
            type: "password",
          },
        ]}
      />

      <BasicAuthForm
        open={showBaikalBasicAuthForm}
        setOpen={setShowBaikalBasicAuthForm}
        title={t("syncToBaikal")}
        service="baikal"
        description={
          <span>
            {t.rich("baikalDescription", {
              link: (chunks) => (
                <a
                  className="underline text-foreground"
                  href="https://sabre.io/baikal/"
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              code,
            })}
          </span>
        }
        fields={[
          { id: "serverUrl", name: "serverUrl", label: t("serverUrl") },
          { id: "username", name: "username", label: t("username") },
          {
            id: "password",
            name: "password",
            label: t("password"),
            type: "password",
          },
        ]}
      />
      <BasicAuthForm
        open={showDavicalBasicAuthForm}
        setOpen={setShowDavicalBasicAuthForm}
        title={t("syncToDavical")}
        service="davical"
        description={
          <span>
            {t.rich("davicalDescription", {
              link: (chunks) => (
                <a
                  className="underline text-foreground"
                  href="https://www.davical.org"
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              code,
            })}
          </span>
        }
        fields={[
          { id: "serverUrl", name: "serverUrl", label: t("serverUrl") },
          { id: "username", name: "username", label: t("username") },
          {
            id: "password",
            name: "password",
            label: t("password"),
            type: "password",
          },
        ]}
      />
      <BasicAuthForm
        open={showNextcloudBasicAuthForm}
        setOpen={setShowNextcloudBasicAuthForm}
        title={t("syncToNextcloud")}
        service="nextcloud"
        description={
          <span>
            {t.rich("nextcloudDescription", {
              link: (chunks) => (
                <a
                  className="underline text-foreground"
                  href="https://nextcloud.com"
                  target="_blank"
                >
                  {chunks}
                </a>
              ),
              code,
            })}
          </span>
        }
        fields={[
          { id: "serverUrl", name: "serverUrl", label: t("serverUrl") },
          { id: "username", name: "username", label: t("username") },
          {
            id: "password",
            name: "password",
            label: t("password"),
            type: "password",
          },
        ]}
      />
      <div className="flex gap-4">
        <Button
          variant="outline"
          className=""
          onClick={() => setShowAppleBasicAuthForm(true)}
        >
          {t("appleCalendar")}
        </Button>
        <Button
          variant="outline"
          className=""
          onClick={() => setShowBaikalBasicAuthForm(true)}
        >
          {t("baikalCalendar")}
        </Button>
        <Button
          variant="outline"
          className=""
          onClick={() => setShowDavicalBasicAuthForm(true)}
        >
          {t("davicalCalendar")}
        </Button>
        <Button
          variant="outline"
          className=""
          onClick={() => setShowNextcloudBasicAuthForm(true)}
        >
          {t("nextcloudCalendar")}
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
                scope:
                  "openid email profile https://www.googleapis.com/auth/calendar",
              },
            )
          }
        >
          {t("googleCalendar")}
        </Button>
      </div>
    </>
  );
}
