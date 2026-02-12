import Image from 'next/image'
import React from 'react'
import { useTranslations } from 'next-intl'
export default function FlagsCarousel() {
    const landingDict = useTranslations("landingPage")

    return (
        <div className='flex flex-col'>
            <div className='relative py-5  bg-background mb-7 w-screen overflow-hidden'>
                {/* Left fade */}
                <div className='absolute left-0 top-0 bottom-0 w-32 bg-linear-to-r from-muted to-transparent z-10' />
                {/* Right fade */}
                <div className='absolute right-0 top-0 bottom-0 w-32 bg-linear-to-l from-muted to-transparent z-10' />

                {/* Scrolling content */}
                <div className='flex justify-center items-center animate-scroll-left'>
                    <FlagImage />
                    <FlagImage aria-hidden />
                    <FlagImage aria-hidden />
                    <FlagImage aria-hidden />
                    <FlagImage aria-hidden />
                    <FlagImage aria-hidden />
                </div>
            </div>
            <p className='text-muted-foreground text-sm md:text-base'>{landingDict("localizationTitle")}</p>
        </div>
    )
}

const FlagImage = ({ className }: { className?: string }) => {
    return (
        <Image
            src="/flags.png"
            width={1430}
            height={50}
            alt="flag on display"
            className={`brightness-75 shrink-0 grow-0 w-[700px] md:w-[1000px] lg:w-[1430px] h-auto ${className || ""} `}
            loading="lazy"
        />
    )
}
