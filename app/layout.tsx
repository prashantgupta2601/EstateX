import type { Metadata } from "next";
import { fontSans, fontHeading } from "@/lib/fonts";
import "./globals.css";

export const metadata: Metadata = {
  title: "Magic Bricks | Premium Real Estate Platform",
  description: "Browse, compare, and find your dream home on Magic Bricks.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fontSans.variable} ${fontHeading.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
