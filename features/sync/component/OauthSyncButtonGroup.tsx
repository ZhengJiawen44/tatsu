import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useOauthSync } from "../hook/useOauthSync";
import { OauthSyncPlaceholder } from "./OauthSyncPlaceholder";

export const OauthSyncButtonGroup = () => {
  const t = useTranslations("sync");
  const { status: googleSyncStatus } = useOauthSync({ service: "google" });

  return (
    <>
      {googleSyncStatus == "pending" && <OauthSyncPlaceholder />}
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
    </>
  );
};
