"use client";
import { useBackgroundColor } from "@/hooks/useBackgroundColor";
import { Space_Mono, Poppins } from "next/font/google";
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
  const bg = useBackgroundColor();
  return (
    <html lang="en">
      <body
        className={`${space_mono.variable} ${poppins.variable} antialiased ${bg}`}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
