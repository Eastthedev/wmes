"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Award, Landmark, ShieldCheck, Users, Activity, Star, Quote, Building2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "Our secondary school was facing declining enrollment and serious administrative leakages. WMES stepped in with a contract turnaround strategy, overhauled our curriculum, and retrained the entire staff. Within 18 months, our student density grew by 40% and our operational costs stabilized.",
    author: "Chief Benson A. Nwosu",
    role: "School Proprietor",
    org: "St. Jude's Academic Complex, Enugu",
    category: "Corporate & Proprietors"
  },
  {
    quote: "Securing student admission and visa pathways to study in Canada seemed extremely complicated. The registrar division at WMES mapped my credentials, verified my documents, and guided me through my visa portfolio. Today, I am pursuing my degree in Ontario without any registry issues.",
    author: "Amarachi Grace Ugwu",
    role: "B.Sc. candidate",
    org: "Bridgeport Institute of Technology (Alumna)",
    category: "Students & Parents"
  },
  {
    quote: "Managing a petrol station and gas plant network from Lagos was an operational nightmare. Delegating operations control to WMES under their site management contract has resolved all staff friction, inventory leakage, and safety compliance checks. The accounting audit reports are transparent and on schedule.",
    author: "Engr. Femi Adebayo",
    role: "Managing Director",
    org: "Blue Sky Energy Outlets",
    category: "Corporate & Proprietors"
  },
  {
    quote: "Implementing the WMES Academic Playbook has dramatically simplified our teaching workflow. The curriculum guidelines are clear, lesson planners are standardized, and compliance audits ensure that we maintain high teaching benchmarks without administrative confusion.",
    author: "Mr. Emmanuel I. Edeh",
    role: "Senior Science Instructor",
    org: "Royal K-12 Academy (WMES Managed)",
    category: "Staff & Educators"
  },
  {
    quote: "We send our employees to the WMES Corporate Training workshops annually. Their vocational skills training and customer service modules have significantly boosted hospitality performance and customer satisfaction indexes inside our hotels.",
    author: "Mrs. Victoria Alao",
    role: "General Manager",
    org: "Summit Hotels Franchise",
    category: "Corporate & Proprietors"
  },
  {
    quote: "As a parent, I wanted a school that values academic discipline and standard curriculum paths. Sending my children to a school managed by WMES has given me absolute peace of mind. The performance tracking booklets keep parents fully updated.",
    author: "Dr. (Mrs.) Ngozi Ekwueme",
    role: "Parent",
    org: "Enugu, Nigeria",
    category: "Students & Parents"
  }
];

