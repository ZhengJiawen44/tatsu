import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Provider from "./provider";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";

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
    <Provider>
      {/* Timezone bootstrap */}
      <script
        async
        dangerouslySetInnerHTML={{
          __html: `
                (function () {
                  try {
                    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

                    fetch("/api/timezone", {
                      method: "GET",
                      headers: {
                        "X-User-Timezone": tz,
                      },
                      credentials: "same-origin",
                    });
                  } catch (_) {}
                })();
              `,
        }}
      />
      <div className="flex min-h-screen h-screen text-xs sm:text-sm md:text-md w-full">
        <SidebarContainer />
        <div className="flex flex-col z-0 flex-1 min-w-0">
          {children}
        </div>
      </div>
    </Provider>

  );
}
