"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useInView } from "framer-motion";
import {
  GraduationCap, Building2, Briefcase, Globe, Award, Landmark,
  Activity, Bookmark, BookOpen, ShieldCheck, Users, Compass,
  TrendingUp, Calendar, FileText, Home, ArrowUpRight, ArrowRight,
  Check, X, ChevronRight,
} from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";

/* ─────────────────────────────────────────────────────────
   THREE.JS PARTICLE CANVAS
────────────────────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    const PARTICLE_COUNT = 55;
    const MAX_DIST = 160;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r: Math.random() * 1.5 + 0.5,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(59,130,246,${0.12 * (1 - dist / MAX_DIST)})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // Dots
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(96,165,250,0.55)";
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full opacity-60 pointer-events-none"
    />
  );
}

/* ─────────────────────────────────────────────────────────
   ANIMATED COUNTER
────────────────────────────────────────────────────────── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setCount(to); clearInterval(id); }
      else setCount(start);
    }, 22);
    return () => clearInterval(id);
  }, [inView, to]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─────────────────────────────────────────────────────────
/* ─────────────────────────────────────────────────────────
   DATA & CONTRACT CLASSIFICATIONS
────────────────────────────────────────────────────────── */
interface ContractItem {
  num: string;
  title: string;
  desc: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  link: string | null;
  tags: string[];
  category: string;
  categoryKey: "institutional" | "commercial" | "global" | "advisory";
  deliverables: string[];
  term: string;
}

const categories = [
  { key: "all", label: "All Practice Areas", count: 16 },
  { key: "institutional", label: "Institutional Governance", count: 5 },
  { key: "commercial", label: "Commercial & Hospitality", count: 4 },
  { key: "global", label: "Global Treaties & Placements", count: 3 },
  { key: "advisory", label: "Executive Advisory", count: 4 },
];

