"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  GraduationCap,
  Globe2,
  Building2,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  Check,
  Plus,
  Minus,
} from "lucide-react";
import Hero from "@/components/Hero";

/* ─────────────────────────────────────────────
   DATA
────────────────────────────────────────────── */
const practices = [
  {
    num: "01",
    tag: "K-12 · Tertiary · Vocational",
    title: "School Turnaround & Academic Governance",
    summary:
      "Full-scale operational and academic takeover for schools facing declining enrollment, curriculum misalignment, or financial leakages.",
    deliverables: [
      "Curriculum redesign aligned with international benchmarks",
      "Staff retraining & transparent performance evaluations",
      "Revenue stabilization & financial leakage controls",
      "Regulatory licensing & institutional board governance",
    ],
    image: "/images/campus.png",
    link: "/services",
    icon: GraduationCap,
  },
  {
    num: "02",
    tag: "Undergraduate · Postgraduate · Vocational",
    title: "International Admissions & Study Pathways",
    summary:
      "Structured global placement registry connecting students with accredited universities in the US, Canada, the UK, and Europe.",
    deliverables: [
      "Credential mapping & foreign transcript evaluation",
      "Direct admissions processing with partner institutions",
      "Embassy documentation, visa filing & interview coaching",
      "Pre-departure orientation & overseas student liaison",
    ],
    image: "/images/aff9.jpeg",
    link: "/admissions",
    icon: Globe2,
  },
  {
    num: "03",
    tag: "Hotels · Resorts · Guest Complexes",
    title: "Hospitality & Hotel Operations Contracts",
    summary:
      "Turnkey management contracts for hotel proprietors. We establish hospitality standards, audit revenues, and eliminate operational losses.",
    deliverables: [
      "Standard Operating Procedures for guest services",
      "Housekeeping, front office & food service retraining",
      "POS reconciliation & daily inventory audits",
      "Occupancy growth strategies & corporate event packages",
    ],
    image: "/images/serv.jpeg",
    link: "/services",
    icon: Building2,
  },
  {
    num: "04",
    tag: "Commercial · Real Estate · Energy",
    title: "Facility & Commercial Asset Stewardship",
    summary:
      "Operational oversight for commercial estates, retail energy outlets, and corporate facilities with audited quarterly reporting.",
    deliverables: [
      "Tenant administration & commercial lease oversight",
      "Energy outlet operations & daily inventory audits",
      "Facility safety protocols & physical plant upkeep",
      "Comprehensive quarterly financial reporting to proprietors",
    ],
    image: "/images/wmes_real_estate_hero.png",
    link: "/real-estate",
    icon: ShieldCheck,
  },
];

const stats = [
  { num: "5+",     label: "Years Operational", sub: "Est. 2021" },
  { num: "20+",    label: "Managed Portfolios", sub: "Education, Hospitality & Real Estate" },
  { num: "5,000+", label: "Candidates Placed",  sub: "K-12, Vocational & Study Abroad" },
  { num: "100%",   label: "Audit Integrity",    sub: "Rigid Proprietor Reporting" },
];

const partnerSrcs = [
  "/images/aff0.jpeg", "/images/aff1.jpeg", "/images/aff2.jpeg",
  "/images/aff3.jpeg", "/images/aff4.jpeg", "/images/aff5.jpeg",
  "/images/aff6.jpeg", "/images/aff7.jpeg", "/images/aff8.jpeg",
  "/images/aff9.jpeg", "/images/aff10.jpeg", "/images/aff11.jpeg",
];

