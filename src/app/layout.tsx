import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
  title: "Neighborly - Sustainable Community Market",
  description: "Discover and shop local, sustainable products in your neighborhood with Neighborly. Join the sustainable community market movement today.",
  openGraph: {
    title: "Neighborly - Sustainable Community Market",
    description: "Discover and shop local, sustainable products in your neighborhood with Neighborly.",
    url: "https://neighborly.com/",
    siteName: "Neighborly",
    images: [
      {
        url: "/banner.png",
        width: 1200,
        height: 630,
        alt: "Neighborly Sustainable Community Market Banner"
      }
    ],
    locale: "en_US",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Neighborly - Sustainable Community Market",
    description: "Discover and shop local, sustainable products in your neighborhood with Neighborly.",
    images: ["/banner.png"]
  },
  keywords: ["sustainable", "community", "market", "local", "eco-friendly", "Neighborly", "shop"],
  authors: [{ name: "Neighborly Team" }]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#7BAE7F" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
