import { Search } from 'lucide-react';

type SearchBarProps = {
    onInput: (e: React.FormEvent<HTMLInputElement>) => void
}

export default function SearchBar({ onInput }: SearchBarProps) {

    return (
        <>
            <div className="flex border items-center gap-2 bg-popover px-2 rounded-md focus-within:ring-2 focus-within:ring-ring">
                <Search className="w-4 h-4" />
                <input
                    onInput={(e) => onInput(e)}
                    className="w-full rounded-md outline-none focus:outline-none py-1 text-base font-medium placeholder:font-medium placeholder:text-base tracking-tighter placeholder:tracking-tighter"
                    placeholder="Search shortcuts"
                />
            </div>
        </>

    )
}
