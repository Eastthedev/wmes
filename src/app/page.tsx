import React from "react";
import HomeClient from "@/components/HomeClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "WMES — World Mobile Educational System | Global Management Hub",
  description: "US-accredited international educational registry, professional training, and corporate management consultancy. Specialized in school contract management, hotel operations management, and international study placement pathways.",
  keywords: [
    "WMES",
    "World Mobile Educational System",
    "Educational Consultancy Nigeria",
    "School Contract Management",
    "Hotel Management Contracts",
    "School Turnaround Strategy",
    "Study abroad placement Nigeria"
  ],
  alternates: {
    canonical: "/"
  }
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "World Mobile Educational System",
    "alternateName": "WMES",
    "url": "https://wmesgroup.com",
    "logo": "https://wmesgroup.com/images/logo.png",
    "description": "US-accredited international educational registry, professional training, and corporate management consultancy. Specializing in educational management contracts, hotel operations management, corporate capacity workshops, and study abroad pathways.",
    "address": [
      {
        "@type": "PostalAddress",
        "streetAddress": "National Centre for Women Development, Central Area",
        "addressLocality": "Abuja",
        "addressRegion": "FCT",
        "addressCountry": "NG"
      },
      {
        "@type": "PostalAddress",
        "streetAddress": "Chika's Plaza, Centenary Estate",
        "addressLocality": "Enugu",
        "addressRegion": "Enugu State",
        "addressCountry": "NG"
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HomeClient />
    </>
  );
}
