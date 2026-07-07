"use client";

import React from "react";
import ConsultationForm from "@/components/ConsultationForm";
import { 
  GraduationCap,
  Building2,
  Briefcase,
  Globe,
  Award,
  Landmark,
  Activity,
  Bookmark,
  BookOpen,
  ShieldCheck,
  Users,
  Compass,
  TrendingUp,
  Calendar,
  FileText,
  ArrowRight, 
  Sparkles 
} from "lucide-react";

const offeringsPortfolio = [
  {
    title: "Educational Management Contracts",
    desc: "Managing schools, colleges, vocational centres, and training institutions.",
    icon: GraduationCap,
  },
  {
    title: "Hotel Management Contracts",
    desc: "Managing hotels, resorts, guest houses, and hospitality businesses.",
    icon: Building2,
  },
  {
    title: "Educational Consultancy Contracts",
    desc: "Providing advisory services to schools, universities, governments, and organizations.",
    icon: Briefcase,
  },
  {
    title: "International Partnership Contracts",
    desc: "Facilitating collaborations between Nigerian and foreign educational institutions.",
    icon: Globe,
  },
  {
    title: "Training and Capacity Building Contracts",
    desc: "Organizing professional development, seminars, workshops, and certification programmes.",
    icon: Award,
  },
  {
    title: "Institutional Development Contracts",
    desc: "Establishing, restructuring, or improving educational institutions.",
    icon: Landmark,
  },
  {
    title: "School Turnaround Contracts",
    desc: "Reviving underperforming or financially distressed schools.",
    icon: Activity,
  },
  {
    title: "Research and Project Management Contracts",
    desc: "Conducting educational, business, and development research and managing projects.",
    icon: Bookmark,
  },
  {
    title: "Curriculum Development Contracts",
    desc: "Designing and reviewing academic and vocational curricula.",
    icon: BookOpen,
  },
  {
    title: "Quality Assurance and Accreditation Consultancy Contracts",
    desc: "Assisting institutions in meeting quality standards and accreditation requirements.",
    icon: ShieldCheck,
  },
  {
    title: "Overseas Education and Student Recruitment Contracts",
    desc: "Recruiting students for international institutions and managing admissions.",
    icon: Users,
  },
  {
    title: "Hospitality and Tourism Consultancy Contracts",
    desc: "Providing consultancy services to hotels, restaurants, and tourism businesses.",
    icon: Compass,
  },
  {
    title: "Business Development and Management Consultancy Contracts",
    desc: "Helping organizations improve operations, profitability, and strategic growth.",
    icon: TrendingUp,
  },
  {
    title: "Conference and Event Management Contracts",
    desc: "Planning and managing educational and professional conferences, seminars, and exhibitions.",
    icon: Calendar,
  },
  {
    title: "Government and NGO Development Contracts",
    desc: "Implementing education, skills development, and institutional strengthening projects for governments and non-governmental organizations.",
    icon: FileText,
  },
];

export default function ServicesPage() {
  const handleInquiry = (title: string) => {
    const selectEl = document.getElementById("sector") as HTMLSelectElement | null;
    if (selectEl) {
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
      <section className="bg-dot-grid-dark py-32 relative overflow-hidden border-b border-white/5">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-blue-primary/10 blur-[130px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10 text-center space-y-4">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-4 py-2 rounded-full border border-white/10 w-fit mx-auto block font-bold">
            Portal Directory
          </span>
          <h1 className="font-display text-4xl sm:text-7xl font-extrabold uppercase tracking-tight text-white leading-none text-glow-gradient">
            Services & Registry
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            A comprehensive, high-fidelity corporate catalog of contract management divisions, training pathways, and placement scopes operated by WMES.
          </p>
        </div>
      </section>

      {/* Corporate Services Catalog */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark relative z-10" id="consultancy">
        
        {/* Title Callout */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Sparkles size={12} className="text-blue-sky animate-pulse" />
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold block">
              Offerings Portfolio
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-4 text-glow-gradient font-black">
            Our Service Contracts
          </h2>
          <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light leading-relaxed">
            World Mobile Educational System operates comprehensive contract-managed frameworks across educational, hospitality, and corporate advisory sectors.
          </p>
        </div>

        {/* 15 Classic Cards Grid (Identical to About Page) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {offeringsPortfolio.map((service, index) => {
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

        {/* Consultation Request Form */}
        <div className="pt-28 border-t border-white/5 mt-28">
          <div className="max-w-3xl mx-auto">
            <ConsultationForm />
          </div>
        </div>

      </section>
    </div>
  );
}
