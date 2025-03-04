import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { MenuProvider } from "@/providers/MenuProvider";
import { SessionProvider } from "next-auth/react";
import AppLayout from "@/components/AppLayout";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider>
      <MenuProvider>
        <AppLayout>{children}</AppLayout>
      </MenuProvider>
    </SessionProvider>
  );
}
