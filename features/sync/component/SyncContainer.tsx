"use client";
import { useTranslations } from "next-intl";
import SyncCard from "./SyncCard";
import SyncOptionContainer from "./SyncOptionContainer";
import { useOauthSync } from "../hook/useOauthSync";
import { OauthSyncPlaceholder } from "./OauthSyncPlaceholder";

const SyncContainer = () => {
  const t = useTranslations("sync");
  const { status: googleSyncStatus } = useOauthSync({ service: "google" });
  return (
    <>
      {googleSyncStatus == "pending" && <OauthSyncPlaceholder />}
      <SyncCard />
      <SyncOptionContainer />
      <h1 className="text-muted-foreground mt-40 -rotate-12 m-auto  w-fit">
        {t("workInProgress")}
      </h1>
    </>
  );
};
export default SyncContainer;
