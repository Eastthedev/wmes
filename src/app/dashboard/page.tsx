import React, { Suspense } from "react";
import DashboardClient from "@/components/DashboardClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User & Student Portal Dashboard | WMES — World Mobile Educational System",
  description:
    "Student and institutional member portal for World Mobile Educational System. Manage enrolled programmes, recorded sessions, tuition payments, official forms, and US-accredited credentials.",
  alternates: {
    canonical: "/dashboard",
  },
};

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DashboardClient />
    </Suspense>
  );
}
