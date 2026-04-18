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
      <header className="bg-[#111322] border-b-2 shrink-0 p-6 flex items-center gap-5">
        <Image src="/Logo.png" alt="Logo" width={90} height={40} />
        <Link href="/documentation" className="text-lg tracking-tight text-blue-400 font-thin">Docs</Link>
      </header>

      <div className="flex flex-1 bg-[#111322] overflow-hidden">
        {/* Sidebar */}
        <aside className="hidden md:flex w-96 shrink-0 flex-col border-r bg-[#111322] overflow-y-auto">
          <nav className="flex-1 py-8 space-y-1">
            <NavLink href="/documentation">Intro</NavLink>
            <NavLink href="/documentation/recurrence-model">Recurrence model</NavLink>
            <NavLink href="/documentation/data-model">Data model</NavLink>
            <NavLink href="/documentation/caldav-sync">Caldav Sync</NavLink>
          </nav>
        </aside>

        {/* Main area */}
        <main className="flex-1 overflow-y-auto p-16 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
