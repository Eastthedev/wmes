"use client";

import React from "react";
import Image from "next/image";
import ConsultationForm from "@/components/ConsultationForm";
import { 
  Home, 
  Map, 
  Building2, 
  ShieldCheck, 
  Compass, 
  TrendingUp, 
  Search, 
  Wrench, 
  Eye, 
  Megaphone, 
  FileText, 
  Handshake, 
  Sparkles, 
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
  MessageSquare,
  MapPin
} from "lucide-react";

const realEstateServices = [
  {
    title: "Property Sales and Purchase",
    desc: "Seamlessly buy or sell residential homes, commercial hubs, and high-yield properties with expert guidance.",
    icon: Home,
  },
  {
    title: "Land Acquisition and Verification",
    desc: "Acquire genuine, verified land free from disputes and government encumbrances with verified title checks.",
    icon: Map,
  },
  {
    title: "Residential and Commercial Property Leasing",
    desc: "Find the perfect office spaces, commercial complexes, or residential apartments with tailored lease contracts.",
    icon: Building2,
  },
  {
    title: "Property Management",
    desc: "Maximize occupancy and maintain property values through efficient collection, tenant screening, and reporting.",
    icon: ShieldCheck,
  },
  {
    title: "Estate Development and Consultancy",
    desc: "From conceptualization to execution, we develop modern master-planned estates with sustainable solutions.",
    icon: Compass,
  },
  {
    title: "Real Estate Investment Advisory",
    desc: "Build generational wealth with strategic property investments, portfolio diversification, and market analysis.",
    icon: TrendingUp,
  },
  {
    title: "Property Valuation and Inspection",
    desc: "Determine fair market values and structural integrity of assets before closing deals.",
    icon: Search,
  },
  {
    title: "Facility Management",
    desc: "Ensure seamless daily operations of corporate complexes, residential estates, and industrial facilities.",
    icon: Wrench,
  },
  {
    title: "Building Project Supervision",
    desc: "Ensure high quality construction standards, timelines, and material verification on your building sites.",
    icon: Eye,
  },
  {
    title: "Real Estate Marketing",
    desc: "Promote and showcase developer estates and private listings to verified, qualified buyers.",
    icon: Megaphone,
  },
  {
    title: "Property Documentation and Processing",
    desc: "Obtain clean titles, deeds, Certificates of Occupancy (C of O), and government approvals hassle-free.",
    icon: FileText,
  },
  {
    title: "Estate Agency Services",
    desc: "Trust our licensed agents to navigate local regulations and represent your interests transparently.",
    icon: Handshake,
  },
];

const whyChooseUs = [
  {
    title: "Professional and trustworthy service",
    desc: "Our operations adhere to international compliance, ethics, and standard property management regulations."
  },
  {
    title: "Transparent and ethical business practices",
    desc: "We verify every transaction detail, eliminating hidden fees and ensuring client transparency."
  },
  {
    title: "Genuine and verified properties",
    desc: "Every plot of land and property in our listing undergoes rigorous legal verification and due diligence."
  },
  {
    title: "Experienced management team",
    desc: "Our team consists of certified realtors, project managers, legal experts, and investment advisors."
  },
  {
    title: "Affordable and competitive service charges",
    desc: "We deliver maximum value and elite premium management services at highly cost-effective rates."
  },
  {
    title: "Prompt customer support",
    desc: "Our helpdesk operates round-the-clock to coordinate maintenance requests and property inquiries."
  },
  {
    title: "Strategic investment guidance",
    desc: "We don't just sell properties; we analyze demographic growth to secure high appreciation rates for clients."
  },
  {
    title: "Strong commitment to client satisfaction",
    desc: "Our focus is building long-term partnerships through consistent excellence, reliability, and value creation."
  }
];

