import Image from 'next/image'
import React from 'react'
import { useTranslations } from 'next-intl'
export default function FlagsCarousel() {
    const landingDict = useTranslations("landingPage")
    return (
        <div className='flex flex-col '>
            <div className='relative py-5 bg-background mb-7 overflow-hidden'>
                {/* Left fade */}
                <div className='absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-muted to-transparent z-10' />

                {/* Right fade */}
                <div className='absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-muted to-transparent z-10' />

                {/* Scrolling content */}
                <div className='flex animate-scroll-left' style={{ animationDuration: '20s' }}>
                    <FlagImage />
                    <FlagImage />
                    <FlagImage />
                </div>
            </div>
            <p className='text-muted-foreground text-sm md:text-xl'>{landingDict("localizationTitle")}</p>
        </div>
    )
}

const FlagImage = () => {
    return <Image
        src={"/flags.png"}
        height={50}
        width={1430}
        alt="flag on display"
        className='brightness-75 flex-shrink-0'
        loading='lazy'
    />
}