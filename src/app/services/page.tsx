import React from "react";
import ServicesClient from "@/components/ServicesClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Corporate Services & Registry Offering Portfolio",
  description: "Explore our corporate catalog of educational management contracts, hotel operations management, institutional development, school turnaround strategies, and vocational capacity building workshops.",
  keywords: [
    "WMES services portfolio",
    "school contract management Nigeria",
    "hotel management contracts Enugu",
    "school turnaround strategy",
    "corporate training workshops FCT"
  ],
  alternates: {
    canonical: "/services"
  }
};

export default function ServicesPage() {
  return <ServicesClient />;
}
