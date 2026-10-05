"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import ConsultationForm from "@/components/ConsultationForm";
import {
  Building2,
  ShieldCheck,
  Home,
  MapPin,
  Phone,
  Mail,
  MessageSquare,
  ArrowRight,
  Check,
  Compass,
  BadgeCheck
} from "lucide-react";

/* ─────────────────────────────────────────────────────────
   DATA: 4 CORE SERVICE PRACTICE PILLARS
────────────────────────────────────────────────────────── */
interface ServicePillar {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  services: string[];
  deliverables: string[];
}

const servicePillars: ServicePillar[] = [
  {
    id: "acquisition",
    title: "Property Sales & Land Acquisition",
    subtitle: "Due Diligence & Title Verification",
    icon: Home,
    description:
      "Structured advisory for acquiring verified residential properties, prime commercial real estate, and unencumbered land with zero litigation risk.",
    services: [
      "Residential Homes & Duplex Sales",
      "Commercial Complex & Hub Acquisition",
      "Cadastral Land Search & Title Verification",
      "Government Registry Due Diligence (Ministry of Lands)"
    ],
    deliverables: [
      "Forensic Title Audit & Search Report",
      "Survey Coordinate & Beacon Authentication",
      "Executed Contract of Sale & Deed of Assignment",
      "Clean Handover of Physical Possession"
    ]
  },
  {
    id: "leasing",
    title: "Commercial & Residential Leasing",
    subtitle: "Corporate Tenancies & Yield Optimization",
    icon: Building2,
    description:
      "Matching corporations, educational institutions, and high-net-worth families with premium office complexes, retail centers, and residential dwellings.",
    services: [
      "Corporate Office & Retail Floor Leasing",
      "Educational & Institutional Facility Tenancies",
      "Luxury Residential Apartments & Villas",
      "Long-Term Leasehold Structuring"
    ],
    deliverables: [
      "Tenant Vetting & Credit Risk Review",
      "Legally Enforceable Tenancy Agreements",
      "Escrow Deposit & Rent Collection Systems",
      "Routine Condition Inspections & Handover Audits"
    ]
  },
  {
    id: "management",
    title: "Property & Facility Stewardship",
    subtitle: "Occupancy, Maintenance & Fiduciary Reporting",
    icon: ShieldCheck,
    description:
      "End-to-end management of private estates, corporate complexes, and commercial properties with rigorous asset protection and tenant relations.",
    services: [
      "Full Facility Maintenance & Engineering Care",
      "Service Charge Budgeting & Accounting",
      "24/7 Security & Environmental Management",
      "Preventive Building Inspections & Repairs"
    ],
    deliverables: [
      "Quarterly Financial Statements & Yield Ledgers",
      "Planned Preventive Maintenance (PPM) Schedules",
      "Dedicated On-Site Facility Manager",
      "Emergency Maintenance Hotline & Resolution"
    ]
  },
  {
    id: "development",
    title: "Estate Development & Valuation Advisory",
    subtitle: "Master-Planning, Project Supervision & Valuation",
    icon: Compass,
    description:
      "Guiding landowners, developers, and corporate investors through master-planning, statutory approvals, site construction supervision, and fair-market asset valuations.",
    services: [
      "Master-Planned Estate Conceptualization",
      "Statutory Building Approvals & C of O Processing",
      "Independent Building Project Quality Supervision",
      "Certified Open-Market Asset Valuations"
    ],
    deliverables: [
      "Comprehensive Architectural & Feasibility Dossiers",
      "Material Quality & Structural Integrity Reports",
      "Certified Valuation Certificate for Banks/Investors",
      "Milestone-Based Construction Oversight"
    ]
  }
];

