import React from "react";
import { Landmark, GraduationCap, Building2, ShieldCheck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Strategic Affiliations & Global Partnerships | WMES",
  description: "Review the regulatory ministries, international universities, and corporate bodies in strategic affiliation with WMES.",
};

const partnerCategories = [
  {
    type: "INTERNATIONAL UNIVERSITIES",
    description: "Bilateral admissions placement partnerships securing pathways for post-graduate and degree transfer candidates.",
    partners: [
      { name: "Apex Global University, UK", location: "Manchester, United Kingdom" },
      { name: "Bridgeport Institute of Tech", location: "Ontario, Canada" },
      { name: "West Coast Scientific University", location: "California, USA" },
      { name: "Euro-Asia Management College", location: "Berlin, Germany" }
    ]
  },
  {
    type: "LOCAL REGULATORY & ADVOCATION",
    description: "Affiliated boards, standard councils, and state certification directories.",
    partners: [
      { name: "Enugu State Ministry of Education", location: "Enugu, Nigeria (Accreditation)" },
      { name: "National Board for Technical Education", location: "Kaduna, Nigeria (Vocational Support)" },
      { name: "West African Examinations Council", location: "Regional Syllabus Alignment" },
      { name: "Nigerian Association of Private Educators", location: "Corporate Membership" }
    ]
  },
  {
    type: "CORPORATE & HOSPITALITY ALLIANCES",
    description: "Contract management clients and HR recruitment pipelines.",
    partners: [
      { name: "Summit Hotels & Suites Group", location: "Nigeria Franchise Operations" },
      { name: "Blue Sky Petroleum Marketing Co.", location: "Energy Retail Site Audits" },
      { name: "Enugu Recreational Facilities Board", location: "Leisure Property Contracts" },
      { name: "Vanguard Corporate Placement Agency", location: "Overseas Graduate Placement" }
    ]
  }
];

export default function Partnerships() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Global Partnerships & Networks
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-3xl leading-none text-glow-gradient">
            Strategic Affiliations
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            We collaborate with domestic ministries, overseas university registrar boards, and corporate business owners to verify admissions and streamline contract management.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Main Partners Listing */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 space-y-20 bg-dot-grid-dark">
        
        {partnerCategories.map((category, catIdx) => (
          <div key={catIdx} className="space-y-8">
            
            {/* Category Header */}
            <div className="border-b border-white/5 pb-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold block">
                {category.type}
              </span>
              <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-1 font-light leading-relaxed">
                {category.description}
              </p>
            </div>

            {/* Grid of Partners */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {category.partners.map((partner, pIdx) => (
                <div 
                  key={pIdx}
                  className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-blue-sky/40 hover:shadow-md transition-all duration-300 group"
                >
                  <div className="space-y-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-blue-sky group-hover:bg-blue-sky group-hover:text-white transition-all shadow-sm">
                      {category.type.includes("UNIVERSITIES") && <GraduationCap size={16} />}
                      {category.type.includes("REGULATORY") && <Landmark size={16} />}
                      {category.type.includes("CORPORATE") && <Building2 size={16} />}
                    </div>
                    <h4 className="font-display font-bold text-white uppercase text-base leading-tight">
                      {partner.name}
                    </h4>
                  </div>
                  <div className="mt-6 pt-3 border-t border-white/5 font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">
                    <span>{partner.location}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ))}

      </section>

      {/* Partnership Proposal CTA */}
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

    </div>
  );
}
