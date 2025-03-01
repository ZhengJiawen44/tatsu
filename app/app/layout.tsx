import Sidebar from "@/components/newSidebar/SidebarContainer";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { MenuProvider } from "@/providers/MenuProvider";
import { SessionProvider } from "next-auth/react";
import QueryProvider from "@/providers/QueryProvider";
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
    <QueryProvider>
      <SessionProvider>
        <MenuProvider>
          <div className="h-screen w-screen bg-card flex">
            <Sidebar />
            {children}
          </div>
        </MenuProvider>
      </SessionProvider>
    </QueryProvider>
  );
}
