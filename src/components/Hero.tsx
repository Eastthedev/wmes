"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ChevronRight } from "lucide-react";

const slides = [
  {
    id: "turnaround",
    index: "01",
    tag: "School Management",
    headline: "School Turnaround & Academic Governance",
    location: "Enugu · Abuja · Regional Campuses",
    // WMES academic governance & school turnaround executive council meeting
    image: "/images/school_management_hero.jpg",
    href: "/services",
  },
  {
    id: "pathways",
    index: "02",
    tag: "Study Abroad",
    headline: "International Admissions & Visa Pathways",
    location: "United States · Canada · UK · Europe",
    // African scholars on international university campus
    image: "/images/study_abroad_hero.jpg",
    href: "/admissions",
  },
  {
    id: "hospitality",
    index: "03",
    tag: "Hospitality Contracts",
    headline: "Hotel, Resort & Guest Operations Control",
    location: "Abuja · Commercial Districts",
    // Nigerian hotel lobby with African staff — Aso Rock visible through windows
    image: "/images/african_hotel_lobby.jpg",
    href: "/services",
  },
  {
    id: "facilities",
    index: "04",
    tag: "Commercial Assets",
    headline: "Real Estate & Energy Facility Stewardship",
    location: "Centenary Estate · Nationwide",
    // Abuja commercial estate with African professionals
    image: "/images/african_commercial_estate.jpg",
    video: "/images/commercial_asset.mp4",
    isCinematicFlight: true,
    href: "/real-estate",
  },
];

const SLIDE_DURATION = 20; // duration in seconds per slide

