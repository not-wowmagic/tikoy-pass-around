import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { siteUrl } from "@/lib/site";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Tikoy Pass-Around | Share Luck This Chinese New Year",
  description:
    "Gift virtual Tikoy with personalized lucky messages. Pass it forward to keep the luck alive during Filipino-Chinese New Year.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tikoy Pass-Around",
    description:
      "Send a virtual Tikoy with a lucky message and keep the chain alive for 24 hours.",
    url: siteUrl,
    siteName: "Tikoy Pass-Around",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