/* ─────────────────────────────────────────────────────────
   DATA: 4-STAGE DUE DILIGENCE PROTOCOL
────────────────────────────────────────────────────────── */
const verificationSteps = [
  {
    step: "01",
    title: "Cadastral Registry Search",
    subtitle: "Government Records Verification",
    desc: "Our legal counsel performs independent title searches at the State Ministry of Lands and Federal Land Registry to confirm ownership history and ensure zero government acquisition or court injunctions."
  },
  {
    step: "02",
    title: "Beacon & Perimeter Demarcation",
    subtitle: "Registered Surveyor Ground Audit",
    desc: "Licensed surveyors inspect coordinates in the field, verifying boundary stones (beacons), actual land square-meterage, topography, soil stability, and zoning adherence."
  },
  {
    step: "03",
    title: "Conveyance & Escrow Settlement",
    subtitle: "Fiduciary Legal Protection",
    desc: "Preparation of clean Deeds of Assignment, Contracts of Sale, and Power of Attorney executed under structured legal escrow to safeguard capital until all verification criteria pass."
  },
  {
    step: "04",
    title: "Possession & Governance Custody",
    subtitle: "Seamless Handover & Registration",
    desc: "Physical possession handover with local community settlement indemnities, followed by statutory perfection of title (Governor’s Consent / C of O processing) and optional facility stewardship."
  }
];

