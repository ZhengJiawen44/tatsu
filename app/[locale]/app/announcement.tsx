"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { Settings as Gear } from "lucide-react";
import { CornerUpRight as Shortcut } from "lucide-react";

export default function Announcement() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  // simply change this boolean to the opposite if you want the banner to be displayed once again
  const flipMeToShowBanner = true;

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const showBanner = localStorage.getItem("showBanner");
    if (!showBanner) {
      localStorage.setItem("showBanner", flipMeToShowBanner ? "true" : "false");
      setShowModal(flipMeToShowBanner);
    } else {
      // Set modal state based on stored value and flipMeToShowBanner flag
      setShowModal(
        flipMeToShowBanner ? showBanner === "true" : showBanner === "false",
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const scrollTo = (index: number) => {
    api?.scrollTo(index);
  };

  return (
    <>
      <Dialog
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          localStorage.setItem(
            "showBanner",
            JSON.stringify(flipMeToShowBanner ? open : !open),
          );
        }}
      >
        <DialogContent className="p-5 pb-10" showCloseButton={false}>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-muted-foreground">
              What&apos;s New
            </DialogTitle>
            {/* Navigation dots */}
            <div className="flex justify-start gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-opacity ${
                    current === index
                      ? "bg-muted-foreground"
                      : "bg-muted-foreground opacity-20"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
          <Carousel setApi={setApi} className="w-full min-w-0 overflow-hidden">
            <CarouselContent>
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
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
