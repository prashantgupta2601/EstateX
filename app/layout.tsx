import type { Metadata } from "next";
import { fontSans, fontHeading } from "@/lib/fonts";
import Providers from "@/components/providers";
import ClientLayoutWrapper from "@/components/layout/client-layout-wrapper";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "EstateX | Premium Real Estate Platform",
    template: "%s | EstateX",
  },
  description: "Browse, compare, and find your dream home on EstateX.",
  openGraph: {
    title: "EstateX | Premium Real Estate Platform",
    description: "Browse, compare, and find your dream home on EstateX.",
    type: "website",
    locale: "en_US",
    url: "https://estatex.com",
    siteName: "EstateX",
  },
  twitter: {
    card: "summary_large_image",
    title: "EstateX | Premium Real Estate Platform",
    description: "Browse, compare, and find your dream home on EstateX.",
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
        <Providers>
          <ClientLayoutWrapper>
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </ClientLayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
