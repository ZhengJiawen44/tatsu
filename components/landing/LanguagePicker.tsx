"use client"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ChevronDown } from "lucide-react";
export default function LanguagePicker() {
  const locale = useLocale();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="bg-border flex items-center gap-2 px-3 py-1 rounded-sm">{locale}<ChevronDown className="w-3 h-3" /></DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild><Link href={"/"} locale="en">English</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="ru">Русский</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="es">Español</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="ja">日本語</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="ar">العربية</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="zh">中文</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="de">Deutsch</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="it">Italiano</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="ms">Melayu</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="pt">Português</Link></DropdownMenuItem>
        <DropdownMenuItem asChild><Link href={"/"} locale="fr">Français</Link></DropdownMenuItem>



      </DropdownMenuContent>
    </DropdownMenu>
  )
}
