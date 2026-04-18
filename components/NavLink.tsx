"use client";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/navigation";

export default function NavLink({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const isActive = pathname.replace(/^\/[^/]+/, "") === href;


    return (
        <Link
            href={href}
            className={`flex items-center gap-2 px-8  py-2 text-lg hover:bg-card  ${isActive ? "bg-card brightness-110 font-semibold  border-foreground border-l-3" : ""
                }`}
        >
            {children}
        </Link>
    );
}