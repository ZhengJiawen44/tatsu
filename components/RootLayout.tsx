"use client";
import { usePathname } from "next/navigation";
import { Space_Mono, Poppins } from "next/font/google";
import clsx from "clsx";
import "@/app/globals.css";
import QueryProvider from "@/providers/QueryProvider";
const space_mono = Space_Mono({
  weight: ["400", "700"],
  variable: "--font-mono",
  subsets: ["latin"],
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const path = usePathname();
  const isAuthRoute = path.startsWith("/login") || path.startsWith("/register");

  return (
    <html lang="en">
      <body
        className={clsx(
          `${space_mono.variable} ${poppins.variable} antialiased`,
          isAuthRoute && "bg-form-background"
        )}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