const testimonials = [
  {
    author: "Chief Benson A. Nwosu",
    role: "School Proprietor",
    org: "St. Jude's Academic Complex",
    quote: "Our secondary school was facing declining enrollment and administrative leakages. WMES stepped in with a contract turnaround strategy, overhauled our curriculum, and retrained the entire staff. Within 18 months, our student density grew by 40%.",
    avatar: "/images/staff1.jpeg",
    badge: "Proprietor partner",
    date: "2026.02.14",
    cat: "Corporate & Proprietors",
  },
  {
    author: "Amarachi Grace Ugwu",
    role: "B.Sc. Candidate",
    org: "Bridgeport Institute of Technology",
    quote: "Securing student admission and visa pathways to study in Canada seemed extremely complicated. The registrar division at WMES mapped my credentials, verified my documents, and guided me through my visa portfolio. Today I am pursuing my degree in Ontario.",
    avatar: "/images/staff6.jpeg",
    badge: "International student",
    date: "2026.03.02",
    cat: "Students & Parents",
  },
  {
    author: "Engr. Femi Adebayo",
    role: "Managing Director",
    org: "Blue Sky Energy Outlets",
    quote: "Managing a petrol station network from Lagos was an operational challenge. Delegating operations control to WMES has resolved staff friction, inventory leakage, and safety compliance checks. The accounting audit reports are transparent and on schedule.",
    avatar: "/images/staff2.jpeg",
    badge: "Commercial operator",
    date: "2026.01.28",
    cat: "Corporate & Proprietors",
  },
  {
    author: "Mr. Emmanuel I. Edeh",
    role: "Senior Science Instructor",
    org: "Royal K-12 Academy",
    quote: "Implementing the WMES Academic Playbook has dramatically simplified our teaching workflow. The curriculum guidelines are clear, lesson planners are standardized, and compliance audits ensure high teaching benchmarks without administrative confusion.",
    avatar: "/images/staff8.jpeg",
    badge: "Educator user",
    date: "2026.04.15",
    cat: "Staff & Educators",
  },
  {
    author: "Mrs. Victoria Alao",
    role: "General Manager",
    org: "Summit Hotels Franchise",
    quote: "We send our team to the WMES Corporate Training workshops annually. Their vocational skills training and customer service modules have significantly boosted hospitality performance and customer satisfaction across our Abuja branches.",
    avatar: "/images/staff5.jpeg",
    badge: "Hospitality executive",
    date: "2026.03.22",
    cat: "Corporate & Proprietors",
  },
];

function TestimonialCard({
  item,
}: {
  item: (typeof testimonials)[0];
}) {
  return (
    <div className="bg-white rounded-2xl p-6 sm:p-7 text-slate-800 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.65)] border border-white/80 transition-shadow hover:shadow-[0_30px_70px_-10px_rgba(0,0,0,0.9)] cursor-pointer">
      {/* Header: Avatar + Author + Role */}
      <div className="flex items-center gap-3.5">
        <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-slate-200">
          <Image
            src={item.avatar}
            alt={item.author}
            fill
            className="object-cover"
          />
        </div>
        <div className="min-w-0">
          <div className="font-bold text-[#0F172A] text-sm sm:text-base leading-tight truncate">
            {item.author}
          </div>
          <div className="text-xs text-slate-500 font-normal mt-0.5 truncate">
            {item.role} at {item.org}
          </div>
        </div>
      </div>

      {/* Body Quote */}
      <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-4 font-normal">
        &laquo; {item.quote} &raquo;
      </p>

      {/* Bottom badge with flag stripe + date */}
      <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
        <span className="inline-flex items-center gap-1.5 font-medium">
          <span className="inline-flex flex-col gap-0.5 w-3.5">
            <span className="h-0.5 w-full bg-blue-500 rounded-full" />
            <span className="h-0.5 w-full bg-amber-400 rounded-full" />
            <span className="h-0.5 w-full bg-rose-500 rounded-full" />
          </span>
          <span className="text-slate-600 font-semibold">{item.badge}</span>
          <span>, {item.date}</span>
        </span>
      </div>
    </div>
  );
}

const cats = ["All", "Corporate & Proprietors", "Students & Parents", "Staff & Educators"];

const typewriterSequence = [
  {
    prefix: "Committed to building ",
    highlight: "international partnerships",
  },
  {
    prefix: "Committed to building ",
    highlight: "world-class institutions",
  },
  {
    prefix: "Committed to ",
    highlight: "empowering quality education across Africa",
  },
];

