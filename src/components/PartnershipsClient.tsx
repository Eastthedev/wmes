"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ShieldCheck, Handshake, Landmark, X } from "lucide-react";

interface Partner {
  name: string;
  location: string;
  initials: string;
  image: string;
}

const partnersList: Partner[] = [
  {
    name: "Elior Evangelical University",
    location: "Certificate of Partnership",
    initials: "EEU",
    image: "/images/aff0.jpeg"
  },
  {
    name: "International Christian Vision Ministerial University & Clergy Council-USA",
    location: "Certificate of Membership",
    initials: "ICV",
    image: "/images/aff1.jpeg"
  },
  {
    name: "International Christian Vision Ministerial University & Clergy Council (ICVMUCC)",
    location: "Certificate of Accreditation",
    initials: "ICV",
    image: "/images/aff2.jpeg"
  },
  {
    name: "Jesus Christ of Nazareth Church Interlearning Center of Excellence / JILCE International University Seminary",
    location: "Affiliation & Membership Certificate",
    initials: "JIL",
    image: "/images/aff3.jpeg"
  },
  {
    name: "United Christian Bible University",
    location: "Certificate of Affiliation",
    initials: "UCB",
    image: "/images/aff4.jpeg"
  },
  {
    name: "Christian University College, Liberia",
    location: "Certificate of Affiliation/Partnership",
    initials: "CUL",
    image: "/images/aff5.jpeg"
  },
  {
    name: "Northwest International University",
    location: "Certificate of Partnership",
    initials: "NIU",
    image: "/images/aff6.jpeg"
  },
  {
    name: "Fidam Technical Institute Lagos",
    location: "Certificate of Affiliation",
    initials: "FTI",
    image: "/images/aff7.jpeg"
  },
  {
    name: "Fidam Technical Institute / Fidam Group of Schools",
    location: "Certificate of Affiliation/Partnership",
    initials: "FTI",
    image: "/images/aff8.jpeg"
  },
  {
    name: "Care Educational Missions Foundation",
    location: "Certificate of Affiliation & Partnership",
    initials: "CEM",
    image: "/images/aff9.jpeg"
  },
  {
    name: "JILCE International University Seminary — Archbishop Prof. Boison Boateng Nuaman",
    location: "Certificate of Affiliation",
    initials: "JIL",
    image: "/images/aff10.jpeg"
  },
  {
    name: "London Academy of Technology and Management (LATM), UK — partnered with JILCE International University and Seminary, Accra, Ghana",
    location: "Certificate of Partnership",
    initials: "LAT",
    image: "/images/aff11.jpeg"
  }
];

export default function PartnershipsClient() {
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const handleImageError = (imagePath: string) => {
    setFailedImages((prev) => ({
      ...prev,
      [imagePath]: true
    }));
  };

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPartner(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="font-body bg-[#020813] text-white min-h-screen">
      {/* Hero Header */}
      <section className="bg-dot-grid-dark py-32 relative overflow-hidden border-b border-white/5">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-primary/10 blur-[130px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit mx-auto block font-bold">
            Network Registry
          </span>
          <h1 className="font-display text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-white leading-none text-glow-gradient">
            Strategic Affiliations
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Bilateral networks, state ministries, academic registrar bodies, and corporate organizations in cooperation with World Mobile Educational System.
          </p>
        </div>
      </section>

      {/* Unified Grid Listings */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark relative z-10">
        
        {/* Title Callout */}
        <div className="text-center max-w-2xl mx-auto mb-20 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Handshake size={14} className="text-blue-sky animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold block">
              COOPERATIVE DIRECTORIES
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-glow-gradient font-black">
            Affiliated Parties
          </h2>
          <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light">
            Review our active academic, corporate, and governmental board networks. Click on any card below to pop up the image and view profile registries.
          </p>
        </div>

        {/* 12 Classy Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {partnersList.map((partner, index) => {
            const hasFailed = failedImages[partner.image] || false;
            
            return (
              <div 
                key={index}
                onClick={() => setSelectedPartner(partner)}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-5 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.1)] transition-all duration-300 flex flex-col group justify-between cursor-pointer hover:bg-white/[0.04]"
              >
                <div>
                  {/* Image / Graphic Container */}
                  <div className="w-full h-40 rounded-2xl overflow-hidden mb-4 border border-white/5 bg-white/5 relative flex items-center justify-center">
                    {!hasFailed ? (
                      <Image
                        src={partner.image}
                        alt={partner.name}
                        fill
                        className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        sizes="(max-w-7xl) 25vw"
                        onError={() => handleImageError(partner.image)}
                      />
                    ) : (
                      /* Abstract Fallback Gradient with Initials */
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/20 to-blue-sky/5 flex flex-col items-center justify-center p-4">
                        <Landmark size={20} className="text-blue-sky/40 mb-2" />
                        <span className="font-display text-2xl font-black text-white/50 tracking-wider font-mono">
                          {partner.initials}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Partner Name */}
                  <h3 className="font-display text-sm font-bold uppercase tracking-wider text-white group-hover:text-blue-sky transition-colors leading-tight mb-2">
                    {partner.name}
                  </h3>
                </div>

                <div className="pt-3 border-t border-white/5 mt-4 flex items-center justify-between text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  <span>{partner.location}</span>
                </div>
              </div>
            );
          })}
        </div>

      </section>

      {/* Proposal Request CTA */}
      <section className="py-24 bg-white/[0.01] border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-50 pointer-events-none" />
        
        <div className="max-w-3xl mx-auto px-6 sm:px-8 space-y-6 relative z-10">
          <span className="text-blue-sky animate-pulse block">
            <ShieldCheck size={32} className="mx-auto" />
          </span>
          <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
            Become an Affiliated Partner
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            We are actively reviewing partnership requests from K-12 school proprietors, foreign admissions registrars, and corporate hiring boards.
          </p>
          <div className="pt-2">
            <Link 
              href="/contact" 
              className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all inline-block hover:scale-[1.03]"
            >
              Contact Affiliation Board
            </Link>
          </div>
        </div>
      </section>

      {/* Modal Popup Overlay */}
      {selectedPartner && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-default animate-fade-in"
          onClick={() => setSelectedPartner(null)}
        >
          {/* Modal Container */}
          <div 
            className="bg-[#030a12] border border-white/10 rounded-3xl max-w-xl w-full overflow-hidden shadow-2xl relative animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPartner(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X size={16} />
            </button>

            {/* High-Res Photo Container */}
            <div className="w-full aspect-[4/3] relative bg-white/5 border-b border-white/10 flex items-center justify-center">
              {!(failedImages[selectedPartner.image] || false) ? (
                <Image
                  src={selectedPartner.image}
                  alt={selectedPartner.name}
                  fill
                  className="object-contain p-2"
                  sizes="(max-w-7xl) 50vw"
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-blue-primary/20 to-blue-sky/5 flex flex-col items-center justify-center p-4">
                  <Landmark size={40} className="text-blue-sky/40 mb-3" />
                  <span className="font-display text-4xl font-black text-white/50 tracking-wider font-mono">
                    {selectedPartner.initials}
                  </span>
                </div>
              )}
            </div>

            {/* Details Panel */}
            <div className="p-6 sm:p-8 space-y-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky font-bold block">
                Affiliated Party
              </span>
              <h3 className="font-display text-xl font-bold uppercase tracking-wider text-white">
                {selectedPartner.name}
              </h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed pt-2 border-t border-white/5 flex justify-between items-center">
                <span>Location / Registry:</span>
                <span className="font-semibold text-slate-350 font-mono text-[10px]">{selectedPartner.location}</span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
