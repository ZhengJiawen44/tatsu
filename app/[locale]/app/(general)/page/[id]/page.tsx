import PageContainer from "@/features/page/component/PageContainer";
import React from "react";

interface PageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  return <PageContainer pageId={id} />;
}
