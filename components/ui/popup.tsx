"use client";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ReactElement, useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  type CarouselApi,
  type CarouselItem
} from "@/components/ui/carousel";

type PopupProps = {
  popupName: string,
  title: string,
  resetPopupToggle: boolean // simply change this boolean to the opposite if you want the banner to be displayed once again

  children: ReactElement<typeof CarouselItem>[]
}

export default function Popup({ popupName, title, resetPopupToggle, children }: PopupProps) {
  const localStorageName = `show${popupName[0].toUpperCase() + popupName.slice(1)}`;
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const showModal = localStorage.getItem(localStorageName);
    if (!showModal) {
      localStorage.setItem(localStorageName, resetPopupToggle ? "true" : "false");
      setShowModal(true);
    } else {
      setShowModal(
        resetPopupToggle ? showModal === "true" : showModal === "false",
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
            localStorageName,
            JSON.stringify(resetPopupToggle ? open : !open),
          );
        }}
      >
        <DialogContent className="p-5 pb-10">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl text-muted-foreground">
              {title}
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
              {children}
            </CarouselContent>
          </Carousel>
        </DialogContent>
      </Dialog>
    </>
  );
}

