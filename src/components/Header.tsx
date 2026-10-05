"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";

const navLinks = [
  { label: "Services",    path: "/services" },
  { label: "Real Estate", path: "/real-estate" },
  { label: "About",       path: "/about" },
  { label: "Leadership",  path: "/leadership" },
  { label: "Affiliates",  path: "/partnerships" },
  { label: "Gallery",     path: "/gallery" },
];

const mobileLinks = [
  { label: "Services",    path: "/services",     desc: "School, hotel & facility contracts" },
  { label: "Real Estate", path: "/real-estate",  desc: "Commercial asset stewardship" },
  { label: "About",       path: "/about",        desc: "Our mission & identity" },
  { label: "Leadership",  path: "/leadership",   desc: "Chancellor & board profiles" },
  { label: "Affiliates",  path: "/partnerships", desc: "University & institutional network" },
  { label: "Gallery",     path: "/gallery",      desc: "Event & media archives" },
  { label: "Portal Login", path: "/login",       desc: "Merchant, member & staff access" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Track scroll position to switch header from transparent to frosted
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close menu on route change
  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setMenuOpen(false);
  }

  // Lock body scroll when menu open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  // Hide header on login and dashboard pages for immersive portal experience
  if (pathname === "/login" || pathname?.startsWith("/dashboard")) {
    return null;
  }

  return (
    <>
      {/* ── HEADER BAR ───────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#060E1A]/90 backdrop-blur-xl border-b border-white/[0.07] shadow-[0_4px_30px_rgba(0,0,0,0.5)]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 sm:h-[70px] flex items-center justify-between">

          {/* ── LOGO ── */}
          <Link
            href="/"
            className="flex items-center gap-3 group shrink-0 focus:outline-none"
            aria-label="WMES Home"
          >
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 shrink-0 overflow-hidden rounded-md">
              <Image src="/images/logo.png" alt="WMES Logo" fill className="object-contain" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-display text-[11px] sm:text-sm font-black uppercase tracking-tight text-white group-hover:text-blue-400 transition-colors">
                World Mobile Educational System
              </span>
              <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-blue-400 font-semibold mt-0.5">
                Global Management Hub
              </span>
            </div>
          </Link>

          {/* ── DESKTOP NAV ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname === link.path;
              return (
                <Link
                  key={link.label}
                  href={link.path}
                  className={`relative px-3.5 py-2 text-[11px] font-mono uppercase tracking-widest font-semibold rounded-md transition-colors group ${
                    active
                      ? "text-white"
                      : "text-white/55 hover:text-white"
                  }`}
                >
                  {link.label}
                  {/* Active underline dot */}
                  {active && (
                    <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-blue-400" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ── DESKTOP CTA + HAMBURGER ── */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden lg:inline-flex items-center gap-1.5 border border-white/20 hover:border-white/40 text-white/80 hover:text-white px-4 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold transition-all hover:bg-white/5"
            >
              <span>Portal Login</span>
            </Link>
            <Link
              href="/contact"
              className="hidden lg:inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] group"
            >
              <span>Contact Us</span>
              <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Hamburger — mobile */}
            <button
              onClick={() => setMenuOpen(true)}
              className="lg:hidden relative w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-full border border-white/15 hover:border-white/40 transition-all cursor-pointer group"
              aria-label="Open menu"
            >
              <span className="block w-4 h-[1.5px] bg-white group-hover:w-5 transition-all" />
              <span className="block w-5 h-[1.5px] bg-white" />
            </button>
          </div>

        </div>
      </header>

      {/* ── FULLSCREEN MOBILE OVERLAY ─────────────────────────── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
              onClick={() => setMenuOpen(false)}
            />

            {/* Drawer panel */}
            <motion.div
              key="drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="fixed top-0 right-0 bottom-0 z-[70] w-full max-w-sm bg-[#060E1A] flex flex-col overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-7 pt-7 pb-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="relative w-7 h-7 shrink-0 overflow-hidden rounded-md">
                    <Image src="/images/logo.png" alt="WMES Logo" fill className="object-contain" />
                  </div>
                  <span className="font-display text-[11px] font-black uppercase tracking-tight text-white">
                    WMES
                  </span>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:text-white hover:border-white/40 transition-all cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Nav links */}
              <nav className="flex-1 px-7 py-8 space-y-1">
                <p className="text-[9px] font-mono uppercase tracking-[0.25em] text-white/30 font-semibold mb-5">
                  Navigation
                </p>
                {mobileLinks.map((link, i) => {
                  const active = pathname === link.path;
                  return (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 24 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 + i * 0.045, duration: 0.35 }}
                    >
                      <Link
                        href={link.path}
                        onClick={() => setMenuOpen(false)}
                        className={`group flex items-center justify-between py-4 border-b transition-colors ${
                          active
                            ? "border-blue-500/40"
                            : "border-white/[0.06] hover:border-white/20"
                        }`}
                      >
                        <div className="space-y-0.5">
                          <span
                            className={`font-display text-xl font-black uppercase tracking-tight block transition-colors ${
                              active ? "text-blue-400" : "text-white group-hover:text-blue-300"
                            }`}
                          >
                            {link.label}
                          </span>
                          <span className="text-[10px] font-mono text-white/35 font-light block">
                            {link.desc}
                          </span>
                        </div>
                        <ArrowUpRight
                          className={`w-4 h-4 shrink-0 transition-all ${
                            active
                              ? "text-blue-400"
                              : "text-white/20 group-hover:text-white/60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          }`}
                        />
                      </Link>
                    </motion.div>
                  );
                })}
              </nav>

              {/* Drawer footer CTA */}
              <div className="px-7 pb-10 pt-4 border-t border-white/10 space-y-3">
                <Link
                  href="/contact"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl text-xs font-mono uppercase tracking-widest font-bold transition-all"
                >
                  <span>Contact Us</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-center text-[9px] font-mono uppercase tracking-widest text-white/25">
                  US-Accredited · Est. 2021 · Abuja & Enugu
                </p>
              </div>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
