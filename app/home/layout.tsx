import Taskbar from "@/components/Taskbar";
import { auth } from "@/app/auth";
import { redirect } from "next/navigation";
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
    <div className="h-screen flex flex-col">
      <Taskbar />
      <div className="w-full p-[50px] px-[80px] h-full">{children}</div>
    </div>
  );
}