const services: ContractItem[] = [
  {
    num: "01",
    title: "Educational Management Contracts",
    categoryKey: "institutional",
    category: "Institutional Governance",
    desc: "Managing schools, colleges, vocational centres, and training institutions on behalf of proprietors with full operational and academic accountability.",
    image: "/images/service_edu_management.jpg",
    icon: GraduationCap,
    link: null,
    tags: ["K-12", "Tertiary", "Vocational"],
    deliverables: [
      "Proprietor Operational Custody",
      "Academic & Administrative Audits",
      "Staff Performance & KPI System",
      "Financial & Tuition Governance",
    ],
    term: "Multi-Year Mandate (3–5 Yrs)",
  },
  {
    num: "02",
    title: "Hotel & Hospitality Management Contracts",
    categoryKey: "commercial",
    category: "Commercial & Hospitality",
    desc: "Managing hotels, resorts, guest houses, and hospitality assets — standardizing operational procedures, guest satisfaction, and revenue yields.",
    image: "/images/african_hotel_lobby.jpg",
    icon: Building2,
    link: null,
    tags: ["Hotels", "Resorts", "Guest Complexes"],
    deliverables: [
      "Full Facility & Guest Operations",
      "Hospitality SOP Implementation",
      "Revenue Management & Cost Controls",
      "Front-of-House & Culinary Standards",
    ],
    term: "Annual & Multi-Year Management",
  },
  {
    num: "03",
    title: "Real Estate & Property Management",
    categoryKey: "commercial",
    category: "Commercial & Hospitality",
    desc: "Stewardship over real estate portfolios, land acquisition, commercial leasing, valuation, and capital yield optimization across major metropolitan hubs.",
    image: "/images/african_commercial_estate.jpg",
    icon: Home,
    link: "/real-estate",
    tags: ["Sales", "Leasing", "Investment Advisory"],
    deliverables: [
      "Asset Acquisition & Title Verification",
      "Commercial & Residential Leasing",
      "Facility Maintenance & Tenant Relations",
      "Capital Growth & Yield Optimization",
    ],
    term: "Ongoing Portfolio Management",
  },
  {
    num: "04",
    title: "Educational Consultancy Contracts",
    categoryKey: "advisory",
    category: "Executive Advisory",
    desc: "High-level strategic advisory to schools, universities, governments, and educational trusts pursuing long-term academic excellence.",
    image: "/images/service_edu_consultancy.jpg",
    icon: Briefcase,
    link: null,
    tags: ["Strategy", "Advisory", "Governance"],
    deliverables: [
      "Institutional Vision Realignment",
      "Accreditation Preparedness",
      "Executive Board Advisory",
      "Expansion Feasibility Studies",
    ],
    term: "Advisory Retainer (3–12 Mos)",
  },
  {
    num: "05",
    title: "International Partnership Contracts",
    categoryKey: "global",
    category: "Global Treaties & Placements",
    desc: "Structuring cross-border partnerships between Nigerian institutions and premier foreign universities for dual-degree paths and global accreditation.",
    image: "/images/service_intl_partnerships.jpg",
    icon: Globe,
    link: null,
    tags: ["Nigeria", "UK", "US", "Canada"],
    deliverables: [
      "Bilateral MoU & Degree Structuring",
      "International Faculty Exchange",
      "Cross-Border Credit Articulation",
      "Global Research Joint Ventures",
    ],
    term: "Bilateral Institutional Treaty",
  },
  {
    num: "06",
    title: "Training & Capacity Building Contracts",
    categoryKey: "advisory",
    category: "Executive Advisory",
    desc: "Delivering executive development seminars, pedagogical masterclasses, and certified corporate upskilling programs for public and private institutions.",
    image: "/images/service_training_capacity.jpg",
    icon: Award,
    link: null,
    tags: ["Workshops", "Certifications", "CPD"],
    deliverables: [
      "Executive Leadership Retreats",
      "Faculty Pedagogical Masterclasses",
      "Workplace Professional Upskilling",
      "Accredited CPD Modules",
    ],
    term: "Cohort Modules & Retreats",
  },
  {
    num: "07",
    title: "Institutional Development Contracts",
    categoryKey: "institutional",
    category: "Institutional Governance",
    desc: "Establishing, chartering, or restructuring educational institutions with enduring governance, legal compliance, and strategic expansion blueprints.",
    image: "/images/media6.jpeg",
    icon: Landmark,
    link: null,
    tags: ["Governance", "Compliance", "Growth"],
    deliverables: [
      "Greenfield Institution Setup",
      "Licensing & Statutory Charter Support",
      "Organizational Hierarchy Structuring",
      "Capital Expansion Blueprints",
    ],
    term: "Turnkey Project (6–24 Mos)",
  },
  {
    num: "08",
    title: "School Turnaround Contracts",
    categoryKey: "institutional",
    category: "Institutional Governance",
    desc: "Reviving distressed or underperforming schools through rigorous operational overhauls, curriculum rejuvenation, and enrollment recovery.",
    image: "/images/media17.jpeg",
    icon: Activity,
    link: null,
    tags: ["Turnaround", "Revenue", "Curriculum"],
    deliverables: [
      "Distress Audit & Forensic Review",
      "Leadership & Staff Reorganization",
      "Enrollment Confidence Revival",
      "Operating Cash Flow Stabilization",
    ],
    term: "Emergency Turnaround (12–24 Mos)",
  },
  {
    num: "09",
    title: "Research & Project Management Contracts",
    categoryKey: "advisory",
    category: "Executive Advisory",
    desc: "Commissioning quantitative socioeconomic research, grant monitoring and evaluation (M&E), and end-to-end institutional project delivery.",
    image: "/images/media0.jpeg",
    icon: Bookmark,
    link: null,
    tags: ["Research", "Analytics", "Delivery"],
    deliverables: [
      "Field Research & Socio-Economic Surveys",
      "Monitoring & Evaluation (M&E) Plans",
      "Grant Implementation Oversight",
      "Data-Driven Policy Formulation",
    ],
    term: "Contract Milestone Mandate",
  },
  {
    num: "10",
    title: "Curriculum Development Contracts",
    categoryKey: "institutional",
    category: "Institutional Governance",
    desc: "Formulating modern academic and vocational curricula harmonized with Nigerian national requirements and benchmarked against Cambridge and IB frameworks.",
    image: "/images/media13.jpeg",
    icon: BookOpen,
    link: null,
    tags: ["STEM", "Vocational", "International Benchmarks"],
    deliverables: [
      "National Benchmark Alignment (NERDC/NUC)",
      "Cambridge / IB Modular Integration",
      "TVET Skills Practical Syllabus",
      "Teacher Instructional Manuals",
    ],
    term: "Curriculum Drafting & Pilot",
  },
  {
    num: "11",
    title: "Quality Assurance & Accreditation Consultancy",
    categoryKey: "institutional",
    category: "Institutional Governance",
    desc: "Guiding educational establishments through rigorous regulatory audits, mock evaluations, and standard compliance for statutory accreditation.",
    image: "/images/media15.jpeg",
    icon: ShieldCheck,
    link: null,
    tags: ["QA", "Regulation", "Accreditation"],
    deliverables: [
      "Mock Accreditation & Gap Analysis",
      "Standard Operating Procedures (SOP) Audit",
      "Laboratory & Library Benchmark Audits",
      "Regulatory Panel Defense Prep",
    ],
    term: "Accreditation Cycle (3–9 Mos)",
  },
  {
    num: "12",
    title: "Overseas Education & Student Recruitment",
    categoryKey: "global",
    category: "Global Treaties & Placements",
    desc: "Placing Nigerian and West African scholars in premier global universities with verified credentialing, consular advisory, and pre-departure pastoral care.",
    image: "/images/media1.jpeg",
    icon: Users,
    link: null,
    tags: ["Study Abroad", "Admissions", "Registry"],
    deliverables: [
      "Direct University Placements",
      "Visa & Credential Authentication",
      "Scholarship & Grant Facilitation",
      "Pre-Departure Student Pastoral Care",
    ],
    term: "Rolling Academic Intakes",
  },
  {
    num: "13",
    title: "Hospitality & Tourism Consultancy",
    categoryKey: "commercial",
    category: "Commercial & Hospitality",
    desc: "Advising hotels, luxury guest houses, and culinary operations on operational excellence, secret-shopper quality auditing, and staff grooming.",
    image: "/images/media12.jpeg",
    icon: Compass,
    link: null,
    tags: ["Hotels", "Tourism", "F&B"],
    deliverables: [
      "Concept Feasibility & Positioning",
      "Service Audit & Mystery Guest Reviews",
      "F&B Cost Control & Recipe Costing",
      "Hospitality Staff Certification",
    ],
    term: "Consultancy Retainer",
  },
  {
    num: "14",
    title: "Business Development & Management Consultancy",
    categoryKey: "commercial",
    category: "Commercial & Hospitality",
    desc: "Accelerating enterprise growth, organizational restructure, and profitability optimization through structured corporate governance and management advisory.",
    image: "/images/media4.jpeg",
    icon: TrendingUp,
    link: null,
    tags: ["Strategy", "Profitability", "Advisory"],
    deliverables: [
      "Commercial Market Penetration Plan",
      "Business Process Re-engineering",
      "Executive Growth Mentorship",
      "P&L Optimization Architecture",
    ],
    term: "Strategic Growth Retainer",
  },
  {
    num: "15",
    title: "Conference & Event Management Contracts",
    categoryKey: "advisory",
    category: "Executive Advisory",
    desc: "Curating and administering international academic colloquia, professional symposiums, award ceremonies, and institutional banquets with diplomatic protocol.",
    image: "/images/media5.jpeg",
    icon: Calendar,
    link: null,
    tags: ["Conferences", "Seminars", "Exhibitions"],
    deliverables: [
      "Diplomatic Protocol & Logistics",
      "VIP Delegation & Speaker Management",
      "Hybrid Broadcast & Media Production",
      "Corporate Sponsor & Delegate Registry",
    ],
    term: "Event Production Cycle",
  },
  {
    num: "16",
    title: "Government & NGO Development Contracts",
    categoryKey: "global",
    category: "Global Treaties & Placements",
    desc: "Partnering with state ministries, federal departments, and international NGOs to execute large-scale educational reform and youth workforce initiatives.",
    image: "/images/media19.jpeg",
    icon: FileText,
    link: null,
    tags: ["Government", "NGOs", "Development"],
    deliverables: [
      "Public Educational Reform Delivery",
      "Youth Livelihoods & Skills Schemes",
      "Donor-Funded Project Administration",
      "Impact Assessment & Policy Output",
    ],
    term: "Public Sector Project Mandate",
  },
];

