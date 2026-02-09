import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import Provider from "./provider";
import SidebarContainer from "@/components/Sidebar/SidebarContainer";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCompletedTodos, getProjectMetaData, getUserPreferences, getTodayTodos, getUserTimezone } from "./actions";


export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const queryClient = new QueryClient();

  // Prefetch preferences
  await queryClient.prefetchQuery({
    queryKey: ["userPreferences"],
    queryFn: getUserPreferences,
  });

  //Prefetch todos
  await queryClient.prefetchQuery({
    queryKey: ["todo"],
    queryFn: getTodayTodos
  });

  //Prefetch completedTodos 
  await queryClient.prefetchQuery({
    queryKey: ["completedTodo"],
    queryFn: getCompletedTodos
  });

  //Prefetch projectMetaData
  await queryClient.prefetchQuery({
    queryKey: ["projectMetaData"],
    queryFn: getProjectMetaData
  });

  //prefetch user timezone
  await queryClient.prefetchQuery({
    queryKey: ["userTimezone"],
    queryFn: getUserTimezone,
    staleTime: Infinity
  });

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
      <HydrationBoundary state={dehydrate(queryClient)}>
        <div className="flex min-h-screen h-screen text-xs sm:text-sm md:text-md w-full">
          <SidebarContainer />
          <div className="flex flex-col z-0 flex-1 min-w-0">
            {children}
          </div>
        </div>
      </HydrationBoundary>

    </Provider>

  );
}
