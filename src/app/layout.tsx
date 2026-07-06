import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const barlowCondensed = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const sourceSans = Source_Sans_3({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "WMES — World Mobile Educational System | Global Management Hub",
  description: "World Mobile Educational System (WMES) is a global educational placement, professional training, and corporate management consultancy organization. Headquartered in Enugu, Nigeria and accredited in the United States, WMES is committed to strategic institutional governance, international university admissions, vocational training, and operational restructuring.",
  keywords: ["WMES", "World Mobile Educational System", "Educational Consultancy Nigeria", "School Contract Management", "Hospitality Management Enugu", "Global Management Hub", "United States Accredited Education"],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
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
      className={`${barlowCondensed.variable} ${sourceSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <head>
        <link rel="icon" href="/images/favicon.png" type="image/png" />
      </head>
      <body className="min-h-full flex flex-col bg-white text-slate-text">
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
