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
            className={`flex items-center text-sm xl:text-base gap-2 px-2 py-1 rounded-sm hover:bg-card  ${isActive ? "brightness-110 text-lime" : ""
                }`}
        >
            {children}
        </Link>
    );
}