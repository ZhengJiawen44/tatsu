"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ErrorBoundary from "@/components/ErrorBoundary";
import { Button } from "@/components/ui/button";
import Image from "next/image";

// Feature data extracted for cleaner mapping and state management
const FEATURES = [
  {
    id: 1,
    tag: "01 / SMART TASKS",
    title: "Natural language processing",
    description:
      "Simply type your tasks naturally. Our intelligent NLP engine automatically extracts dates, times, and durations from your input.",
    bullets: [
      "Instant date and time detection",
      "Automatic duration calculation",
      "Smart reminder scheduling",
      "Context-aware parsing",
    ],
    image: "/placeholder-tasks.png",
  },
  {
    id: 2,
    tag: "02 / VISUALIZATION",
    title: "Beautiful calendar view",
    description:
      "See all your tasks at a glance. The integrated calendar provides a clear overview of your schedule with intuitive visual indicators.",
    bullets: [
      "Monthly, weekly, and daily views",
      "Color-coded task categories",
      "Drag-and-drop rescheduling",
      "Conflict detection",
    ],
    image: "/placeholder-calendar.png",
  },
  {
    id: 3,
    tag: "03 / RICH NOTES",
    title: "Notion-style editor",
    description:
      "Capture your thoughts with a powerful, distraction-free editor. Format text, embed media, and organize your ideas effortlessly.",
    bullets: [
      "Markdown support",
      "Rich text formatting",
      "Code block syntax highlighting",
      "Nested bullet lists",
    ],
    image: "/placeholder-editor.png",
  },
  {
    id: 4,
    tag: "04 / SECURITY",
    title: "End-to-end encrypted storage",
    description:
      "Your files are protected with military-grade encryption. Store documents, images, and attachments with complete peace of mind.",
    bullets: [
      "AES-256 encryption",
      "Zero-knowledge architecture",
      "Secure file sharing",
      "Automatic backups",
    ],
    image: "/placeholder-storage.png",
  },
];