export default function Hero() {
  const [active, setActive] = useState(0);
  const [progressKey, setProgressKey] = useState(0);
  const [videoFailed, setVideoFailed] = useState<Record<string, boolean>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const advance = (next: number) => {
    setActive(next);
    setProgressKey((k) => k + 1);
  };

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActive((prev) => {
        const next = (prev + 1) % slides.length;
        setProgressKey((k) => k + 1);
        return next;
      });
    }, SLIDE_DURATION * 1000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  const slide = slides[active];

  return (
    <section
      className="relative w-full h-screen min-h-[680px] max-h-[1000px] overflow-hidden bg-[#060E1A]"
    >
      {/* Full-bleed background images with crossfade & cinematic drone motion */}
      <AnimatePresence mode="sync">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="absolute inset-0 z-0 overflow-hidden"
        >
          {slide.video && !videoFailed[slide.id] ? (
            <video
              src={slide.video}
              autoPlay
              loop
              muted
              playsInline
              onError={() => setVideoFailed((prev) => ({ ...prev, [slide.id]: true }))}
              className="w-full h-full object-cover"
            />
          ) : slide.isCinematicFlight ? (
            <div className="relative w-full h-full overflow-hidden">
              {/* Drone Camera Flight Animation: Sweeping around building -> soaring inside atrium -> zooming out wide */}
              <motion.div
                className="absolute inset-[-6%] w-[112%] h-[112%] will-change-transform"
                initial={{
                  scale: 1.25,
                  x: "-3.5%",
                  y: "2%",
                  rotate: 0.7,
                }}
                animate={{
                  scale: [1.25, 1.36, 1.32, 1.04, 1.07],
                  x: ["-3.5%", "2.5%", "1.2%", "0%", "-1%"],
                  y: ["2%", "-2.2%", "-1%", "0%", "0%"],
                  rotate: [0.7, -0.5, 0.2, 0, 0.3],
                }}
                transition={{
                  duration: 10,
                  ease: [0.25, 1, 0.5, 1],
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <Image
                  src={slide.image}
                  alt={slide.headline}
                  fill
                  priority
                  className="object-cover"
                  sizes="100vw"
                />
              </motion.div>

              {/* Dynamic Sunlight / Glint across the glass atrium */}
              <motion.div
                initial={{ opacity: 0, x: "-80%" }}
                animate={{
                  opacity: [0, 0.4, 0.1, 0.35, 0],
                  x: ["-80%", "30%", "120%"],
                }}
                transition={{
                  duration: 8,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatDelay: 1.5,
                }}
                className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-amber-200/25 to-blue-400/10 mix-blend-screen"
                style={{ transform: "skewX(-25deg)" }}
              />

              {/* Ambient atmospheric particle depth */}
              <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(6,14,26,0.5)_100%)]" />
            </div>
          ) : (
            <motion.div
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative w-full h-full"
            >
              <Image
                src={slide.image}
                alt={slide.headline}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
            </motion.div>
          )}

          {/* Layered overlays for depth & legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-black/20 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none" />
        </motion.div>
      </AnimatePresence>

      {/* Top status bar */}
      <div className="absolute top-0 left-0 right-0 pt-20 pb-4 z-20 pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 flex items-center justify-between">
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50">
            World Mobile Educational System
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/50 hidden sm:block">
            US-Accredited · Est. 2021
          </span>
        </div>
      </div>

      {/* Core layout */}
      <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-8 flex flex-col justify-end pb-12 sm:pb-16 md:pb-20">

        {/* Left bottom: Main content block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-end">

          {/* Headline column */}
          <div className="lg:col-span-8 space-y-5">

            {/* Animated tag */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-tag"}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -6 }}
                transition={{ duration: 0.4 }}
              >
                <div className="inline-flex items-center gap-2.5">
                  <span className="text-[10px] font-mono uppercase tracking-[0.22em] text-blue-400 font-semibold">
                    {slide.index} / {slide.tag}
                  </span>
                  {slide.isCinematicFlight && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[9px] font-mono uppercase tracking-widest text-blue-300 font-medium">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                      </span>
                      Cinematic Flight
                    </span>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Animated headline */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={slide.id + "-headline"}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tight text-white leading-[0.9]"
              >
                {slide.headline}
              </motion.h1>
            </AnimatePresence>

            {/* Location + link */}
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id + "-bottom"}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8"
              >
                <span className="text-sm text-white/60 font-light tracking-wide">
                  {slide.location}
                </span>
                <Link
                  href={slide.href}
                  className="group inline-flex items-center gap-2 text-sm font-mono uppercase tracking-widest text-white font-semibold hover:text-blue-300 transition-colors"
                >
                  <span>View Practice</span>
                  <span className="w-6 h-6 rounded-full border border-white/30 group-hover:border-blue-400 flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3 h-3 group-hover:text-blue-400 transition-colors" />
                  </span>
                </Link>
              </motion.div>
            </AnimatePresence>

            {/* Primary CTAs */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/services"
                className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.5)] group"
              >
                Services
              </Link>
              <Link
                href="#chancellor-address"
                className="border border-white/25 hover:border-white/60 text-white/80 hover:text-white px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all"
              >
                Chancellor's Address
              </Link>
            </div>
          </div>

          {/* Right column: Slide selector + progress */}
          <div className="lg:col-span-4 space-y-3 lg:pb-1">
            {slides.map((s, idx) => {
              const isActive = active === idx;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    advance(idx);
                  }}
                  className={`w-full text-left group transition-all duration-300 cursor-pointer ${
                    isActive ? "opacity-100" : "opacity-40 hover:opacity-70"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-mono text-white/50 w-4 shrink-0">{s.index}</span>
                    <div className="flex-1">
                      {/* Progress bar */}
                      <div className="h-[1px] w-full bg-white/20 mb-2 overflow-hidden">
                        {isActive && (
                          <motion.div
                            key={progressKey}
                            className="h-full bg-blue-400"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: SLIDE_DURATION, ease: "linear" }}
                          />
                        )}
                      </div>
                      <span
                        className={`text-[11px] font-mono uppercase tracking-widest block transition-colors ${
                          isActive ? "text-white" : "text-white/50"
                        }`}
                      >
                        {s.tag}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* Bottom right: counter */}
      <div className="absolute bottom-6 right-6 sm:right-8 z-20 text-[10px] font-mono text-white/30 tracking-widest">
        {String(active + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>
    </section>
  );
}
