import { Link } from "@/i18n/navigation";
import React from "react";
import { useTranslations } from "next-intl";

export default function Footer() {
  const dict = useTranslations("landingPage");
  return (
    <footer className="w-full bg-secondary/30 border-t border-border mt-32">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6 text-start">
            <div>
              <h3 className="text-2xl font-bold">Sanity</h3>
              <p className="text-muted-foreground max-w-md">
                The intelligent task management platform built for the not so
                sane.
              </p>
            </div>

            {/* <div className="flex gap-4">
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
            </div> */}
          </div>

          {/* <div className="text-start space-y-4">
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
          </div> */}

          {/* <div className="text-start space-y-4">
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
          </div> */}
        </div>

        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground font-mono">
          {/* <p>&copy; 2026 Sanity. All rights reserved.</p> */}
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">
              {dict("footer.privacyPolicy")}
            </Link>
            <Link href="/terms" className="hover:text-foreground">
              {dict("footer.termsOfService")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
