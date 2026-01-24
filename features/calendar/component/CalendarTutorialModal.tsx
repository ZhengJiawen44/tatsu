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

export default function CalendarTutorialModal() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const showBanner = localStorage.getItem("showCalendarTutorial");
    if (!showBanner) {
      localStorage.setItem("showCalendarTutorial", "true");
      setShowModal(true);
    } else {
      setShowModal(showBanner === "true");
    }
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
          localStorage.setItem("showCalendarTutorial", "false");
        }}
      >
        <DialogContent
          className="p-5 pb-10 w-full max-w-full min-w-0 overflow-hidden"
          showCloseButton={false}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 min-w-0">
            <DialogTitle className="text-xl text-muted-foreground">
              Calendar guide for mobile
            </DialogTitle>
            {/* Navigation dots */}
            <div className="flex justify-start gap-2">
              {[0, 1, 2].map((index) => (
                <button
                  key={index}
                  onClick={() => scrollTo(index)}
                  className={`w-2 h-2 rounded-full transition-opacity ${current === index
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
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}
