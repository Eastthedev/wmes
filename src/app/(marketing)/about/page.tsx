import React from "react";
import AboutClient from "@/components/AboutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Institutional Profile & Corporate Mission",
  description: "Learn about the history, corporate vision, and academic/operational objectives of World Mobile Educational System (WMES), accredited in the United States.",
  keywords: [
    "about WMES",
    "WMES profile",
    "educational registry Nigeria",
    "US accredited education organization"
  ],
  alternates: {
    canonical: "/about"
  }
};

export default function AboutPage() {
  return <AboutClient />;
}
