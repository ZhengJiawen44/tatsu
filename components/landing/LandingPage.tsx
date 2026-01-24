"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Footer from "./Footer";
import EyeToggle from "../ui/eyeToggle";
import { useTranslations } from "next-intl";
import FlagsCarousel from "./FlagsCarousel";

const LandingPage = () => {
  const dict = useTranslations("landingPage");
  const [activeFeature, setActiveFeature] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Build features array from translations
  const FEATURES = [
    {
      id: 1,
      tag: dict("features.0.tag"),
      title: dict("features.0.title"),
      description: dict("features.0.description"),
      bullets: [
        dict("features.0.bullets.0"),
        dict("features.0.bullets.1"),
        dict("features.0.bullets.2"),
        dict("features.0.bullets.3"),
      ],
      image: "/NLPDemo.avif",
    },
    {
      id: 2,
      tag: dict("features.1.tag"),
      title: dict("features.1.title"),
      description: dict("features.1.description"),
      bullets: [
        dict("features.1.bullets.0"),
        dict("features.1.bullets.1"),
        dict("features.1.bullets.2"),
        dict("features.1.bullets.3"),
      ],
      image: "/calendarDemo.avif",
    },
    {
      id: 3,
      tag: dict("features.2.tag"),
      title: dict("features.2.title"),
      description: dict("features.2.description"),
      bullets: [
        dict("features.2.bullets.0"),
        dict("features.2.bullets.1"),
        dict("features.2.bullets.2"),
        dict("features.2.bullets.3"),
      ],
      image: "/editorDemo.avif",
    },
    {
      id: 4,
      tag: dict("features.3.tag"),
      title: dict("features.3.title"),
      description: dict("features.3.description"),
      bullets: [
        dict("features.3.bullets.0"),
        dict("features.3.bullets.1"),
        dict("features.3.bullets.2"),
        dict("features.3.bullets.3"),
      ],
      image: "/e2eeDemo.png",
    },
  ];

  // IntersectionObserver for feature images
  useEffect(() => {
    const observerRefsCopy = observerRefs;
    const options = {
      root: null,
      rootMargin: "-50% 0px -50% 0px",
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute("data-index"));
          setActiveFeature(index);
        }
      });
    }, options);

    observerRefsCopy.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      observerRefsCopy.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  // Scroll listener for 3D tilt
  useEffect(() => {
    const onScroll = () => {
      const max = 400; // pixels to flatten
      const scrolled = Math.min(window.scrollY, max);
      setScrollProgress(scrolled / max);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Compute 3D transform
  const initialRotateX = 10; // tilt backward
  const initialRotateY = -5; // slight side tilt
  const initialTranslateZ = -50; // pull back

  const rotateX = initialRotateX * (1 - scrollProgress);
  const rotateY = initialRotateY * (1 - scrollProgress);
  const translateZ = initialTranslateZ * (1 - scrollProgress);

  const [showPassword, setShowPassword] = useState(false);

  return (
    <ErrorBoundary
      fallback={
        <p className="text-red-500 text-center p-4">
          {dict("errors.fallback")}
        </p>
      }
    >
      <div className="flex flex-col gap-10 items-center justify-center text-foreground text-center px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className=" flex flex-col items-center gap-6 sm:gap-8 lg:gap-9 mb-16 sm:mb-24 lg:mb-32 pt-12 sm:pt-16 lg:pt-20 max-w-7xl w-full">
          <div className="flex-1 w-full">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold mb-4 sm:mb-6">
              {dict("hero.title")}
            </h1>
            <p className="text-base sm:text-lg lg:text-xl max-w-2xl mx-auto mb-6 sm:mb-8 px-4">
              {dict("hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4">
              <Link href="/blogs" className="z-50 w-full sm:w-auto">
                <Button
                  variant={"outline"}
                  className="w-full sm:w-auto font-normal text-foreground px-6 py-5 sm:p-6 text-base sm:text-lg rounded-lg shadow-md hover:translate-y-[2px] transition-transform duration-100"
                >
                  {dict("hero.readDocs")}
                </Button>
              </Link>
              <Link href="/login" className="z-50 w-full sm:w-auto">
                <Button className="w-full sm:w-auto text-foreground px-6 py-5 sm:p-6 text-base sm:text-lg font-semibold rounded-lg shadow-md hover:translate-y-[2px] transition-transform duration-100">
                  {dict("hero.start")}
                </Button>
              </Link>
            </div>
          </div>

          {/* Hero Image with 3D Tilt Hidden on mobile, visible on tablet+ */}
          <div className="flex-2 hidden sm:block w-full mt-8 lg:mt-0">
            <div
              style={{ perspective: "1200px" }}
              className="w-full flex justify-center"
            >
              <div
                style={{
                  transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.1s ease-out",
                  willChange: "transform",
                }}
                className="w-full max-w-5xl relative"
              >
                <Image
                  className="border rounded-lg m-auto mb-6 shadow-2xl w-full h-auto"
                  src={"/heroImage.png"}
                  width={1200}
                  height={500}
                  alt="hero Image"
                  loading="eager"
                />
              </div>
            </div>
          </div>

          {/* Mobile Hero Image  Visible only on mobile */}
          <div className="sm:hidden w-full mt-6">
            <Image
              className="border rounded-lg shadow-2xl w-full h-auto"
              src={"/heroImage.png"}
              width={1200}
              height={500}
              alt="example of weekly recurring todo"
              loading="lazy"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>

        {/* infinte scrolling flags */}
        <FlagsCarousel />

        {/* Features Section */}
        <div className="w-full max-w-7xl mb-16 sm:mb-24 lg:mb-32 ">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 relative">
            {/* Left Column: Text */}
            <div className="space-y-16 sm:space-y-24 lg:space-y-48 pb-12 sm:pb-16 lg:pb-24">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.id}
                  ref={(el) => {
                    observerRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="space-y-4 sm:space-y-6 text-start flex flex-col justify-center min-h-0 lg:min-h-[80vh]"
                >
                  {/* Mobile & Tablet Image */}
                  <div className="lg:hidden relative h-[250px] sm:h-[350px] w-full bg-secondary/50 rounded-xl sm:rounded-2xl border border-border overflow-hidden shadow-2xl mb-4 sm:mb-6">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                      loading="lazy"
                    />
                  </div>

                  <div className="text-xs sm:text-sm font-mono text-primary/70 tracking-wider">
                    {feature.tag}
                  </div>
                  <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-2 sm:space-y-3 text-muted-foreground text-sm sm:text-base">
                    {feature.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 sm:gap-3">
                        <span className="text-primary mt-1 flex-shrink-0">
                          →
                        </span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Feature Image Desktop only */}
            <div className="hidden lg:block relative">
              <div className="sticky top-0 h-screen flex items-center justify-center py-8">
                <div className="relative w-full aspect-[4/3] bg-secondary/50 rounded-2xl overflow-hidden transition-all duration-500 ease-in-out">
                  {FEATURES.map((feature, index) => {
                    if (feature.title === dict("features.3.title")) {
                      return (
                        <div
                          key={feature.id}
                          className={`bg-background h-[350px] my-auto w-full object-contain transition-opacity duration-500 absolute inset-0  ${activeFeature === index
                            ? "opacity-100"
                            : "opacity-0"
                            }`}
                        >
                          <div className="flex justify-center items-center h-full w-full ">
                            <div className="flex flex-col p-9 w-full gap-4 rounded-xl ">
                              <div className="text-start ">
                                <h3>{dict("securityDemo.title")}</h3>
                                <div className="mt-4 ">
                                  {dict("securityDemo.subtitle")}
                                </div>
                              </div>

                              <div className="relative h-8">
                                <input
                                  name="passKey"
                                  required
                                  type={
                                    showPassword !== true ? "password" : "text"
                                  }
                                  className="bg-transparent outline-none border h-full px-2 pr-9  w-full rounded-md"
                                />
                                <EyeToggle
                                  show={showPassword}
                                  setShow={setShowPassword}
                                  className="right-2"
                                />
                              </div>

                              <button className="mt-4 w-full bg-lime rounded-sm text-black h-8">
                                {dict("securityDemo.enter")}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return (
                      <Image
                        unoptimized={true}
                        key={feature.id}
                        src={feature.image}
                        alt={feature.title}
                        fill
                        className={`object-contain transition-opacity duration-500 absolute inset-0 ${activeFeature === index ? "opacity-100" : "opacity-0"
                          }`}
                        priority={index === 0}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </ErrorBoundary >
  );
};

export default LandingPage;