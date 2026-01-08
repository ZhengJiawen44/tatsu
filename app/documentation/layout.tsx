// layout.tsx
import { GoHome } from "react-icons/go";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full h-16 p-4 border mb-4">
        <a href="/app/todo">
          <GoHome className="w-8 h-8 text-foreground/50 hover:text-foreground" />
        </a>
      </div>
      <div className="flex flex-col xl:flex-row justify-between gap-6 lg:gap-10 px-4 sm:px-8 md:px-16 lg:px-32  2xl:px-80">
        {children}
      </div>
    </>
  );
}
