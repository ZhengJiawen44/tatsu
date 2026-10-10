"use client";
import { useTranslations } from "next-intl";
import SyncCard from "./SyncCard";
import BasicAuthSyncButtonGroup from "./BasicAuthSyncButtonGroup";
import { OauthSyncButtonGroup } from "./OauthSyncButtonGroup";

const SyncContainer = () => {
  const t = useTranslations("sync");
  return (
    <>
      <SyncCard />
      <div className="flex gap-4 flex-wrap">
        <BasicAuthSyncButtonGroup />
        <OauthSyncButtonGroup />
      </div>

      <h1 className="text-muted-foreground mt-40 -rotate-12 m-auto  w-fit">
        {t("workInProgress")}
      </h1>
    </>
  );
};
export default SyncContainer;