export default function RealEstateClient() {
  const handleInquiry = (title: string) => {
    const selectEl = document.getElementById("sector") as HTMLSelectElement | null;
    if (selectEl) {
      // Check if option exists
      let hasOption = false;
      for (let i = 0; i < selectEl.options.length; i++) {
        if (selectEl.options[i].value === title) {
          hasOption = true;
          break;
        }
      }
      // If not, dynamically append it to integration select
      if (!hasOption) {
        const newOpt = document.createElement("option");
        newOpt.value = title;
        newOpt.text = title;
        selectEl.appendChild(newOpt);
      }
      selectEl.value = title;
      selectEl.dispatchEvent(new Event("change", { bubbles: true }));
    }

    // Pre-fill message text area
    const messageEl = document.getElementById("message") as HTMLTextAreaElement | null;
    if (messageEl) {
      messageEl.value = `Structuring an inquiry regarding our project scope for: ${title}.\n\n`;
      messageEl.focus();
    }

    // Scroll smoothly to form
    const formEl = document.getElementById("request-form");
    if (formEl) {
      formEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="font-body bg-[#020813] text-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-dot-grid-dark py-24 sm:py-32 relative overflow-hidden border-b border-white/5">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-primary/10 blur-[130px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column: Content */}
            <div className="space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit block font-bold">
                Real Estate Division
              </span>
              <h1 className="font-display text-4xl sm:text-6xl xl:text-7xl font-extrabold uppercase tracking-tight text-white leading-tight text-glow-gradient">
                WMES Real Estate & Property Management
              </h1>
              <p className="text-blue-sky font-mono text-[10px] sm:text-xs uppercase tracking-widest font-bold">
                Building Wealth Through Trusted Real Estate Solutions
              </p>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl font-light leading-relaxed">
                World Mobile Educational System (WMES) Real Estate & Property Management is committed to providing reliable, transparent, and professional real estate services for individuals, families, businesses, investors, and institutions.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm max-w-xl font-light leading-relaxed">
                Whether you are buying, selling, leasing, investing, or developing property, our experienced team is dedicated to helping you achieve your goals with confidence and peace of mind.
              </p>
              <div className="pt-2">
                <button
                  onClick={() => handleInquiry("General Real Estate Advisory")}
                  className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all inline-block hover:scale-[1.03] shadow-[0_0_15px_rgba(255,255,255,0.15)] cursor-pointer"
                >
                  Request Consultation
                </button>
              </div>
            </div>

            {/* Right Column: Generated Luxury Property Image */}
            <div className="relative w-full aspect-video md:aspect-[4/3] lg:aspect-[1.3] rounded-3xl overflow-hidden border border-white/10 bg-white/5 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.15)] transition-all duration-500 group">
              <Image
                src="/images/wmes_real_estate_hero.png"
                alt="WMES Premium Real Estate & Property Management"
                fill
                sizes="(max-w-7xl) 50vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020813]/60 via-transparent to-transparent opacity-60 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark relative z-10">
        
        {/* Title Callout */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={12} className="text-blue-sky animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold block">
              Offerings Portfolio
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-4 text-glow-gradient font-black">
            Our Services
          </h2>
          <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light leading-relaxed">
            World Mobile Educational System operates dynamic and legally verified service scopes across all real estate development, advisory, and agency verticals.
          </p>
        </div>

        {/* 12 Services Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {realEstateServices.map((service, index) => {
            const Icon = service.icon;
            
            return (
              <div 
                key={index}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.1)] transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="text-blue-sky">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white group-hover:text-blue-sky transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-white/5 mt-4">
                  <button 
                    onClick={() => handleInquiry(service.title)}
                    className="inline-flex items-center gap-1.5 text-[9px] font-mono uppercase tracking-widest font-bold text-blue-sky hover:text-white transition-colors cursor-pointer"
                  >
                    <span>Inquire Now</span>
                    <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Why Choose Us & Vision/Mission */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden bg-white/[0.01]">
        <div className="absolute inset-0 bg-dot-grid-dark opacity-40 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Left Column: Why Choose Us */}
            <div className="lg:col-span-7 space-y-8">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold block mb-2">
                  System Advantages
                </span>
                <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-glow-gradient font-black">
                  Why Choose WMES Real Estate?
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {whyChooseUs.map((item, idx) => (
                  <div key={idx} className="flex gap-3 items-start">
                    <CheckCircle2 size={16} className="text-blue-sky shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h4 className="font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-white">
                        {item.title}
                      </h4>
                      <p className="text-slate-400 text-[11px] leading-relaxed font-light">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Mission, Vision & Subtitle */}
            <div className="lg:col-span-5 flex flex-col justify-center space-y-8">
              {/* Vision Card */}
              <div className="bg-[#030a12] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-xl hover:border-blue-sky/30 transition-all">
                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-primary/10 rounded-full blur-2xl pointer-events-none" />
                <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky font-bold block mb-1">
                  Strategic Outlook
                </span>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-3">
                  Our Vision
                </h3>
                <p className="text-slate-450 text-xs sm:text-sm font-light leading-relaxed">
                  To become one of Africa&apos;s leading real estate and property management organisations, delivering innovative, profitable, and sustainable property solutions.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-[#030a12] border border-white/10 rounded-3xl p-8 relative overflow-hidden shadow-xl hover:border-blue-sky/30 transition-all">
                <div className="absolute right-0 top-0 w-24 h-24 bg-blue-primary/10 rounded-full blur-2xl pointer-events-none" />
                <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky font-bold block mb-1">
                  Core Mandate
                </span>
                <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white mb-3">
                  Our Mission
                </h3>
                <p className="text-slate-450 text-xs sm:text-sm font-light leading-relaxed">
                  To provide exceptional real estate services through integrity, professionalism, innovation, and customer-focused solutions while creating lasting value for our clients and partners.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Partner With Us */}
      <section className="py-24 border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-50 pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 sm:px-8 space-y-6 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit mx-auto block font-bold">
            Cooperation Registry
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
            Partner With Us
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
            WMES welcomes property owners, estate developers, investors, corporate organisations, financial institutions, government agencies, and individuals to partner with us in creating profitable and sustainable real estate opportunities.
          </p>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mx-auto font-light leading-relaxed">
            Whether you are looking to buy your dream home, sell your property, invest in land, manage an estate, or develop a real estate project, WMES is your trusted partner.
          </p>
          <div className="pt-2">
            <button 
              onClick={() => handleInquiry("Strategic Partnership")}
              className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all inline-block hover:scale-[1.03] cursor-pointer"
            >
              Contact Partnership Desk
            </button>
          </div>
        </div>
      </section>

      {/* Contact & Real Estate Info Cards */}
      <section className="py-24 border-t border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Contact Information Panel */}
            <div className="lg:col-span-5 space-y-6">
              <div>
                <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold block mb-2">
                  Registry desk
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white">
                  Contact Us
                </h3>
                <p className="text-slate-400 text-xs sm:text-sm mt-2 font-light">
                  World Mobile Educational System (WMES) – Real Estate & Property Management
                </p>
              </div>

              {/* Location Card */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex gap-4 items-start">
                <MapPin size={18} className="text-blue-sky shrink-0 mt-1" />
                <div className="space-y-1">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Office Address</span>
                  <p className="text-white text-xs leading-relaxed font-light">
                    Chika&apos;s Plaza, Centenary Estate, Enugu, Nigeria.
                  </p>
                </div>
              </div>

              {/* Phone Cards */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex gap-4 items-start">
                <Phone size={18} className="text-blue-sky shrink-0 mt-1" />
                <div className="space-y-2 w-full">
                  <div>
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Call Desk</span>
                    <a href="tel:08030896650" className="text-white text-xs leading-relaxed font-mono hover:text-blue-sky transition-colors">
                      08030896650
                    </a>
                  </div>
                  <div className="pt-2 border-t border-white/5">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">WhatsApp Portal</span>
                    <a href="https://wa.me/2349048888400" target="_blank" rel="noopener noreferrer" className="text-white text-xs leading-relaxed font-mono hover:text-blue-sky transition-colors flex items-center gap-1.5">
                      <MessageSquare size={12} className="text-blue-sky" />
                      <span>09048888400</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Email Card */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-5 flex gap-4 items-start">
                <Mail size={18} className="text-blue-sky shrink-0 mt-1" />
                <div className="space-y-1">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">Email Inquiries</span>
                  <a href="mailto:worldmobileedusystem@gmail.com" className="text-white text-xs leading-relaxed font-mono hover:text-blue-sky transition-colors block">
                    worldmobileedusystem@gmail.com
                  </a>
                </div>
              </div>

              {/* Corporate Core Values */}
              <div className="p-6 bg-[#030a12] border border-white/10 rounded-2xl text-center space-y-3">
                <p className="font-display text-sm font-black tracking-widest text-white uppercase">
                  Buy • Sell • Lease • Manage • Invest
                </p>
                <p className="font-mono text-[9px] text-blue-sky uppercase tracking-widest font-bold">
                  Your Trusted Partner in Property, Investment, and Wealth Creation.
                </p>
              </div>

            </div>

            {/* Consultation Request Form Panel */}
            <div className="lg:col-span-7">
              <div className="bg-white/[0.01] rounded-3xl p-1">
                <ConsultationForm />
              </div>
            </div>

          </div>

        </div>
      </section>
    </div>
  );
}
