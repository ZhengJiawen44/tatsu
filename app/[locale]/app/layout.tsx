import { Suspense } from "react";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Provider from "./provider";
import NavigationSpinner from "./NavigationSpinner";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import Spinner from "@/components/ui/spinner";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getCompletedTodos,
  getProjectMetaData,
  getUserPreferences,
  getTodayTodos,
  getPinnedTodo,
  getUserTimezone,
} from "./actions";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
      <NavigationSpinner />
      <Suspense fallback={<AppLoading />}>
        <AuthenticatedApp>{children}</AuthenticatedApp>
      </Suspense>
    </Provider>
  );
}

function AppLoading() {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-background/60">
      <Spinner className="h-16 w-16 text-foreground" />
    </div>
  );
}

async function AuthenticatedApp({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ["userPreferences"],
      queryFn: getUserPreferences,
    }),
    queryClient.prefetchQuery({
      queryKey: ["todo"],
      queryFn: getTodayTodos,
    }),
    queryClient.prefetchQuery({
      queryKey: ["pinnedTodo"],
      queryFn: getPinnedTodo,
    }),
    queryClient.prefetchQuery({
      queryKey: ["completedTodo"],
      queryFn: getCompletedTodos,
    }),
    queryClient.prefetchQuery({
      queryKey: ["projectMetaData"],
      queryFn: getProjectMetaData,
    }),
    queryClient.prefetchQuery({
      queryKey: ["userTimezone"],
      queryFn: getUserTimezone,
      staleTime: Infinity,
    }),
  ]);

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex h-screen min-h-screen w-full text-xs sm:text-sm md:text-md">
        <SidebarContainer />
        <div className="flex h-full min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </HydrationBoundary>
  );
}
