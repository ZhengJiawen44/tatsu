import Taskbar from "@/components/Taskbar";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
import { MenuProvider } from "@/providers/MenuProvider";
export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }
  return (
    <MenuProvider>
      <div className="h-screen flex flex-col">
        <Taskbar />
        <div className="w-full xl:p-[50px] xl:px-[80px] h-full">{children}</div>
      </div>
    </MenuProvider>
  );
}