/* ─────────────────────────────────────────────
   COMPONENT
────────────────────────────────────────────── */
export default function HomeClient() {
  const [openPractice, setOpenPractice] = useState<number | null>(null);
  const [activeCat, setActiveCat] = useState("All");
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  // Typewriter state for Chancellor's headline
  const [seqIndex, setSeqIndex] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentTarget = typewriterSequence[seqIndex].highlight;
    let timer: ReturnType<typeof setTimeout>;

    if (!isDeleting) {
      if (currentText.length < currentTarget.length) {
        timer = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length + 1));
        }, 55);
      } else {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timer = setTimeout(() => {
          setCurrentText(currentTarget.slice(0, currentText.length - 1));
        }, 30);
      } else {
        setIsDeleting(false);
        setSeqIndex((prev) => (prev + 1) % typewriterSequence.length);
      }
    }

    return () => clearTimeout(timer);
  }, [currentText, isDeleting, seqIndex]);

  // On-scroll convergence for scattered testimonials
  // As the user scrolls into the section, cards start scattered and fly together into a cluster
  const testimonialRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: tScrollProgress } = useScroll({
    target: testimonialRef,
    offset: ["start end", "end start"],
  });

  // Card 1: Top Center — starts high up and angled, converges into place
  const card1Y = useTransform(tScrollProgress, [0, 0.5, 1], [-140, 0, -25]);
  const card1X = useTransform(tScrollProgress, [0, 0.5, 1], [60, 0, 0]);
  const card1R = useTransform(tScrollProgress, [0, 0.5, 1], [-9, 0, 0.5]);
  const card1Scale = useTransform(tScrollProgress, [0, 0.5, 1], [0.9, 1, 1]);
  const card1Opacity = useTransform(tScrollProgress, [0, 0.35, 1], [0.4, 1, 1]);

  // Card 2: Middle Left — starts blown far left & rotated, converges into place
  const card2X = useTransform(tScrollProgress, [0, 0.5, 1], [-260, 0, -10]);
  const card2Y = useTransform(tScrollProgress, [0, 0.5, 1], [-70, 0, -25]);
  const card2R = useTransform(tScrollProgress, [0, 0.5, 1], [-14, 0, 1]);
  const card2Scale = useTransform(tScrollProgress, [0, 0.5, 1], [0.88, 1, 1]);
  const card2Opacity = useTransform(tScrollProgress, [0, 0.35, 1], [0.4, 1, 1]);

  // Card 3: Middle Right — starts blown far right & rotated, converges into place
  const card3X = useTransform(tScrollProgress, [0, 0.5, 1], [280, 0, 10]);
  const card3Y = useTransform(tScrollProgress, [0, 0.5, 1], [-50, 0, -20]);
  const card3R = useTransform(tScrollProgress, [0, 0.5, 1], [14, 0, -1]);
  const card3Scale = useTransform(tScrollProgress, [0, 0.5, 1], [0.88, 1, 1]);
  const card3Opacity = useTransform(tScrollProgress, [0, 0.35, 1], [0.4, 1, 1]);

  // Card 4: Lower Left — starts blown far bottom-left, converges into place
  const card4X = useTransform(tScrollProgress, [0, 0.5, 1], [-240, 0, -5]);
  const card4Y = useTransform(tScrollProgress, [0, 0.5, 1], [170, 0, -15]);
  const card4R = useTransform(tScrollProgress, [0, 0.5, 1], [12, 0, 0.5]);
  const card4Scale = useTransform(tScrollProgress, [0, 0.5, 1], [0.88, 1, 1]);
  const card4Opacity = useTransform(tScrollProgress, [0, 0.35, 1], [0.4, 1, 1]);

  // Card 5: Bottom Right — starts blown far bottom-right, converges into place
  const card5X = useTransform(tScrollProgress, [0, 0.5, 1], [220, 0, 5]);
  const card5Y = useTransform(tScrollProgress, [0, 0.5, 1], [190, 0, -15]);
  const card5R = useTransform(tScrollProgress, [0, 0.5, 1], [-11, 0, -0.5]);
  const card5Scale = useTransform(tScrollProgress, [0, 0.5, 1], [0.88, 1, 1]);
  const card5Opacity = useTransform(tScrollProgress, [0, 0.35, 1], [0.4, 1, 1]);

  const filtered = activeCat === "All" ? testimonials : testimonials.filter((t) => t.cat === activeCat);

  return (
    <div className="font-body overflow-x-hidden selection:bg-blue-600 selection:text-white">

      {/* ═══════════════════════════════════════
          1. HERO — cinematic fullscreen slider
      ════════════════════════════════════════ */}
      <Hero />

      {/* ═══════════════════════════════════════
          2. TICKER STRIP — scrolling marquee
      ════════════════════════════════════════ */}
      <div className="bg-blue-600 py-3 overflow-hidden border-y border-blue-500">
        <div className="animate-marquee flex items-center gap-12 whitespace-nowrap">
          {[
            "US-Accredited Organization",
            "School Contract Management",
            "Hotel & Hospitality Operations",
            "International Study Pathways",
            "Real Estate Stewardship",
            "Corporate Training Workshops",
            "Institutional Turnaround",
            "Visa & Registry Advisory",
            "Est. 2021 · Abuja & Enugu",
          ].concat([
            "US-Accredited Organization",
            "School Contract Management",
            "Hotel & Hospitality Operations",
            "International Study Pathways",
            "Real Estate Stewardship",
            "Corporate Training Workshops",
            "Institutional Turnaround",
            "Visa & Registry Advisory",
            "Est. 2021 · Abuja & Enugu",
          ]).map((item, i) => (
            <span key={i} className="text-xs font-mono uppercase tracking-[0.2em] text-white/90 font-semibold flex items-center gap-4">
              {item}
              <span className="text-white/30 text-lg">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
      {/* ═══════════════════════════════════════
      {/* ═══════════════════════════════════════
          3. CHANCELLOR'S ADDRESS — Editorial Executive Layout (Dark Brand Tone)
      ════════════════════════════════════════ */}
      <section id="chancellor-address" className="relative bg-[#04090F] text-white overflow-hidden">
        {/* Full container */}
        <div className="relative w-full min-h-[640px] lg:min-h-[720px] flex flex-col lg:flex-row items-stretch">
          
          {/* Left Content Area (Deep Midnight Blue Canvas) */}
          <div className="relative z-10 w-full lg:w-[58%] xl:w-[56%] bg-[#060E1A] px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-20 flex flex-col justify-between">
            
            {/* Organic SVG Concave Scoop Divider on Desktop (Seam between dark panel and photo) */}
            <div className="hidden lg:block absolute inset-y-0 right-0 translate-x-[99%] w-24 xl:w-36 z-20 pointer-events-none">
              <svg
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
                className="w-full h-full fill-[#060E1A]"
              >
                <path d="M 0 0 L 100 0 C 42 22 12 46 12 66 C 12 84 50 94 100 100 L 0 100 Z" />
              </svg>
            </div>



            {/* Core Editorial Copy */}
            <div className="space-y-6 flex-1">
              {/* Greeting */}
              <div className="text-sm sm:text-base font-semibold text-blue-300 flex items-center gap-2">
                <span>Welcome from Professor John Ihuoma Nwokike,</span>
              </div>

              {/* Main Headline with Dynamic Typewriter & Gold Marker Highlight */}
              <div className="min-h-[140px] sm:min-h-[155px] lg:min-h-[175px] flex items-center">
                <h2 className="font-serif text-3xl sm:text-4xl lg:text-[42px] xl:text-[48px] font-bold text-white leading-[1.18] tracking-tight">
                  <span>{typewriterSequence[seqIndex].prefix}</span>
                  <span className="relative inline-block">
                    <span className="relative z-10 text-amber-200">
                      {currentText}
                    </span>
                    {currentText.length > 0 && (
                      <span className="absolute left-0 bottom-1 sm:bottom-1.5 w-full h-3 sm:h-4 bg-amber-500/25 border-b-2 border-amber-400 -z-0 rounded-xs transform -rotate-0.5 transition-all duration-75" />
                    )}
                  </span>
                  <span className="inline-block w-[3px] h-7 sm:h-8 lg:h-10 bg-amber-400 ml-1.5 align-middle animate-pulse" />
                </h2>
              </div>

              {/* Body Text & Doodle */}
              <div className="relative pt-2">
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-xl font-light">
                  We are committed to building international partnerships, developing world-class institutions, and empowering individuals with quality education across all sectors. On behalf of our leadership board, I warmly welcome you to World Mobile Educational System. We invite school proprietors, students, governments, and commercial partners to join hands with us as we implement structured turnaround strategies and open global pathways for future generations.
                </p>

                {/* Hand-drawn style Doodle + Arrow */}
                <div className="hidden md:flex absolute -left-10 lg:-left-14 bottom-0 translate-y-12 items-center gap-2 pointer-events-none">
                  <div className="relative flex flex-col items-center">
                    <svg className="w-8 h-8 text-sky-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="3" />
                      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(30 12 12)" />
                      <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(-30 12 12)" />
                    </svg>
                    <span className="text-sky-300 font-serif italic text-xs font-bold tracking-wide -rotate-6 mt-0.5">
                      US Accredited!
                    </span>
                  </div>
                  <svg className="w-10 h-7 text-sky-400 -rotate-12" viewBox="0 0 50 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M 5 22 C 20 28, 35 15, 45 6" />
                    <path d="M 38 5 L 46 6 L 44 14" />
                  </svg>
                </div>
              </div>

              {/* Credentials Pills */}
              <div className="flex flex-wrap gap-2 pt-2">
                {["Educationist", "Theologian", "Psychologist", "Political Scientist"].map((c) => (
                  <span
                    key={c}
                    className="text-[11px] font-mono uppercase tracking-wider text-blue-200/90 bg-white/5 border border-white/10 shadow-2xs px-3.5 py-1.5 rounded-full font-medium"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Sign-off & CTAs */}
            <div className="pt-8 mt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-white/10">
              <div>
                <div className="font-serif text-lg font-bold text-white leading-tight">
                  Prof. John Ihuoma Nwokike
                </div>
                <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold mt-0.5">
                  Chancellor & Chairman of Governing Council
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/leadership"
                  className="group inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-md hover:shadow-blue-500/25"
                >
                  <span>Meet Leadership</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </Link>
                <Link
                  href="/about"
                  className="group inline-flex items-center gap-2 border border-white/20 hover:border-white/60 text-white/80 hover:text-white px-5 py-3 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all"
                >
                  <span>About WMES</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>

          {/* Right Portrait Area */}
          <div className="relative w-full lg:w-[42%] xl:w-[44%] min-h-[440px] sm:min-h-[540px] lg:min-h-full bg-[#04090F] overflow-hidden">
            <Image
              src="/images/chancellor.jpeg"
              alt="Professor John Ihuoma Nwokike, Chancellor WMES"
              fill
              className="object-cover object-[center_18%]"
              sizes="(max-width: 1024px) 100vw, 44vw"
              priority
            />
            {/* Smooth Vignette for Cinematic Blend */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#04090F] via-transparent to-[#04090F]/40" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#04090F]/60 via-transparent to-transparent hidden lg:block" />
          </div>

        </div>

        {/* Circular Rotating Stamp Badge — Placed over the seam and unclipped */}
        <div className="absolute bottom-6 left-6 lg:bottom-10 lg:left-[58%] lg:-translate-x-1/2 z-30 pointer-events-none">
          <div className="relative w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
            {/* Circular Rotating Text SVG (Full 360° Ring) */}
            <svg
              className="w-full h-full animate-spin-slow"
              viewBox="0 0 200 200"
            >
              <defs>
                <path
                  id="chancellorSealPath"
                  d="M 100, 100 m -74, 0 a 74,74 0 1,1 148,0 a 74,74 0 1,1 -148,0"
                />
              </defs>
              <text
                fill="#F59E0B"
                className="text-[10px] font-mono uppercase tracking-[0.24em] font-extrabold"
              >
                <textPath href="#chancellorSealPath" startOffset="0%">
                  • WORLD MOBILE EDUCATIONAL SYSTEM • CHANCELLOR'S DESK •
                </textPath>
              </text>
            </svg>

            {/* Badge Center Disc */}
            <div className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-[#060E1A] border-2 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.25)] flex flex-col items-center justify-center text-center">
              <span className="text-[8px] font-mono uppercase text-amber-400 font-extrabold tracking-widest leading-none">
                EST.
              </span>
              <span className="text-sm font-serif font-black text-white leading-none mt-0.5">
                2021
              </span>
              <span className="text-[7px] font-mono text-amber-300 font-bold tracking-tighter mt-0.5">
                US REG
              </span>
            </div>
          </div>
        </div>

      </section>

      {/* ═══════════════════════════════════════
          4. PRACTICE AREAS — accordion with image panel
      ════════════════════════════════════════ */}
      <section className="bg-[#0A1628] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-16 pb-8 border-b border-white/10">
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-semibold">
                Practice Areas
              </span>
              <h2 className="font-display text-4xl sm:text-6xl font-black uppercase text-white tracking-tight leading-none">
                What We Do
              </h2>
            </div>
            <p className="text-slate-400 text-sm font-light max-w-sm leading-relaxed">
              Structured management. Measurable institutional results. Every mandate is backed by accountability frameworks.
            </p>
          </div>

          {/* Accordion list */}
          <div className="space-y-0 divide-y divide-white/10">
            {practices.map((p, idx) => {
              const isOpen = openPractice === idx;
              const Icon = p.icon;
              return (
                <div key={p.num}>
                  <button
                    onClick={() => setOpenPractice(isOpen ? null : idx)}
                    className="w-full py-8 flex items-center gap-6 group text-left cursor-pointer"
                  >
                    <span className="font-display text-5xl sm:text-7xl font-black text-white/10 group-hover:text-white/20 transition-colors w-20 shrink-0 leading-none">
                      {p.num}
                    </span>
                    <div className="flex-1 space-y-1">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-blue-400 font-semibold block">
                        {p.tag}
                      </span>
                      <h3 className="font-display text-2xl sm:text-4xl font-black uppercase text-white tracking-tight leading-tight group-hover:text-blue-300 transition-colors">
                        {p.title}
                      </h3>
                    </div>
                    <div className="shrink-0 w-10 h-10 rounded-full border border-white/20 group-hover:border-blue-400 flex items-center justify-center text-white/50 group-hover:text-blue-400 transition-all">
                      {isOpen ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pb-12 pl-0 lg:pl-26">
                          {/* Left: Details */}
                          <div className="space-y-6">
                            <p className="text-slate-300 text-base font-light leading-relaxed">
                              {p.summary}
                            </p>
                            <div className="space-y-3">
                              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
                                Key Deliverables
                              </span>
                              {p.deliverables.map((d, i) => (
                                <div key={i} className="flex items-start gap-3 text-sm text-slate-300 font-light leading-snug">
                                  <Check className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                                  {d}
                                </div>
                              ))}
                            </div>
                            <Link
                              href={p.link}
                              className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest text-white hover:text-blue-400 transition-colors group/link"
                            >
                              <span>Explore in Detail</span>
                              <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                          </div>

                          {/* Right: Image */}
                          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 border border-white/10 shadow-2xl">
                            <Image
                              src={p.image}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 1024px) 100vw, 40vw"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                            <div className="absolute bottom-4 left-4 flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                                <Icon className="w-4 h-4 text-white" />
                              </div>
                              <span className="text-[10px] font-mono uppercase tracking-widest text-white font-semibold">
                                {p.tag.split("·")[0].trim()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          5. STATS — full-bleed split with bold numbers
      ════════════════════════════════════════ */}
      <section className="bg-white text-[#060E1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-slate-200">
            {stats.map((s, i) => (
              <div key={i} className="p-10 sm:p-14 lg:p-16 space-y-3 hover:bg-slate-50 transition-colors">
                <div className="font-display text-6xl sm:text-7xl lg:text-8xl font-black text-[#060E1A] tracking-tight leading-none">
                  {s.num}
                </div>
                <div className="text-xs font-mono uppercase tracking-widest text-blue-600 font-bold">
                  {s.label}
                </div>
                <div className="text-xs text-slate-500 font-light">
                  {s.sub}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* ═══════════════════════════════════════
          7. TESTIMONIALS — Scattered Floating Deck with On-Scroll Parallax
      ════════════════════════════════════════ */}
      <section
        ref={testimonialRef}
        className="relative bg-[#0A0C10] py-28 sm:py-36 overflow-hidden"
      >
        {/* Subtle background ambient radial gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[550px] bg-blue-900/10 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Centered Header (matching reference layout) */}
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-sans">
              Testimonials
            </h2>
            <p className="mt-4 text-base sm:text-lg text-slate-400 font-light leading-relaxed">
              Discover real feedback on{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-pink-400 to-amber-300 font-medium">
                WMES governance & management contracts
              </span>{" "}
              within our institutional network.
            </p>
          </div>

          {/* Desktop Scattered Floating Cards Deck — Converges on scroll */}
          <div className="hidden lg:block relative min-h-[760px] xl:min-h-[820px] w-full max-w-5xl mx-auto">
            {/* Card 1: Top Center-Right (converges inward from top-right) */}
            <motion.div
              style={{ y: card1Y, x: card1X, rotate: card1R, scale: card1Scale, opacity: card1Opacity }}
              whileHover={{ scale: 1.04, zIndex: 50, transition: { duration: 0.2 } }}
              className="absolute top-0 left-[38%] xl:left-[40%] w-[380px] xl:w-[400px] z-10 will-change-transform"
            >
              <TestimonialCard item={testimonials[0]} />
            </motion.div>

            {/* Card 2: Middle Left (converges inward from far left) */}
            <motion.div
              style={{ y: card2Y, x: card2X, rotate: card2R, scale: card2Scale, opacity: card2Opacity }}
              whileHover={{ scale: 1.04, zIndex: 50, transition: { duration: 0.2 } }}
              className="absolute top-[18%] left-[4%] xl:left-[6%] w-[380px] xl:w-[390px] z-20 will-change-transform"
            >
              <TestimonialCard item={testimonials[1]} />
            </motion.div>

            {/* Card 3: Middle Right (converges inward from far right) */}
            <motion.div
              style={{ y: card3Y, x: card3X, rotate: card3R, scale: card3Scale, opacity: card3Opacity }}
              whileHover={{ scale: 1.04, zIndex: 50, transition: { duration: 0.2 } }}
              className="absolute top-[22%] left-[48%] xl:left-[50%] w-[400px] xl:w-[420px] z-30 will-change-transform"
            >
              <TestimonialCard item={testimonials[2]} />
            </motion.div>

            {/* Card 4: Lower Left (converges inward from bottom-left) */}
            <motion.div
              style={{ y: card4Y, x: card4X, rotate: card4R, scale: card4Scale, opacity: card4Opacity }}
              whileHover={{ scale: 1.04, zIndex: 50, transition: { duration: 0.2 } }}
              className="absolute top-[48%] left-[16%] xl:left-[18%] w-[370px] xl:w-[380px] z-10 will-change-transform"
            >
              <TestimonialCard item={testimonials[3]} />
            </motion.div>

            {/* Card 5: Bottom Center-Right (converges inward from bottom-right) */}
            <motion.div
              style={{ y: card5Y, x: card5X, rotate: card5R, scale: card5Scale, opacity: card5Opacity }}
              whileHover={{ scale: 1.04, zIndex: 50, transition: { duration: 0.2 } }}
              className="absolute top-[60%] left-[36%] xl:left-[38%] w-[380px] xl:w-[400px] z-20 will-change-transform"
            >
              <TestimonialCard item={testimonials[4]} />
            </motion.div>
          </div>

          {/* Tablet & Mobile Stack (Clean, responsive cards with staggered on-scroll reveals) */}
          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {testimonials.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: idx * 0.08 }}
              >
                <TestimonialCard item={item} />
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ═══════════════════════════════════════
          8. CTA — split two-panel invitation
      ════════════════════════════════════════ */}
      <section className="bg-[#060E1A]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">

            {/* Left panel: Institutional engagement */}
            <div className="p-12 sm:p-16 lg:p-20 space-y-8 flex flex-col justify-between">
              <div className="space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-semibold block">
                  For School Proprietors & Businesses
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
                  Commission A Management Contract
                </h2>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Whether you need an executive operator to stabilize school performance, manage hospitality assets, or oversee commercial properties — our management desk is ready to audit and advise.
                </p>
              </div>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/services#request-form"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:shadow-[0_0_28px_rgba(59,130,246,0.5)] inline-flex items-center gap-2 group"
                >
                  <span>Request Institutional Audit</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="/contact"
                  className="border border-white/20 text-white/70 hover:text-white hover:border-white/50 px-6 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-semibold transition-all"
                >
                  Contact Desk
                </Link>
              </div>
            </div>

            {/* Right panel: Study abroad */}
            <div className="relative p-12 sm:p-16 lg:p-20 space-y-8 flex flex-col justify-between overflow-hidden">
              {/* Background image subtle */}
              <div className="absolute inset-0 z-0">
                <Image src="/images/aff1.jpeg" alt="Study Abroad" fill className="object-cover opacity-15" sizes="50vw" />
                <div className="absolute inset-0 bg-[#060E1A]/80" />
              </div>

              <div className="relative z-10 space-y-4">
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-blue-400 font-semibold block">
                  For Students & Families
                </span>
                <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
                  Apply For International Study Placement
                </h2>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Seeking a verified pathway to study in the US, UK, Canada, or Europe? Our registry division maps your credentials and coordinates a placement with an accredited university partner.
                </p>
              </div>
              <div className="relative z-10">
                <Link
                  href="/admissions"
                  className="bg-white hover:bg-slate-100 text-[#060E1A] px-7 py-4 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:shadow-xl inline-flex items-center gap-2 group"
                >
                  <span>Apply for Study Abroad</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </Link>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
