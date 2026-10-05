"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  ArrowUpRight,
  Eye,
  Target,
  Scale
} from "lucide-react";

export default function AboutClient() {

  return (
    <div className="font-body bg-[#030812] text-white min-h-screen selection:bg-blue-600 selection:text-white">
      
      {/* ══════════════════════════════════════════
          1. HERO HEADER — Clean Editorial Architecture
      ═════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 border-b border-white/[0.08] bg-gradient-to-b from-[#060D1A] to-[#030812] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex items-center gap-3">
                <span className="w-8 h-[1.5px] bg-blue-500" />
                <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                  Institutional Profile & Charter
                </span>
              </div>

              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-white leading-[1.05]">
                World Mobile Educational System
              </h1>

              <p className="text-blue-300 text-sm sm:text-base uppercase tracking-wider font-semibold">
                United States Accredited • Chartered in Nigeria • Global Impact
              </p>

              <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed max-w-2xl">
                World Mobile Educational System (WMES) is an international educational management, professional training, and corporate consultancy organization. We partner with proprietors, university councils, governments, and private investors to deliver institutional governance, turnaround management, and cross-border academic excellence.
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <a
                  href="#story"
                  className="bg-blue-600 hover:bg-blue-500 text-white px-7 py-3.5 rounded-full text-xs font-semibold transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.45)] cursor-pointer inline-flex items-center gap-2"
                >
                  <span>Our Story & Origins</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>

                <a
                  href="#charter"
                  className="border border-white/20 hover:border-white/40 text-slate-300 hover:text-white px-7 py-3.5 rounded-full text-xs font-medium transition-all"
                >
                  Foundational Charter
                </a>
              </div>
            </div>

            {/* Right Hero Organic Blob Visual Anchor */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Ambient Blob Glow */}
              <div
                className="absolute w-[92%] h-[92%] bg-gradient-to-tr from-blue-600/25 via-blue-400/10 to-indigo-500/15 blur-3xl pointer-events-none"
                style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%" }}
              />

              {/* Sculptural Organic Blob Frame */}
              <div
                className="relative w-full max-w-[480px] aspect-square overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/15 bg-slate-950 group transition-transform duration-700 hover:scale-[1.02]"
                style={{ borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%" }}
              >
                <Image
                  src="/images/service_edu_management.jpg"
                  alt="WMES Educational Leadership and Governance"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                  priority
                />
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. INSTITUTIONAL METRICS STRIP
      ═════════════════════════════════════════ */}
      <section className="border-b border-white/[0.08] bg-[#050C18]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-white/[0.08]">
            <div className="space-y-1">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">2021</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Founding Year Chartered</div>
            </div>
            <div className="space-y-1 md:pl-8 pt-4 md:pt-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">100%</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">United States Accredited</div>
            </div>
            <div className="space-y-1 md:pl-8 pt-4 md:pt-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">5,000+</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Scholars & Leaders Trained</div>
            </div>
            <div className="space-y-1 md:pl-8 pt-4 md:pt-0">
              <div className="font-display text-3xl sm:text-4xl font-black text-white">16</div>
              <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">Core Contract Practice Areas</div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          3. OUR STORY & ORIGINS (High Editorial Spread)
      ═════════════════════════════════════════ */}
      <section id="story" className="py-24 sm:py-36 relative border-b border-white/[0.08] bg-[#030812] overflow-hidden">
        {/* Soft atmospheric ambient glow */}
        <div className="absolute left-0 top-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Authoritative Editorial Narrative */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1.5px] bg-blue-500" />
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    Founding Genesis • 22 June 2021
                  </span>
                </div>

                <h2 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
                  The Genesis of <br className="hidden sm:inline" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-blue-300">
                    Institutional Stewardship
                  </span>
                </h2>
              </div>

              <div className="space-y-5 text-slate-300 font-light leading-relaxed">
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed font-normal">
                  World Mobile Educational System was established out of a pressing structural imperative: across emerging African markets, educational and commercial assets were failing not from lack of ambition, but from an acute deficit in institutional governance, operational transparency, and international quality benchmarking.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  From our National Headquarters at the Central Area in Abuja to our Eastern Regional executive complex in Centenary Estate, Enugu, WMES steps directly into schools, colleges, and training institutes. We install disciplined management, elevate teacher capabilities, and protect proprietor investments through rigorous, contract-managed fiduciary stewardship.
                </p>

                <p className="text-sm sm:text-base leading-relaxed">
                  Securing statutory international accreditation in the United States marked a watershed milestone—harmonizing African academic governance with Cambridge and international university standards, and opening verified global study-abroad pathways for thousands of scholars.
                </p>
              </div>

              {/* Editorial Chancellor Pull-Quote */}
              <div className="relative pl-6 sm:pl-8 py-2 border-l-2 border-blue-500 space-y-4">
                <blockquote className="text-white text-base sm:text-lg italic font-normal leading-relaxed">
                  &ldquo;Education is far more than the transmission of facts—it is the bedrock of ethical leadership, structural economic development, and generational sovereignty. We exist to ensure that every institution under our stewardship achieves lasting excellence.&rdquo;
                </blockquote>

                <div className="flex items-center gap-3 pt-1">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden border border-blue-400/40 shrink-0 bg-slate-900 shadow-md">
                    <Image
                      src="/images/chancellor.jpeg"
                      alt="Prof. John Ihuoma Nwokike"
                      fill
                      sizes="44px"
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white font-semibold block">
                      Prof. John Ihuoma Nwokike, Ph.D.
                    </span>
                    <span className="text-[11px] text-slate-400 font-light block">
                      Chancellor & Chairman of Governing Council
                    </span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Organic Blob Visual Anchor */}
            <div className="lg:col-span-5 relative flex items-center justify-center">
              {/* Ambient Blob Glow */}
              <div
                className="absolute w-[92%] h-[92%] bg-gradient-to-tr from-blue-600/25 via-blue-400/10 to-indigo-500/15 blur-3xl pointer-events-none"
                style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
              />

              {/* Sculptural Organic Blob Frame */}
              <div
                className="relative w-full max-w-[460px] aspect-square overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.6)] border border-white/15 bg-slate-950 group transition-transform duration-700 hover:scale-[1.02]"
                style={{ borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" }}
              >
                <Image
                  src="/images/service_edu_consultancy.jpg"
                  alt="WMES Institutional Governance and Advisory Administration"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ══════════════════════════════════════════
          4. FOUNDATIONAL CHARTER (Vision, Mission, Motto & Core Values)
      ═════════════════════════════════════════ */}
      <section id="charter" className="py-24 sm:py-36 relative border-b border-white/[0.08] bg-gradient-to-b from-[#030812] via-[#050C1A] to-[#030812]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">

          {/* Dual Pillars: Vision & Mission Spread */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16 sm:mb-24 items-stretch">
            
            {/* Vision & Official Motto Column (7 cols) */}
            <div className="lg:col-span-7 bg-[#060D1A] border border-white/[0.09] rounded-3xl p-8 sm:p-12 space-y-8 flex flex-col justify-between relative overflow-hidden shadow-2xl group hover:border-blue-500/30 transition-all duration-500">
              <div className="space-y-6 relative z-10">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <Eye className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold block">
                        Institutional Horizon
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                        Our Vision
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-widest hidden sm:inline-block">
                    Pillar 01
                  </span>
                </div>

                <p className="text-white text-lg sm:text-xl font-light leading-relaxed">
                  To become a globally recognized centre of excellence in education, research, innovation, leadership development, and professional consultancy—empowering individuals and institutions to create sustainable solutions and achieve generational impact through knowledge, integrity, and service.
                </p>

                <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                  We envision an African continent where educational institutions operate with uncompromised academic rigor, transparent financial health, and seamless university articulations across Europe, the Americas, and Asia.
                </p>
              </div>

              {/* Inscribed Official WMES Motto Seal */}
              <div className="relative z-10 pt-6 border-t border-white/[0.06] mt-4">
                <div className="p-5 sm:p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-blue-400 font-semibold block">
                      The Official WMES Motto
                    </span>
                    <p className="text-white text-base sm:text-lg font-serif italic font-medium">
                      &ldquo;Knowledge, Innovation and Global Excellence.&rdquo;
                    </p>
                  </div>
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400" />
                    <span className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                      Statutory Creed
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission & Operational Mandates Column (5 cols) */}
            <div className="lg:col-span-5 bg-[#060D1A] border border-white/[0.09] rounded-3xl p-8 sm:p-12 space-y-6 flex flex-col justify-between shadow-2xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
              <div className="space-y-6">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.06] pb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold block">
                        Actionable Commitment
                      </span>
                      <h3 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                        Our Mission
                      </h3>
                    </div>
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 font-bold uppercase tracking-widest hidden sm:inline-block">
                    Pillar 02
                  </span>
                </div>

                <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed">
                  World Mobile Educational System (WMES) is dedicated to delivering high-quality, accessible, and innovative education that meets international standards; developing visionary, ethical leaders; and providing professional consultancy services that ensure institutional turnaround and sustainable growth.
                </p>

                {/* 4 Execution Priorities */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block">
                    Core Operational Mandates
                  </span>
                  <div className="space-y-2.5">
                    {[
                      "Elevating academic standards across K-12, TVET, and tertiary hubs.",
                      "Conducting forensic audits that rescue underperforming schools.",
                      "Delivering executive development & leadership workshops.",
                      "Structuring bilateral treaties with overseas universities."
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.06] flex items-center justify-between text-xs text-slate-400">
                <span>16 Practice Divisions</span>
                <span className="text-emerald-400 font-medium">Pan-African Stewardship</span>
              </div>
            </div>

          </div>

          {/* ══════════════════════════════════════════
              THE SEVEN GOVERNING VALUES
          ═════════════════════════════════════════ */}
          <div className="space-y-12 pt-6">
            
            {/* Section Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-white/[0.08] pb-8">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    Statutory Ethical Code
                  </span>
                </div>
                <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-tight leading-none">
                  The Seven Governing Values
                </h3>
                <p className="text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                  Inviolable principles ratified by the Governing Council—legally and operationally binding across every campus, boardroom, and consultancy mandate under WMES stewardship.
                </p>
              </div>

              {/* Status / Council Seal Pill */}
              <div className="shrink-0 flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-xs font-mono text-slate-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span className="tracking-wide">Ratified Code • Enforced Globally</span>
              </div>
            </div>

            {/* TIER 1: The Two Sovereign Anchors (Excellence & Integrity) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              
              {/* 01. EXCELLENCE */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#07132B] via-[#050C1C] to-[#030814] border border-blue-500/25 p-8 sm:p-10 space-y-6 overflow-hidden shadow-2xl group hover:border-blue-400/50 transition-all duration-500 flex flex-col justify-between">
                {/* Background Watermark & Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[70px] pointer-events-none" />
                <span className="absolute top-4 right-8 font-display text-8xl sm:text-9xl font-black text-white/[0.03] select-none pointer-events-none tracking-tighter">
                  01
                </span>

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-blue-500/15 border border-blue-500/30 text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">
                        Value 01
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                        The Academic Benchmark
                      </span>
                    </div>
                    <Award className="w-5 h-5 text-blue-400" />
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                    Excellence
                  </h4>

                  <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed">
                    Unwavering commitment to the highest international standards in pedagogy, faculty qualification, governance, and turnkey institutional management.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-blue-200/90 font-serif italic">
                    &ldquo;We accept zero compromise on curriculum rigor, instructor credentials, or academic infrastructure.&rdquo;
                  </div>
                </div>

                <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs relative z-10">
                  <span className="text-slate-400">Quarterly Pedagogical Audits</span>
                  <span className="text-blue-400 font-medium font-mono text-[11px]">US & Cambridge Benchmarked</span>
                </div>
              </div>

              {/* 02. INTEGRITY */}
              <div className="relative rounded-3xl bg-gradient-to-br from-[#061922] via-[#050C1C] to-[#030814] border border-emerald-500/25 p-8 sm:p-10 space-y-6 overflow-hidden shadow-2xl group hover:border-emerald-400/50 transition-all duration-500 flex flex-col justify-between">
                {/* Background Watermark & Ambient Glow */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-600/10 rounded-full blur-[70px] pointer-events-none" />
                <span className="absolute top-4 right-8 font-display text-8xl sm:text-9xl font-black text-white/[0.03] select-none pointer-events-none tracking-tighter">
                  02
                </span>

                <div className="space-y-5 relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">
                        Value 02
                      </span>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                        The Fiduciary Anchor
                      </span>
                    </div>
                    <Scale className="w-5 h-5 text-emerald-400" />
                  </div>

                  <h4 className="font-display text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
                    Integrity
                  </h4>

                  <p className="text-slate-200 text-sm sm:text-base font-light leading-relaxed">
                    Absolute honesty, transparency, and ethical conduct in all academic certifications, campus acquisitions, tuition accounting, and commercial contracts.
                  </p>

                  <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/[0.06] text-xs text-emerald-200/90 font-serif italic">
                    &ldquo;Zero tolerance for credential inflation, exam malpractice, or financial opacity across all managed hubs.&rdquo;
                  </div>
                </div>

                <div className="pt-5 border-t border-white/[0.06] flex items-center justify-between text-xs relative z-10">
                  <span className="text-slate-400">Strict Fiduciary Liability</span>
                  <span className="text-emerald-400 font-medium font-mono text-[11px]">Independent Forensic Auditing</span>
                </div>
              </div>

            </div>

            {/* TIER 2: The 5 Operational Disciplines + The Statutory Covenant Seal (3x2 Grid) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              
              {/* 03. Innovation */}
              <div className="rounded-2xl bg-[#060D1A] border border-white/[0.08] p-7 space-y-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono font-bold text-blue-400">
                      VALUE 03
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Applied Systems</span>
                  </div>
                  <h4 className="font-display text-xl font-bold uppercase text-white tracking-tight">
                    Innovation
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    Embracing progressive curricula, modern technology, and adaptable problem-solving for an evolving world.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>AI-Augmented Instructional Hubs</span>
                </div>
              </div>

              {/* 04. Inclusiveness */}
              <div className="rounded-2xl bg-[#060D1A] border border-white/[0.08] p-7 space-y-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono font-bold text-blue-400">
                      VALUE 04
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Universal Access</span>
                  </div>
                  <h4 className="font-display text-xl font-bold uppercase text-white tracking-tight">
                    Inclusiveness
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    Ensuring equal educational opportunities, celebrating diversity, and empowering learners from all backgrounds.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Merit-Based Scholarships & Equity</span>
                </div>
              </div>

              {/* 05. Professionalism */}
              <div className="rounded-2xl bg-[#060D1A] border border-white/[0.08] p-7 space-y-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono font-bold text-blue-400">
                      VALUE 05
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Executive Rigor</span>
                  </div>
                  <h4 className="font-display text-xl font-bold uppercase text-white tracking-tight">
                    Professionalism
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    Delivering disciplined, client-centric service characterized by rigorous accountability and technical competence.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Verified Credentials & Bi-Annual CPD</span>
                </div>
              </div>

              {/* 06. Accountability */}
              <div className="rounded-2xl bg-[#060D1A] border border-white/[0.08] p-7 space-y-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono font-bold text-blue-400">
                      VALUE 06
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Stewardship</span>
                  </div>
                  <h4 className="font-display text-xl font-bold uppercase text-white tracking-tight">
                    Accountability
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    Taking full fiduciary and operational responsibility for every institution, facility, and program under our care.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Open-Book Reporting to Proprietors</span>
                </div>
              </div>

              {/* 07. Service */}
              <div className="rounded-2xl bg-[#060D1A] border border-white/[0.08] p-7 space-y-4 hover:border-blue-500/40 hover:-translate-y-1 transition-all duration-300 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-white/[0.04] text-[10px] font-mono font-bold text-blue-400">
                      VALUE 07
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase tracking-wider">Civic Mission</span>
                  </div>
                  <h4 className="font-display text-xl font-bold uppercase text-white tracking-tight">
                    Service
                  </h4>
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    Dedicated to the upliftment of individuals, institutions, and communities through education and human development.
                  </p>
                </div>
                <div className="pt-4 border-t border-white/[0.06] text-[11px] text-slate-400 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                  <span>Civic Impact & Youth Enterprise</span>
                </div>
              </div>

              {/* 08. The Sovereign Ethical Covenant & Council Seal */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0A1A32] via-[#061021] to-[#030814] border border-blue-500/35 p-7 space-y-5 shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />
                
                <div className="space-y-3 relative z-10">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-[10px] font-mono font-bold text-blue-300 tracking-wider">
                      STATUTORY SEAL
                    </span>
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  
                  <h4 className="font-display text-xl font-black uppercase text-white tracking-tight">
                    The Ethical Covenant
                  </h4>
                  
                  <p className="text-slate-300 text-xs sm:text-sm font-light leading-relaxed">
                    All 7 values are ratified by the Governing Council under the authority of Chancellor Prof. John Ihuoma Nwokike.
                  </p>
                </div>

                <div className="pt-4 border-t border-white/[0.08] relative z-10 flex items-center justify-between">
                  <Link
                    href="/leadership"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-white transition-colors group/link"
                  >
                    <span>Meet Governing Council</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                  <span className="text-[10px] font-mono text-emerald-400/90 font-medium">In Force 2026</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>


      {/* ══════════════════════════════════════════
          8. INSTITUTIONAL CALL TO ACTION
      ═════════════════════════════════════════ */}
      <section className="py-24 sm:py-32 bg-[#020710] relative">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 text-center space-y-6">
          <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold block">
            Cooperation & Institutional Partnerships
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-black uppercase text-white tracking-tight">
            Partner with World Mobile Educational System
          </h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-light leading-relaxed">
            Whether you are a school proprietor seeking turnaround management, a foreign university pursuing bilateral degrees, or a corporate entity desiring executive capacity development, WMES is your certified institutional partner.
          </p>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-semibold transition-all hover:shadow-[0_0_24px_rgba(59,130,246,0.45)]"
            >
              Request Institutional Consultation
            </Link>
            <Link
              href="/leadership"
              className="border border-white/20 hover:border-white/40 text-slate-300 hover:text-white px-8 py-3.5 rounded-full text-xs uppercase tracking-wider font-medium transition-all"
            >
              Meet Governing Council
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