export default function RealEstateClient() {
  // Active Practice Pillar Tab
  const [activePillarId, setActivePillarId] = useState<string>("acquisition");

  // Investment Calculator State
  const [calcInvestment, setCalcInvestment] = useState<number>(50000000); // ₦50M
  const [calcYears, setCalcYears] = useState<number>(5); // 5 Years
  const [calcYieldPercent, setCalcYieldPercent] = useState<number>(10); // 10% annual rental yield
  const [calcAppreciationPercent, setCalcAppreciationPercent] = useState<number>(14); // 14% annual appreciation

  // Calculated ROI Metrics
  const calculatedMetrics = useMemo(() => {
    const annualRental = (calcInvestment * calcYieldPercent) / 100;
    const totalRentalIncome = annualRental * calcYears;
    const futureAssetValue = calcInvestment * Math.pow(1 + calcAppreciationPercent / 100, calcYears);
    const capitalGain = futureAssetValue - calcInvestment;
    const totalReturn = totalRentalIncome + capitalGain;
    const roiPercentage = ((totalReturn / calcInvestment) * 100).toFixed(1);

    return {
      annualRental,
      totalRentalIncome,
      futureAssetValue,
      capitalGain,
      totalReturn,
      roiPercentage
    };
  }, [calcInvestment, calcYears, calcYieldPercent, calcAppreciationPercent]);

  // Format currency helper
  const formatNaira = (val: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0
    }).format(val).replace("NGN", "₦");
  };

  // Pre-fill Consultation form helper
  const handleInquiry = (topic: string) => {
    const selectEl = document.getElementById("sector") as HTMLSelectElement | null;
    if (selectEl) {
      let hasOption = false;
      for (let i = 0; i < selectEl.options.length; i++) {
        if (selectEl.options[i].value === topic) {
          hasOption = true;
          break;
        }
      }
      if (!hasOption) {
        const newOpt = document.createElement("option");
        newOpt.value = topic;
        newOpt.text = topic;
        selectEl.appendChild(newOpt);
      }
      selectEl.value = topic;
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    const messageEl = document.getElementById("message") as HTMLTextAreaElement | null;
    if (messageEl) {
      messageEl.value = `Structuring an inquiry regarding: ${topic}.\n\n`;
      messageEl.focus();
    }

    const formEl = document.getElementById("request-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const activePillar = useMemo(() => {
    return servicePillars.find((p) => p.id === activePillarId) || servicePillars[0];
  }, [activePillarId]);

  return (
    <div className="font-body bg-[#030812] text-white min-h-screen selection:bg-blue-600 selection:text-white">
      
      {/* ══════════════════════════════════════════
          HERO SECTION (Preserved as requested)
      ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative overflow-hidden border-b border-white/[0.08] bg-gradient-to-b from-[#060D1A] to-[#030812]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Content */}
            <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-blue-500" />
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  Real Estate & Property Management
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-white leading-tight">
                WMES Real Estate & Property Management
              </h1>

              <p className="text-blue-300 text-xs sm:text-sm uppercase tracking-wider font-semibold">
                Building Wealth Through Trusted, Legally Verified Real Estate
              </p>

              <p className="text-slate-300 text-sm sm:text-base max-w-xl font-light leading-relaxed">
                World Mobile Educational System (WMES) delivers dependable, transparent, and professional real estate solutions for institutional investors, families, corporations, and estate developers across major Nigerian metropolitan centers.
              </p>

              <div className="flex flex-wrap gap-4 pt-2">
                <button
                  onClick={() => handleInquiry("General Real Estate Advisory")}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.45)] cursor-pointer"
                >
                  Request Consultation
                </button>
                <a
                  href="#practice-areas"
                  className="border border-white/20 hover:border-white/40 text-slate-300 hover:text-white px-7 py-3.5 rounded-full text-xs font-medium transition-all"
                >
                  Our Practice Areas
                </a>
              </div>
            </div>

            {/* Right Column: Hero Image */}
            <div className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-[1.3] rounded-3xl overflow-hidden border border-white/10 bg-slate-950 shadow-2xl group">
              <Image
                src="/images/wmes_real_estate_hero.png"
                alt="WMES Premium Real Estate & Property Management"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover group-hover:scale-[1.03] transition-transform duration-700"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#030812]/70 via-transparent to-transparent pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          METRICS STRIP
      ═════════════════════════════════════════ */}
      <section className="border-b border-white/[0.08] bg-[#050C18]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">100%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Verified Freehold & Titles</div>
            </div>
            <div className="space-y-1 md:pl-8 pt-4 md:pt-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">₦2.4B+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Assets Under Management</div>
            </div>
            <div className="space-y-1 md:pl-8 pt-4 md:pt-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">120+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Plots & Hectares Allocated</div>
            </div>
            <div className="space-y-1 md:pl-8 pt-4 md:pt-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">Zero</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Litigation Disputes</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          4 CORE PRACTICE PILLARS
      ═════════════════════════════════════════ */}
      <section id="practice-areas" className="py-24 sm:py-32 relative border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl space-y-4 mb-14">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-blue-500" />
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Our Practice Architecture
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Comprehensive Real Estate Services
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              We consolidate specialized property and land stewardship functions into 4 disciplined institutional practice areas for seamless execution.
            </p>
          </div>

          {/* Practice Area Selector Tabs */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {servicePillars.map((p) => {
              const isSelected = activePillarId === p.id;
              const Icon = p.icon;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActivePillarId(p.id)}
                  className={`p-6 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? "bg-[#091428] border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.2)]"
                      : "bg-[#060D1A] border-white/[0.08] hover:bg-[#071122] hover:border-white/20"
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    isSelected ? "bg-blue-600 text-white" : "bg-white/5 text-slate-400"
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">
                      {p.title}
                    </h3>
                    <p className="text-slate-400 text-xs font-light mt-1 line-clamp-1">
                      {p.subtitle}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Active Pillar Detail Panel */}
          <div className="bg-[#060D1A] border border-white/[0.08] rounded-3xl p-8 sm:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Scope & Overview */}
              <div className="lg:col-span-5 space-y-6">
                <div>
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    Practice Scope
                  </span>
                  <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight mt-1">
                    {activePillar.title}
                  </h3>
                </div>

                <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                  {activePillar.description}
                </p>

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                    Core Functions
                  </span>
                  <div className="space-y-2">
                    {activePillar.services.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-xs text-slate-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleInquiry(`Specialized Practice: ${activePillar.title}`)}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] cursor-pointer"
                  >
                    <span>Contact</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Right Column: Key Deliverables & Client Protections */}
              <div className="lg:col-span-7 bg-[#040913] border border-white/[0.06] rounded-2xl p-6 sm:p-8 space-y-6">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                  Enforceable Deliverables & Legal Safeguards
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activePillar.deliverables.map((deliv, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.05] space-y-2">
                      <Check className="w-4 h-4 text-emerald-400" />
                      <div className="text-xs font-medium text-white">{deliv}</div>
                    </div>
                  ))}
                </div>

                <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-500/20 text-xs text-slate-300 font-light leading-relaxed">
                  Every contract is administered under written fiduciary standards, ensuring our clients receive verified documentation, verified survey coordinates, and direct indemnity protection.
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          4-STAGE DUE DILIGENCE & VERIFICATION PROTOCOL
      ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 relative border-b border-white/[0.08] bg-[#040A16]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl space-y-4 mb-16">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1.5px] bg-blue-500" />
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Risk Mitigation Framework
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              The WMES 4-Stage Verification Protocol
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              How we guarantee genuine property ownership, eliminate title fraud, and ensure your capital is 100% protected before any transaction closes.
            </p>
          </div>

          {/* 4 Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {verificationSteps.map((item, idx) => (
              <div
                key={idx}
                className="bg-[#070E1B] border border-white/[0.08] rounded-2xl p-7 space-y-5 hover:border-blue-500/30 transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="font-display text-3xl font-black text-blue-500/40">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-display text-base font-bold text-white uppercase tracking-tight">
                      {item.title}
                    </h3>
                    <div className="text-xs text-blue-400 font-medium mt-0.5">
                      {item.subtitle}
                    </div>
                  </div>
                  <p className="text-slate-300 text-xs font-light leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>Verified Legal Protection</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          CONTACT & CONSULTATION SECTION
      ═════════════════════════════════════════ */}
      <section id="request-form" className="py-24 sm:py-32 relative bg-[#030712] border-b border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Details Column */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1.5px] bg-blue-500" />
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    Real Estate Advisory Desk
                  </span>
                </div>
                <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
                  Contact Our Property Team
                </h2>
                <p className="text-slate-300 text-sm font-light leading-relaxed">
                  Whether you are planning a land acquisition, listing commercial space, or seeking end-to-end facility management, our certified team is ready to assist you.
                </p>
              </div>

              {/* Office Location */}
              <div className="bg-[#060D1A] border border-white/[0.08] rounded-2xl p-5 flex gap-4 items-start">
                <MapPin className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                    Office Location
                  </span>
                  <p className="text-white text-sm font-medium">
                    Chika&apos;s Plaza, Centenary Estate, Enugu, Nigeria.
                  </p>
                </div>
              </div>

              {/* Communication Channels */}
              <div className="bg-[#060D1A] border border-white/[0.08] rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-4">
                  <Phone className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      Direct Telephone
                    </span>
                    <a href="tel:08030896650" className="text-white text-sm font-medium hover:text-blue-300 transition-colors">
                      +234 803 089 6650
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-4">
                  <MessageSquare className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      WhatsApp Real Estate Desk
                    </span>
                    <a
                      href="https://wa.me/2349048888400"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-sm font-medium hover:text-emerald-300 transition-colors"
                    >
                      +234 904 888 8400
                    </a>
                  </div>
                </div>

                <div className="pt-3 border-t border-white/[0.06] flex items-center gap-4">
                  <Mail className="w-5 h-5 text-blue-400 shrink-0" />
                  <div>
                    <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                      Email Inquiries
                    </span>
                    <a
                      href="mailto:worldmobileedusystem@gmail.com"
                      className="text-white text-sm font-medium hover:text-blue-300 transition-colors"
                    >
                      worldmobileedusystem@gmail.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Institutional Assurance */}
              <div className="p-6 rounded-2xl bg-[#060D1A] border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                  <BadgeCheck className="w-4 h-4" />
                  <span>Licensed Fiduciary Real Estate Entity</span>
                </div>
                <p className="text-slate-400 text-xs font-light leading-relaxed">
                  Every property mandate is handled with formal legal covenants, ensuring clean title transfers, transparent billing, and zero third-party encumbrances.
                </p>
              </div>

            </div>

            {/* Consultation Form Panel */}
            <div className="lg:col-span-7 bg-[#060D1A] border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl">
              <ConsultationForm />
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          INTERACTIVE REAL ESTATE INVESTMENT & YIELD CALCULATOR
          (Moved to the last section of the page as requested)
      ═════════════════════════════════════════ */}
      <section id="calculator" className="py-24 sm:py-32 relative bg-[#040A16]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="max-w-2xl mx-auto text-center space-y-4 mb-16">
            <div className="flex items-center justify-center gap-3">
              <span className="w-8 h-[1.5px] bg-blue-500" />
              <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                Investment Analysis Tool
              </span>
              <span className="w-8 h-[1.5px] bg-blue-500" />
            </div>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
              Real Estate Yield & ROI Estimator
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
              Estimate your projected rental cash flows, capital appreciation, and overall return on real estate portfolios in Nigeria. Adjust parameters to model your investment horizon.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center bg-[#070F1E] border border-white/[0.08] rounded-3xl p-8 sm:p-12 shadow-2xl">
            
            {/* Left Controls: Sliders */}
            <div className="lg:col-span-6 space-y-8">
              
              {/* Slider 1: Capital Investment */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Total Capital Outlay</span>
                  <span className="text-blue-400 font-bold text-sm sm:text-base">{formatNaira(calcInvestment)}</span>
                </div>
                <input
                  type="range"
                  min={10000000}
                  max={250000000}
                  step={5000000}
                  value={calcInvestment}
                  onChange={(e) => setCalcInvestment(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>₦10,000,000</span>
                  <span>₦250,000,000</span>
                </div>
              </div>

              {/* Slider 2: Holding Horizon */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Investment Horizon (Years)</span>
                  <span className="text-white font-bold text-sm sm:text-base">{calcYears} Years</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  step={1}
                  value={calcYears}
                  onChange={(e) => setCalcYears(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>1 Year</span>
                  <span>10 Years</span>
                </div>
              </div>

              {/* Slider 3: Projected Rental Yield */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Annual Rental Yield (%)</span>
                  <span className="text-emerald-400 font-bold text-sm sm:text-base">{calcYieldPercent}% / yr</span>
                </div>
                <input
                  type="range"
                  min={5}
                  max={18}
                  step={0.5}
                  value={calcYieldPercent}
                  onChange={(e) => setCalcYieldPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>5% (Conservative)</span>
                  <span>18% (Commercial Prime)</span>
                </div>
              </div>

              {/* Slider 4: Land/Asset Capital Growth */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 font-medium">Estimated Capital Appreciation (%)</span>
                  <span className="text-blue-300 font-bold text-sm sm:text-base">{calcAppreciationPercent}% / yr</span>
                </div>
                <input
                  type="range"
                  min={6}
                  max={25}
                  step={1}
                  value={calcAppreciationPercent}
                  onChange={(e) => setCalcAppreciationPercent(Number(e.target.value))}
                  className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
                />
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>6% (Standard)</span>
                  <span>25% (High Growth Corridor)</span>
                </div>
              </div>

            </div>

            {/* Right Display: Live Estimated Yield Ledger */}
            <div className="lg:col-span-6 bg-[#040813] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-6">
              
              <div className="border-b border-white/[0.08] pb-4">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-medium block">
                  Projected Portfolio Outcome ({calcYears} Years)
                </span>
                <div className="font-display text-3xl sm:text-4xl font-black text-white mt-1">
                  {formatNaira(calculatedMetrics.futureAssetValue + calculatedMetrics.totalRentalIncome)}
                </div>
                <div className="text-xs text-emerald-400 font-semibold mt-1">
                  +{calculatedMetrics.roiPercentage}% Cumulative Estimated Gain
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Annual Rental Income</span>
                  <span className="text-white font-bold text-sm mt-1 block">
                    {formatNaira(calculatedMetrics.annualRental)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Total Cumulative Rent</span>
                  <span className="text-white font-bold text-sm mt-1 block">
                    {formatNaira(calculatedMetrics.totalRentalIncome)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Projected Asset Value</span>
                  <span className="text-white font-bold text-sm mt-1 block">
                    {formatNaira(calculatedMetrics.futureAssetValue)}
                  </span>
                </div>

                <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                  <span className="text-slate-400 block text-[11px]">Net Capital Gain</span>
                  <span className="text-emerald-400 font-bold text-sm mt-1 block">
                    +{formatNaira(calculatedMetrics.capitalGain)}
                  </span>
                </div>
              </div>

              <p className="text-slate-400 text-xs font-light leading-relaxed">
                *Projections are educational models based on prevailing prime commercial and residential growth in Enugu and major Nigerian growth corridors. Actual performance is governed by market conditions and executed lease agreements.
              </p>

              <button
                type="button"
                onClick={() =>
                  handleInquiry(
                    `Real Estate Investment Structuring: ${formatNaira(calcInvestment)} across ${calcYears} Years`
                  )
                }
                className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white py-3.5 px-6 rounded-full text-xs font-semibold transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.45)] cursor-pointer"
              >
                <span>Structure Portfolio with WMES Advisory</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