const stats = [
  { num: 16, suffix: "+", label: "Core Services" },
  { num: 20, suffix: "+", label: "Managed Portfolios" },
  { num: 5000, suffix: "+", label: "Candidates Placed" },
  { num: 5, suffix: " Yrs", label: "In Operation" },
];

/* ─────────────────────────────────────────────────────────
   MAIN COMPONENT
────────────────────────────────────────────────────────── */
export default function ServicesClient() {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedContract, setSelectedContract] = useState<ContractItem | null>(null);

  // Keyboard and body scroll controls for dossier drawer
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedContract(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    if (selectedContract) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedContract]);

  const filteredServices = activeCategory === "all"
    ? services
    : services.filter((s) => s.categoryKey === activeCategory);

  const handleInquiry = (title: string) => {
    const selectEl = document.getElementById("sector") as HTMLSelectElement | null;
    if (selectEl) {
      // Find matching option or closest match
      const options = Array.from(selectEl.options);
      const match = options.find((opt) =>
        opt.value.toLowerCase() === title.toLowerCase() ||
        opt.value.toLowerCase().includes(title.toLowerCase().slice(0, 10)) ||
        title.toLowerCase().includes(opt.value.toLowerCase().slice(0, 10))
      );
      if (match) {
        selectEl.value = match.value;
      } else {
        selectEl.value = title;
      }
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }
    const messageEl = document.getElementById("message") as HTMLTextAreaElement | null;
    if (messageEl) {
      messageEl.value = `Inquiry regarding: ${title}.\n\n`;
      messageEl.focus();
    }
    const formEl = document.getElementById("request-form");
    if (formEl) formEl.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="font-body bg-[#04090F] text-white overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO — full-bleed with particle network
      ═════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-end pb-16 sm:pb-24 overflow-hidden bg-[#04090F]">
        <ParticleCanvas />

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,#04090F_80%)] pointer-events-none" />

        {/* Large ghost text backdrop */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span className="font-display font-black text-[18vw] uppercase text-white/[0.025] leading-none tracking-tighter whitespace-nowrap">
            SERVICES
          </span>
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-5 sm:px-8">
          <div className="space-y-8 max-w-4xl">
            {/* Label */}
            <div className="flex items-center gap-4">
              <div className="w-8 h-[1.5px] bg-blue-500" />
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Services & Management
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-6xl sm:text-8xl lg:text-[10rem] font-black uppercase tracking-tight text-white leading-[0.88]">
              Services &<br />Contracts
            </h1>

            {/* Sub */}
            <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-xl">
              A comprehensive portfolio of educational management contracts, institutional development, and strategic advisory services operated by WMES across Nigeria and internationally.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href="#services-list"
                className="group inline-flex items-center gap-2.5 bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-full text-xs font-semibold transition-all hover:shadow-[0_0_28px_rgba(59,130,246,0.5)]"
              >
                <span>Browse All Services</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#request-form"
                className="group inline-flex items-center gap-2.5 border border-white/15 hover:border-white/40 text-white/70 hover:text-white px-7 py-3.5 rounded-full text-xs font-semibold transition-all"
              >
                <span>Request Consultation</span>
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Scroll cue */}
          <div className="absolute bottom-8 right-8 hidden lg:flex flex-col items-center gap-2 text-white/20">
            <span className="text-xs uppercase tracking-wider rotate-90 origin-center translate-y-6">Scroll</span>
            <div className="w-[1px] h-12 bg-white/15" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          STATS STRIP
      ═════════════════════════════════════════ */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-y divide-slate-200">
            {stats.map((s, i) => (
              <div key={i} className="p-10 sm:p-12 lg:p-14 hover:bg-slate-50 transition-colors">
                <div className="font-display text-5xl sm:text-6xl font-black text-[#04090F] tracking-tight leading-none">
                  <Counter to={s.num} suffix={s.suffix} />
                </div>
                <div className="text-xs uppercase tracking-wider text-blue-600 font-semibold mt-3">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          OUR CONTRACTS — EDITORIAL ARCHITECTURAL REGISTRY
      ═════════════════════════════════════════ */}
      <section id="services-list" className="bg-[#04090F] py-28 sm:py-36 relative overflow-hidden border-t border-white/[0.07]">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          {/* Section Header */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-blue-500" />
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  What We Offer
                </span>
              </div>
              <h2 className="font-display text-5xl sm:text-7xl lg:text-8xl font-black uppercase text-white tracking-tight leading-[0.9]">
                Our Contracts
              </h2>
              <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed pt-2">
                WMES provides 16 specialized services and management contracts across Nigeria and internationally — delivering institutional governance, commercial management, and strategic educational advisory.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-8 border-t lg:border-t-0 lg:border-l border-white/10 pt-6 lg:pt-0 lg:pl-10 shrink-0">
              <div>
                <div className="font-display text-4xl sm:text-5xl font-black text-white leading-none">
                  16
                </div>
                <div className="text-xs uppercase tracking-wider text-blue-400 font-medium mt-2">
                  Core Services
                </div>
              </div>
              <div className="w-[1px] h-12 bg-white/10" />
              <div>
                <div className="font-display text-4xl sm:text-5xl font-black text-white leading-none">
                  100%
                </div>
                <div className="text-xs uppercase tracking-wider text-blue-400 font-medium mt-2">
                  Quality Assured
                </div>
              </div>
            </div>
          </div>

          {/* Category Navigation */}
          <div className="border-b border-white/[0.08] mb-12">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
              {categories.map((cat) => {
                const isSelected = activeCategory === cat.key;
                return (
                  <button
                    key={cat.key}
                    type="button"
                    onClick={() => setActiveCategory(cat.key)}
                    className={`group relative px-5 py-2.5 rounded-full text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-2 ${
                      isSelected
                        ? "bg-white text-[#04090F] font-semibold shadow-lg"
                        : "text-slate-400 hover:text-white bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.06]"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full transition-colors ${
                        isSelected
                          ? "bg-blue-600 text-white font-semibold"
                          : "bg-white/5 text-slate-400 group-hover:text-white"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial 2-Column Cards Grid — Falling in from the two ends on scroll */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
            <AnimatePresence>
              {filteredServices.map((s, idx) => {
                const Icon = s.icon;
                const isLeft = idx % 2 === 0;
                return (
                  <motion.article
                    key={s.num}
                    initial={{
                      opacity: 0,
                      x: isLeft ? -260 : 260,
                      y: -70,
                      rotate: isLeft ? -3.5 : 3.5,
                    }}
                    whileInView={{
                      opacity: 1,
                      x: 0,
                      y: 0,
                      rotate: 0,
                    }}
                    viewport={{ once: true, amount: 0.08, margin: "0px 0px -20px 0px" }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{
                      duration: 0.85,
                      ease: [0.16, 1, 0.3, 1],
                      delay: (idx % 2) * 0.07,
                    }}
                    whileHover={{ y: -6, transition: { duration: 0.25 } }}
                    style={{ willChange: "transform, opacity" }}
                    className="group relative bg-[#070D18] hover:bg-[#0A1224] border border-white/[0.08] hover:border-blue-500/35 rounded-3xl p-6 sm:p-8 transition-colors duration-300 flex flex-col justify-between"
                  >
                    {/* Top: Inset Architectural Image Frame — Clean without overlays */}
                    <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden bg-slate-950 mb-7">
                      <Image
                        src={s.image}
                        alt={s.title}
                        fill
                        className="object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                        sizes="(max-width: 1024px) 100vw, 50vw"
                      />
                    </div>

                    {/* Card Body */}
                    <div className="flex-1 flex flex-col justify-between space-y-6">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-blue-400 font-semibold">
                            {s.category}
                          </span>
                          <span className="text-slate-400 font-light">{s.term}</span>
                        </div>
                        <h3 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-tight text-white group-hover:text-blue-200 transition-colors leading-[1.1]">
                          {s.title}
                        </h3>

                        <p className="text-slate-300/80 text-sm sm:text-base font-light leading-relaxed">
                          {s.desc}
                        </p>
                      </div>

                      {/* Key Deliverables */}
                      <div className="pt-5 border-t border-white/[0.06] space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-slate-300">
                            Key Deliverables
                          </span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {s.deliverables.map((item, dIdx) => (
                            <span
                              key={dIdx}
                              className="text-xs text-slate-300/90 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.07] px-3 py-1.5 rounded-lg transition-colors"
                            >
                              {item}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Card Action Bar */}
                      <div className="pt-6 border-t border-white/[0.07] flex items-center justify-between gap-3">
                        <button
                          type="button"
                          onClick={() => setSelectedContract(s)}
                          className="text-xs text-slate-300 hover:text-white font-medium transition-colors flex items-center gap-1.5 cursor-pointer py-2"
                        >
                          <span>More Details</span>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
                        </button>

                        <div className="flex items-center gap-2.5">
                          {s.link && (
                            <Link
                              href={s.link}
                              className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white border border-white/15 hover:border-white/40 px-4 py-2.5 rounded-full font-medium transition-colors"
                            >
                              <span>Portfolio</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => handleInquiry(s.title)}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-full text-xs font-semibold transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer"
                          >
                            <span>Contact</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
            </AnimatePresence>
          </div>

        </div>

        {/* Interactive Slide-Over Scope Dossier */}
        <AnimatePresence>
          {selectedContract && (
            <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                onClick={() => setSelectedContract(null)}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm cursor-pointer"
              />

              {/* Drawer panel */}
              <motion.aside
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 32, stiffness: 320 }}
                className="relative z-10 w-full max-w-2xl bg-[#060D18] border-l border-white/10 h-full overflow-y-auto flex flex-col shadow-2xl"
              >
                {/* Top bar with close button */}
                <div className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 bg-[#060D18]/90 backdrop-blur-md border-b border-white/10">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                      Service Overview
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedContract(null)}
                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors cursor-pointer"
                    aria-label="Close details"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Hero Image in Drawer */}
                <div className="relative aspect-[16/9] w-full shrink-0">
                  <Image
                    src={selectedContract.image}
                    alt={selectedContract.title}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#060D18] via-transparent to-black/30" />
                  <div className="absolute bottom-4 left-6 right-6">
                    <span className="text-xs text-blue-200 bg-blue-950/90 px-3 py-1 rounded-full border border-blue-500/30 font-medium">
                      {selectedContract.category}
                    </span>
                  </div>
                </div>

                {/* Drawer Content */}
                <div className="p-6 sm:p-8 space-y-8 flex-1">
                  <div className="space-y-3">
                    <h3 className="font-display text-3xl sm:text-4xl font-black uppercase tracking-tight text-white leading-tight">
                      {selectedContract.title}
                    </h3>
                    <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                      {selectedContract.desc}
                    </p>
                  </div>

                  {/* Engagement Specifications */}
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                    <div>
                      <div className="text-xs text-slate-400 font-medium">
                        Engagement Model
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        {selectedContract.term}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-400 font-medium">
                        Jurisdiction
                      </div>
                      <div className="text-sm font-semibold text-white mt-1">
                        Nigeria & International
                      </div>
                    </div>
                  </div>

                  {/* Core Deliverables */}
                  <div className="space-y-4">
                    <h4 className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                      Key Deliverables & Scope
                    </h4>
                    <div className="space-y-3">
                      {selectedContract.deliverables.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.05]">
                          <Check className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          <div>
                            <div className="text-sm text-white font-medium">{item}</div>
                            <div className="text-xs text-slate-400 font-light mt-0.5">
                              Delivered under WMES quality assurance and operational reporting standards.
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Sector Tags */}
                  <div className="space-y-2 pt-2">
                    <div className="text-xs text-slate-400 font-medium">
                      Focus Areas
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedContract.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-xs text-slate-300 bg-white/5 border border-white/10 px-3 py-1 rounded-lg"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sticky Drawer Footer */}
                <div className="sticky bottom-0 z-20 p-6 bg-[#060D18] border-t border-white/10 flex items-center justify-between gap-4">
                  {selectedContract.link ? (
                    <Link
                      href={selectedContract.link}
                      className="text-xs text-slate-300 hover:text-white border border-white/20 hover:border-white/40 px-5 py-2.5 rounded-full font-medium transition-colors inline-flex items-center gap-1.5"
                    >
                      <span>View Portfolio</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : (
                    <div className="text-xs text-slate-500 font-light">
                      Direct inquiry with advisory desk
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      const title = selectedContract.title;
                      setSelectedContract(null);
                      setTimeout(() => handleInquiry(title), 120);
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-full text-xs font-semibold transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.5)] cursor-pointer"
                  >
                    <span>Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </motion.aside>
            </div>
          )}
        </AnimatePresence>
      </section>

      {/* ══════════════════════════════════════════
          CONSULTATION FORM — full redesign container
      ═════════════════════════════════════════ */}
      <section className="bg-[#060E1A] py-24 sm:py-32">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-0">

            {/* Left: context copy */}
            <div className="lg:col-span-4 lg:pr-16 lg:border-r lg:border-white/[0.07] space-y-8 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-8 h-[1.5px] bg-blue-500" />
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    Inquiries & Consultation
                  </span>
                </div>
                <h2 className="font-display text-4xl sm:text-5xl font-black uppercase text-white tracking-tight leading-none">
                  Request a Consultation
                </h2>
                <p className="text-slate-400 text-sm font-light leading-relaxed">
                  Submit your organizational requirements. Our corporate advisory desk will contact you within 24 hours to structure a contract agreement tailored to your mandate.
                </p>

                {/* Process steps */}
                <div className="space-y-5 pt-4">
                  {[
                    { step: "01", label: "Submit Brief", desc: "Fill the form with your requirements" },
                    { step: "02", label: "Advisory Review", desc: "Our desk reviews and assigns a manager" },
                    { step: "03", label: "Contract Drafted", desc: "Formal engagement agreement issued" },
                  ].map((s) => (
                    <div key={s.step} className="flex items-start gap-4">
                      <span className="font-display text-2xl font-black text-blue-500/30 leading-none w-10 shrink-0">
                        {s.step}
                      </span>
                      <div>
                        <div className="text-sm font-semibold text-white">
                          {s.label}
                        </div>
                        <div className="text-slate-400 text-xs font-light mt-0.5">
                          {s.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact details */}
              <div className="pt-6 border-t border-white/[0.07] space-y-2">
                <p className="text-xs uppercase tracking-wider text-slate-400 font-medium">Direct Contact</p>
                <p className="text-sm text-white/70 font-light">worldmobileedusystem@gmail.com</p>
                <p className="text-sm text-white/70 font-light">+234 803 591 9246</p>
              </div>
            </div>

            {/* Right: form */}
            <div className="lg:col-span-8 lg:pl-16">
              <ConsultationForm />
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
