import React from "react";
import PartnershipsClient from "@/components/PartnershipsClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cooperative Directories & Strategic Affiliations",
  description: "Review active academic partnerships, corporate affiliations, and governmental board registries in cooperation with World Mobile Educational System (WMES).",
  keywords: [
    "WMES partnerships",
    "Elior Evangelical University affiliation",
    "international study abroad agreements Nigeria",
    "academic registry accreditation boards"
  ],
  alternates: {
    canonical: "/partnerships"
  }
};

export default function PartnershipsPage() {
  return <PartnershipsClient />;
}
