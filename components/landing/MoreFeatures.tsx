"use client";
import React from "react";
import { useTranslations } from "next-intl";

export default function MoreFeatures() {
  const dict = useTranslations("landingPage.moreFeatures");
  const features = [0, 1, 2, 3, 4, 5].map((i) => ({
    title: dict(`${i}.title`),
    description: dict(`${i}.description`),
  }));

  return (
    <>
      {features.map(({ title, description }) => (
        <div
          key={title}
          className="rounded-md w-96 p-4 text-start border bg-background shadow-xs"
        >
          <p className="text-lg font-semibold mb-2">{title}</p>
          <p className="text-muted-foreground">{description}</p>
        </div>
      ))}
    </>
  );
}
