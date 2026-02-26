import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { redirect } from '@/i18n/navigation';
import React from 'react'

export default function LanguageDropdown() {
    const languages = [["English", "en"], ["Русский", "ru"], ["Español", "es"], ["日本語", "ja"], ["العربية", "ar"], ["中文", "zh"], ["Deutsch", "de"], ["Italiano", "it"], ["Melayu", "ms"], ["Português", "pt"], ["Français", "fr"]];
    return languages.map(([name, locale]) =>
        <DropdownMenuItem key={name} asChild>
            <div onClick={() => redirect({ href: "/app/todo", locale })}>{name}</div>
        </DropdownMenuItem>)
}
