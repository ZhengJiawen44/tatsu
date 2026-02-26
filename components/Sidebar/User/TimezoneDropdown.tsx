import { DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { redirect } from '@/i18n/navigation';
import React from 'react'

export default function TimezoneDropdown() {
    const timezones = Intl.getCanonicalLocales()
    console.log(timezones)
    // return languages.map(([name, locale]) =>
    //     <DropdownMenuItem key={name} asChild>
    //         <div onClick={() => redirect({ href: "/app/todo", locale })}>{name}</div>
    //     </DropdownMenuItem>)
}
