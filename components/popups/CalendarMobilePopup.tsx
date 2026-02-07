import React from 'react'
import Popup from '../ui/popup'
import { CarouselItem } from '../ui/carousel'
import Image from 'next/image'

export default function CalendarMobilePopup() {
    return (
        <Popup
            title='Calendar guide for mobile'
            popupName='calendarMobilePopup'
            resetPopupToggle={true}
        >
            <CarouselItem className="min-w-0 flex flex-col justify-center">
                <h3 className="text-2xl font-semibold mb-2">Tutorial</h3>
                <p className=" text-lg text-muted-foreground">
                    Calendar events can also be resized or moved via drag-n-drop
                    on mobile, but with a few caveats.
                </p>
            </CarouselItem>
            <CarouselItem className="min-w-0">
                <Image
                    className="rounded-lg m-auto mb-6 w-full max-w-full h-auto"
                    src={"/tutorialMove.png"}
                    width={900}
                    height={300}
                    alt="example of weekly recurring todo"
                    loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-2">To move an event</h3>
                <div className="text-muted-foreground">
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li> click on an event to select it</li>
                        <li>click on the event again to hide the popoup</li>
                        <li> drag and drop the event wherever you like</li>
                    </ol>
                </div>
            </CarouselItem>
            <CarouselItem className="min-w-0">
                {/* <KeyboardShortcuts /> */}
                <Image
                    className="rounded-lg m-auto mb-6 w-full max-w-full h-auto"
                    src={"/tutorialResize.png"}
                    width={900}
                    height={300}
                    alt="example of weekly recurring todo"
                    loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-2">
                    To resize an event
                </h3>
                <div className="text-muted-foreground">
                    <ol className="list-decimal list-inside mt-2 space-y-1">
                        <li> click on an event to select it</li>
                        <li> click on the resize handle</li>
                        <li> drag and drop the handle to resize</li>
                    </ol>
                </div>
            </CarouselItem></Popup>
    )
}