export default function Home() {

  return (
    <div className="font-body overflow-hidden bg-[#020813] text-white">
      
      {/* 1. Hero Section - Dark Tech Canvas */}
      <section className="bg-dot-grid-dark pt-28 pb-44 relative min-h-[90vh] flex items-center overflow-hidden">
        {/* Ambient Background Video */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <video
            src="/images/hero.mp4"
            className="w-full h-full object-cover opacity-45"
            autoPlay
            muted
            loop
            playsInline
          />
          {/* Subtle blend overlays: fade left side to ensure text remains highly readable */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#020813] via-[#020813]/70 to-transparent" />
          {/* Subtle fade top and bottom to blend with background section borders */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-transparent to-[#020813]" />
        </div>

        {/* Pulsing Radial Glow backdrop */}
        <div className="absolute left-1/4 top-1/4 w-[500px] h-[500px] rounded-full bg-blue-primary/15 blur-[130px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Heading & CTAs */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-9 xl:col-span-8 space-y-8 text-center sm:text-left"
            >
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 border border-white/10 px-3.5 py-2 rounded-full font-bold">
                  Accredited in the United States
                </span>
              </div>

              <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-black uppercase tracking-tighter text-glow-gradient leading-[0.85]">
                EDUCATIONAL CONsULTANCY,<br />MANAGEMENT AND DEVELOPMENT sERVICEs
              </h1>

              <p className="text-slate-400 text-sm sm:text-base leading-relaxed font-light max-w-xl mx-auto sm:mx-0">
                World Mobile Educational system is a global educational arm management Industry whose objectives are to revolutionalise the educational cum Industrial sector.
              </p>

              <div className="flex flex-wrap justify-center sm:justify-start gap-4 pt-2">
                <Link 
                  href="#two-doors" 
                  className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:scale-[1.03] shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  Welcome Address
                </Link>
                <Link 
                  href="/about" 
                  className="bg-transparent hover:bg-white/5 text-white border border-white/10 px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:scale-[1.03]"
                >
                  About Group
                </Link>
              </div>
            </motion.div>

          </div>
        </div>

        {/* Layered Overlapping Ribbon (Signature Accent) */}
        <div 
          className="absolute left-0 right-0 bottom-0 h-16 bg-blue-sky/10 clip-ribbon-stripe z-0" 
          aria-hidden="true"
        />
        <div 
          className="absolute left-0 right-0 bottom-0 h-16 bg-[#020813] clip-ribbon-base z-1" 
          aria-hidden="true"
        />
      </section>

      {/* 2. Chancellor Welcome Section */}
      <section id="two-doors" className="py-24 sm:py-32 bg-[#020813] relative z-10 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Chancellor Image Card */}
            <div className="lg:col-span-5 w-full flex justify-center">
              <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col text-center relative hover:border-blue-sky/40 transition-colors shadow-2xl overflow-hidden group w-full max-w-sm">
                <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5">
                  <Image
                    src="/images/chancellor.jpeg"
                    alt="Professor John Ihuoma Nwaokike"
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-w-7xl) 33vw"
                    priority
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                    Professor John Ihuoma Nwaokike
                  </h3>
                  <p className="text-blue-sky text-xs font-mono uppercase tracking-widest font-bold">
                    Chancellor, WMES
                  </p>
                  <p className="text-slate-400 text-xs leading-relaxed font-light pt-2">
                    Professor John Ihuoma Nwokike is an educationist, a theologian, psychologist and a political scientist.
                  </p>
                </div>
              </div>
            </div>

            {/* Chancellor Address Content */}
            <div className="lg:col-span-7 space-y-6 text-slate-300">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
                Chancellor's Address
              </span>
              <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white text-glow-gradient leading-tight">
                Welcome to World Mobile Educational System (WMES).
              </h2>
              <p className="leading-relaxed text-sm sm:text-base font-light">
                On behalf of our entire team, I warmly welcome you to a global platform dedicated to transforming education, professional development, innovation, and sustainable growth. At World Mobile Educational System, we are committed to building international partnerships, developing world-class institutions, empowering individuals with quality education and skills, and promoting excellence in management and consultancy.
              </p>
              <p className="leading-relaxed text-sm sm:text-base font-light">
                We invite students, institutions, governments, businesses, and development partners from around the world to join us as we work together to create opportunities, inspire innovation, and build a brighter future for generations to come.
              </p>
              <p className="leading-relaxed text-sm sm:text-base font-light font-semibold">
                Thank you for believing in our vision.
              </p>
              <div className="pt-4 border-t border-white/5">
                <p className="font-bold text-white text-sm sm:text-base">Prof. John Ihuoma Nwaokike</p>
                <p className="text-blue-sky text-xs font-mono uppercase tracking-widest mt-0.5 font-bold">Chancellor, WMES</p>
                <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-0.5">World Mobile Educational System (WMES)</p>
              </div>
              <div className="pt-4 flex flex-wrap gap-4">
                <Link 
                  href="/leadership" 
                  className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:scale-[1.03] shadow-md"
                >
                  Meet Leadership Board &rarr;
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. Specs Statistics Dashboard */}
      <section className="bg-[#020813] bg-dot-grid-dark text-white py-20 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { val: "5+", label: "YEARS OPERATIONS", sub: "Established in 2021" },
              { val: "20+", label: "SECTORS MANAGED", sub: "Commercial divisions" },
              { val: "5,000+", label: "GRADUATED CANDIDATES", sub: "Vocational & K-12 paths" },
              { val: "100%", label: "COMPLIANCE INTEGRITY", sub: "Rigid cost auditing" },
            ].map((stat, i) => (
              <div key={i} className="glass-card-dark rounded-2xl p-6 space-y-2 border border-white/5 hover:border-blue-sky/35 transition-colors">
                <div className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-white leading-none">
                  {stat.val}
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[8px] tracking-widest text-blue-sky uppercase font-bold block">{stat.label}</span>
                  <span className="text-[10px] text-slate-500 font-light block">{stat.sub}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Strategic Value Section */}
      <section className="py-24 sm:py-32 bg-[#020813] bg-dot-grid-dark relative">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            {/* Left: Heading */}
            <div className="lg:w-1/2 space-y-6">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
                Our Core Principles
              </span>
              <h2 className="font-display text-4xl sm:text-5xl font-extrabold uppercase tracking-tight text-white text-glow-gradient leading-none">
                Institutional Excellence.
              </h2>
              <p className="text-slate-400 text-xs sm:text-sm lg:text-base leading-relaxed font-light">
                World Mobile Educational System (WMES) is an international education and management consultancy dedicated to advancing education, professional training, institutional development, and business excellence. We partner with schools, universities, governments, and organizations to provide educational consultancy, international academic collaborations, institutional management, staff development, hospitality management, research, and capacity-building services that promote innovation, quality, and sustainable development worldwide.
              </p>
              <div className="pt-2">
                <Link 
                  href="/about" 
                  className="bg-white hover:bg-slate-150 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all inline-block hover:scale-[1.03] shadow-md"
                >
                  Our Core Pillars
                </Link>
              </div>
            </div>
            
            {/* Right: Grid of Pillars */}
            <div className="lg:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              {[
                {
                  icon: GraduationCap,
                  title: "Educational Management Contracts",
                  desc: "Managing schools, colleges, vocational centres, and training institutions.",
                },
                {
                  icon: Building2,
                  title: "Hotel Management Contracts",
                  desc: "Managing hotels, resorts, guest houses, and hospitality businesses.",
                },
                {
                  icon: Award,
                  title: "Educational Consultancy Contracts",
                  desc: "Providing advisory services to schools, universities, governments, and organizations.",
                },
                {
                  icon: ShieldCheck,
                  title: "International Partnership Contracts",
                  desc: "Facilitating collaborations between Nigerian and foreign educational institutions.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white/[0.02] border border-white/5 p-8 rounded-2xl space-y-4 hover:border-blue-sky/40 hover:shadow-sm transition-all duration-300">
                  <div className="text-blue-sky">
                    <item.icon size={22} />
                  </div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-tight text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-405 text-xs leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>



      {/* 6. Closing Action Callout */}
      <section className="bg-dot-grid-dark text-white py-24 sm:py-32 relative">
        <div 
          className="absolute left-0 right-0 top-0 h-10 bg-[#020813] clip-ribbon-base" 
          aria-hidden="true"
        />

        <div className="max-w-4xl mx-auto text-center px-6 sm:px-8 mt-6 space-y-6">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-semibold">
            Global Placements & Agreements
          </span>
          <h2 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-glow-gradient leading-none">
            COORDINATING GLOBAL PATHWAYS.
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Whether you want a contract operator to stabilize school operations or are seeking a visa and placement pathway to study abroad, WMES coordinates the process.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link 
              href="/services#request-form" 
              className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)]"
            >
              Request Consultation
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent hover:bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-colors"
            >
              Contact Desk
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Reviews Slider Section */}
      <section className="bg-[#020813] py-24 border-t border-white/5 relative overflow-hidden">
        {/* Radial Glow Backdrop */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[500px] h-[250px] rounded-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 mb-12 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full font-bold">
            Testimonials
          </span>
          <h2 className="font-display text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-white mt-4 text-glow-gradient">
            Client & Partner Feedback
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-2 font-light">
            Discover how our contract management operations and registry services drive performance, compliance, and placement success.
          </p>
        </div>

        {/* Sliding Carousel */}
        <div className="relative w-full overflow-hidden mask-marquee py-4 z-10">
          <div className="animate-marquee flex gap-5">
            {[...testimonials, ...testimonials].map((t, idx) => (
              <div 
                key={idx}
                className="w-[280px] sm:w-[340px] shrink-0 bg-white/[0.02] border border-white/10 rounded-2xl p-5 hover:border-blue-sky/40 hover:bg-white/[0.03] transition-all duration-300 relative group flex flex-col justify-between"
              >
                <Quote className="absolute top-5 right-6 text-blue-sky/5 pointer-events-none" size={32} />
                
                <div className="space-y-3">
                  {/* Stars and category tag */}
                  <div className="flex items-center justify-between">
                    <div className="flex text-blue-sky">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={9} fill="currentColor" />
                      ))}
                    </div>
                    <span className="flex items-center gap-1 bg-white/5 text-blue-sky font-mono text-[7px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border border-blue-sky/15">
                      {t.category.includes("Corporate") && <Building2 size={7} />}
                      {t.category.includes("Students") && <GraduationCap size={7} />}
                      {t.category.includes("Staff") && <Users size={7} />}
                      <span>{t.category}</span>
                    </span>
                  </div>

                  {/* Quote text */}
                  <p className="text-slate-300 text-[11px] sm:text-xs leading-relaxed italic font-light">
                    &quot;{t.quote}&quot;
                  </p>
                </div>

                {/* Author Info */}
                <div className="mt-4 pt-3 border-t border-white/5">
                  <h4 className="font-display font-bold text-white uppercase text-[11px] sm:text-xs leading-none">
                    {t.author}
                  </h4>
                  <p className="text-slate-400 text-[9px] sm:text-[10px] mt-1 font-light">
                    {t.role} — <span className="font-semibold text-slate-300">{t.org}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}

