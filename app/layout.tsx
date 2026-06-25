import type { Metadata } from "next";
import { fontSans, fontHeading } from "@/lib/fonts";
import Providers from "@/components/providers";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EstateHub | Premium Real Estate Platform",
    template: "%s | EstateHub",
  },
  description: "Browse, compare, and find your dream home on EstateHub.",
  openGraph: {
    title: "EstateHub | Premium Real Estate Platform",
    description: "Browse, compare, and find your dream home on EstateHub.",
    type: "website",
    locale: "en_US",
    url: "https://estatehub.com",
    siteName: "EstateHub",
  },
  twitter: {
    card: "summary_large_image",
    title: "EstateHub | Premium Real Estate Platform",
    description: "Browse, compare, and find your dream home on EstateHub.",
  },
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
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
