import React from "react";
import LoginClient from "@/components/LoginClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Merchant & Portal Login | WMES — World Mobile Educational System",
  description:
    "Secure merchant and member authentication portal for World Mobile Educational System (WMES). Access institutional registry dashboards, APIs, partner contracts, and academic credentials.",
  keywords: [
    "WMES Login",
    "Merchant Login",
    "Educational Portal Nigeria",
    "WMES Registry Access",
    "Partner Portal",
  ],
  alternates: {
    canonical: "/login",
  },
};

export default function LoginPage() {
  return <LoginClient />;
}
