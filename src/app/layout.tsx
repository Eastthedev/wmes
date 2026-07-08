import type { Metadata } from "next";
import { Barlow_Condensed, Source_Sans_3, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ThemePrompt from "@/components/ThemePrompt";

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
  metadataBase: new URL("https://wmesgroup.com"),
  title: {
    default: "WMES — World Mobile Educational System | Global Management Hub",
    template: "%s | WMES"
  },
  description: "World Mobile Educational System (WMES) is an international educational registry, professional training, and corporate management consultancy. Headquartered in Abuja/Enugu and US-accredited, WMES offers school contract management, hotel management contracts, corporate training workshops, and international admissions placement pathways.",
  keywords: [
    "WMES",
    "World Mobile Educational System",
    "Educational Consultancy Nigeria",
    "School Contract Management",
    "Hospitality Management Enugu",
    "Global Management Hub",
    "United States Accredited Education",
    "Vocational Training Nigeria",
    "Corporate training workshops",
    "School turnaround strategy",
    "Study abroad placement Nigeria"
  ],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  },
  openGraph: {
    title: "WMES — World Mobile Educational System | Global Management Hub",
    description: "US-accredited educational registry, professional training, and corporate management consultancy in Nigeria.",
    url: "https://wmesgroup.com",
    siteName: "WMES",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "WMES — World Mobile Educational System | Global Management Hub",
    description: "US-accredited educational registry, professional training, and corporate management consultancy in Nigeria.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
      <body className="min-h-full flex flex-col bg-[#020813] text-white">
        <ThemePrompt />
        <Header />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
