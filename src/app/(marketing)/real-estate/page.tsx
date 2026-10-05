import React from "react";
import RealEstateClient from "@/components/RealEstateClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Real Estate & Property Management Portfolio",
  description: "World Mobile Educational System (WMES) Real Estate & Property Management provides trusted, transparent property sales, land acquisition, residential and commercial leasing, valuation, and advisory.",
  keywords: [
    "WMES Real Estate",
    "property management Enugu",
    "land acquisition Nigeria",
    "commercial property leasing",
    "real estate investment advisory",
    "Enugu properties",
    "facility management Africa"
  ],
  alternates: {
    canonical: "/real-estate"
  }
};

export default function RealEstatePage() {
  return <RealEstateClient />;
}
