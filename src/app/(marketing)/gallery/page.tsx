import React from "react";
import GalleryClient from "@/components/GalleryClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Media Archives & Photo Records",
  description: "Explore the photography records and visual archives of academic, operational, and event activities managed by World Mobile Educational System (WMES).",
  keywords: [
    "WMES Media Archives",
    "graduation photo records",
    "educational event photos Enugu",
    "private school event pictures Nigeria"
  ],
  alternates: {
    canonical: "/gallery"
  }
};

export default function GalleryPage() {
  return <GalleryClient />;
}
