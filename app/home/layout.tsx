import Taskbar from "@/components/Taskbar";
export default async function layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Taskbar />
      {children}
    </>
  );
}
