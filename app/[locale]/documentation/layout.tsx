import Image from "next/image";
import { Link } from "@/i18n/navigation";
import NavLink from "@/components/NavLink";
export default function DocumentationLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Header bar */}
      <header className="bg-[#111322]/80 border-b shrink-0 py-3 px-8 flex items-center gap-8">
        <Image src="/Logo.png" alt="Logo" width={50} height={20} />
        <Link href="/documentation" className="tracking-tight text-lime font-thin">Docs</Link>
        <div className="w-[400px] rounded-md border m-auto p-1 text-muted-foreground px-4">search</div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 2xl:w-96 shrink-0 flex-col border-r bg-[#111322]/30 overflow-y-auto px-4">
          <nav className="flex-1 py-5 space-y-1">
            <NavLink href="/documentation">Intro</NavLink>
            <NavLink href="/documentation/recurrence-model">Recurrence model</NavLink>
            <NavLink href="/documentation/data-model">Data model</NavLink>
            <NavLink href="/documentation/caldav-sync">Caldav Sync</NavLink>
          </nav>
        </aside>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-16 min-w-0 bg-[#111322]/80">
          {children}
        </main>
      </div>
    </div>
  );
}