const LandingPage = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const observerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const options = {
      root: null,
      // This margin creates a narrow line in the center of the viewport
      // The observer triggers when an element crosses this center line
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

    const currentRefs = observerRefs.current;
    currentRefs.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      currentRefs.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  return (
    <ErrorBoundary
      fallback={
        <p className="text-red-500 text-center">
          Something went wrong, but don&apos;t worry, we sent an error report.
        </p>
      }
    >
      <div className="flex flex-col items-center justify-center text-foreground text-center px-1">
        {/* Hero Section */}
        <div className="flex flex-col items-center gap-9 mb-32 pt-20 max-w-7xl px-4">
          <div className="flex-1 ">
            <h1 className="text-5xl font-semibold mb-6">Sanity</h1>
            <p className="text-lg max-w-2xl mb-8">
              A swiss army knife of a personal planner — with a Notion-style
              editor, top-secret encrypted file uploads, and a bunch of nifty
              extras!
            </p>
            <div className="flex justify-center gap-4">
              <Link href="/blogs" className="z-50">
                <Button
                  variant={"outline"}
                  className="font-normal text-foreground p-6 text-lg rounded-lg shadow-md hover:translate-y-[2px] transition-transform duration-100"
                >
                  Read the docs
                </Button>
              </Link>
              <Link href="/login" className="z-50">
                <Button className="text-foreground p-6 text-lg font-semibold rounded-lg shadow-md hover:translate-y-[2px] transition-transform duration-100">
                  Start
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex-2 hidden md:block">
            <Image
              className="border rounded-lg m-auto mb-6 shadow-2xl"
              src={"/heroImage.png"}
              width={1200}
              height={500}
              alt="example of weekly recurring todo"
              loading="lazy"
            />
          </div>
        </div>

        {/* Features Section */}
        <div className="w-full max-w-7xl px-4 mb-32">
          {/* <div className="text-center mb-20">
            <span className="inline-block px-4 py-2 mb-4 text-xs font-mono uppercase tracking-widest border border-primary/30 rounded-full">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Built for productivity
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Powerful tools that work together seamlessly to help you stay
              organized and focused
            </p>
          </div> */}

          <div className="grid md:grid-cols-2 gap-12 relative">
            {/* Left Column: Scrollable Text Content */}
            <div className="space-y-24 md:space-y-48 pb-24">
              {FEATURES.map((feature, index) => (
                <div
                  key={feature.id}
                  ref={(el) => {
                    observerRefs.current[index] = el;
                  }}
                  data-index={index}
                  className="space-y-6 text-start flex flex-col justify-center min-h-[50vh] md:min-h-[80vh]"
                >
                  {/* Mobile Image (Visible only on small screens) */}
                  <div className="md:hidden relative h-[300px] w-full bg-secondary/50 rounded-2xl border border-border overflow-hidden shadow-2xl mb-6">
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="text-sm font-mono text-primary/70 tracking-wider">
                    {feature.tag}
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>
                  <ul className="space-y-3 text-muted-foreground">
                    {feature.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-primary mt-1">→</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Right Column: Sticky Image Container (Hidden on Mobile) */}
            <div className="hidden md:block relative">
              <div className="sticky top-0 h-screen flex items-center justify-center">
                <div className="relative w-full aspect-[4/3] bg-secondary/50 rounded-2xl border border-border overflow-hidden shadow-2xl transition-all duration-500 ease-in-out">
                  {FEATURES.map((feature, index) => (
                    <Image
                      key={feature.id}
                      src={feature.image}
                      alt={feature.title}
                      fill
                      className={`object-cover transition-opacity duration-500 absolute inset-0 ${
                        activeFeature === index ? "opacity-100" : "opacity-0"
                      }`}
                      priority={index === 0}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full bg-secondary/30 border-t border-border mt-32">
          <div className="max-w-7xl mx-auto px-4 py-20">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
              <div className="md:col-span-2 space-y-6 text-start">
                <h3 className="text-2xl font-bold">Sanity</h3>
                <p className="text-muted-foreground max-w-md">
                  The intelligent task management platform built for modern
                  teams. Stay organized, secure, and productive.
                </p>
                <div className="flex gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full hover:bg-accent transition-colors"
                    aria-label="GitHub"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full hover:bg-accent transition-colors"
                    aria-label="Twitter"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z" />
                    </svg>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 flex items-center justify-center bg-background border border-border rounded-full hover:bg-accent transition-colors"
                    aria-label="LinkedIn"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                </div>
              </div>

              <div className="text-start space-y-4">
                <h4 className="text-sm font-mono uppercase tracking-wider text-primary">
                  Product
                </h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li>
                    <Link href="#features" className="hover:text-foreground">
                      Features
                    </Link>
                  </li>
                  <li>
                    <Link href="#pricing" className="hover:text-foreground">
                      Pricing
                    </Link>
                  </li>
                  <li>
                    <Link href="#roadmap" className="hover:text-foreground">
                      Roadmap
                    </Link>
                  </li>
                  <li>
                    <Link href="#changelog" className="hover:text-foreground">
                      Changelog
                    </Link>
                  </li>
                </ul>
              </div>

              <div className="text-start space-y-4">
                <h4 className="text-sm font-mono uppercase tracking-wider text-primary">
                  Resources
                </h4>
                <ul className="space-y-3 text-muted-foreground">
                  <li>
                    <Link href="#docs" className="hover:text-foreground">
                      Documentation
                    </Link>
                  </li>
                  <li>
                    <Link href="#api" className="hover:text-foreground">
                      API Reference
                    </Link>
                  </li>
                  <li>
                    <Link href="#guides" className="hover:text-foreground">
                      Guides
                    </Link>
                  </li>
                  <li>
                    <Link href="#support" className="hover:text-foreground">
                      Support
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-mono">
              <p>&copy; 2026 Sanity. All rights reserved.</p>
              <div className="flex gap-6">
                <Link href="#privacy" className="hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link href="#terms" className="hover:text-foreground">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </ErrorBoundary>
  );
};

export default LandingPage;
