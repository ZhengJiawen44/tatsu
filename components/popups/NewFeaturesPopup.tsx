import { Settings as Gear } from "lucide-react";
import { CornerUpRight as Shortcut } from "lucide-react";
import AnnouncementModal from "../ui/popup";
import Image from "next/image";
import React from 'react'
import { CarouselItem } from "../ui/carousel";

export default function NewFeaturesAnnouncement() {
    return (
        <AnnouncementModal popupName="newFeaturesModal" title="What's New" resetPopupToggle={true} >
            <CarouselItem>
                <Image
                    className="rounded-lg m-auto mb-6"
                    src={"/calendarDemo.png"}
                    width={900}
                    height={300}
                    alt="example of weekly recurring todo"
                    loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-2">Calendar view</h3>
                <p className="text-muted-foreground">
                    A new calendar view can be found in the left sidebar,
                    calendars are great for visualizing and planning your todos
                    throughout the week
                </p>
            </CarouselItem>
            <CarouselItem>
                <Image
                    className="border border-t-0 rounded-lg m-auto mb-6"
                    src={"/nlpDemo.png"}
                    width={900}
                    height={300}
                    alt="example of weekly recurring todo"
                    loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-2">
                    Dates in natural language
                </h3>
                <p className="text-muted-foreground">
                    employ Natural language processing right in your todo title
                    field to describe a start date or a duration
                </p>
            </CarouselItem>
            <CarouselItem>
                {/* <KeyboardShortcuts /> */}
                <Image
                    className="border border-t-0 rounded-lg m-auto mb-6"
                    src={"/shortcutDemo.png"}
                    width={900}
                    height={300}
                    alt="example of weekly recurring todo"
                    loading="lazy"
                />
                <h3 className="text-xl font-semibold mb-2">Shortcuts</h3>
                <p className="text-muted-foreground">
                    Use intuitive shortcuts to perform your most important
                    workflows without leaving the keyboard.
                </p>
                <div className="text-muted-foreground">
                    shortcuts can be viewed in
                    <p className="text-foreground inline">
                        <Gear className="inline mx-1" />
                        Settings
                        <span className="mx-2">{">"}</span>
                        <Shortcut className="inline mr-1" />
                        Shortcuts
                    </p>
                </div>
            </CarouselItem ></AnnouncementModal>
    )
}
