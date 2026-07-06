import React from "react";
import DisclosureCard from "@/components/DisclosureCard";
import { ClipboardCheck, FileText, BadgeDollarSign, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Admissions Process, Requirements & FAQs | WMES",
  description: "Read details on student requirements, application processes, fees & scholarship options, and read FAQs on admissions.",
};

const admissionsFaqs = [
  {
    title: "How do I apply for international study placement?",
    summary: "A step-by-step consultation to review candidate credentials and secure university placements abroad.",
    whatCovers: "Our visa counseling and placements division handles initial application procedures, credentials verification, and visa documentation advisory for UK, US, European, and Asian universities.",
    whatsIncluded: [
      "Initial registration & consultation",
      "Credentials verification",
      "Drafting and review of Statement of Purpose",
      "Foreign university visa file compilation"
    ],
    whoFor: "Graduates and students targeting university transfers or postgraduate studies abroad."
  },
  {
    title: "Are scholarships available for the academic programmes?",
    summary: "Tuition support schemes aligned with our managed school networks and foreign partner institutions.",
    whatCovers: "WMES coordinates scholarship nominations based on outstanding academic merit and industrial partner funding pipelines. Application guides are published per semester.",
    whatsIncluded: [
      "Academic performance review",
      "Tuition discount endorsements",
      "Industrial partner funding grants",
      "Scholarship exam guidelines"
    ],
    whoFor: "Qualified applicants demonstrating high academic competence or corporate financial need."
  },
  {
    title: "What is the timeline for visa advisory and university placement?",
    summary: "Recommended timelines to ensure enrollment in autumn or spring university semesters.",
    whatCovers: "Admissions applications should begin 6-8 months prior to the target semester start. Visa documentation review generally takes 4-12 weeks based on the target country.",
    whatsIncluded: [
      "Fall admission drive (starts Jan-March)",
      "Spring admission drive (starts July-Sept)",
      "Document translation coordination",
      "Visa interview preparation cycles"
    ],
    whoFor: "Candidates seeking timely and stress-free international transitions."
  }
];

export default function Admissions() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Admissions & Enrolment
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-3xl leading-none text-glow-gradient">
            Enrollment Guide
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            We provide structured guides for candidate admissions into our managed nursery-tertiary schools, vocational certifications, and international placement programs.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Main Content Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Left Column: Requirements & Steps */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Step 1: Requirements */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
                  <ClipboardCheck size={18} />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
                  Enrollment Requirements
                </h2>
              </div>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                Candidates must provide relevant documentation to be certified for admission. Depending on the pathway, files vary:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-3 hover:border-blue-sky/40 transition-colors duration-300">
                  <h4 className="font-display font-bold text-white uppercase text-sm tracking-wider">Domestic K-12 Placement</h4>
                  <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 font-light">
                    <li>Certified birth certificate copy</li>
                    <li>Official transcript folders from previous school</li>
                    <li>Immunization/medical clearance report</li>
                    <li>Completed WMES Student Registration Form</li>
                  </ul>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 space-y-3 hover:border-blue-sky/40 transition-colors duration-300">
                  <h4 className="font-display font-bold text-white uppercase text-sm tracking-wider">International Placements</h4>
                  <ul className="text-xs text-slate-400 space-y-2 list-disc pl-4 font-light">
                    <li>Valid International Passport bio-page</li>
                    <li>WAEC, NECO, or Degree transcripts</li>
                    <li>Verified Statement of Purpose (SOP)</li>
                    <li>Two academic reference letters</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Step 2: Application Process */}
            <div className="space-y-8">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
                  <FileText size={18} />
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
                  Application Steps
                </h2>
              </div>
              
              <div className="relative border-l border-white/10 pl-8 ml-3 space-y-10">
                {[
                  {
                    title: "Submit Registration Dossier",
                    desc: "Submit application forms along with verified transcripts and bio-data. Forms are downloadable in the downloads division.",
                  },
                  {
                    title: "Academic & Document Review",
                    desc: "Our registrar assesses academic history, credentials, and requirements. Placements verify program matches.",
                  },
                  {
                    title: "Interview / Placement Screening",
                    desc: "Candidates undergo interview checks or standard entrance tests depending on grade level or destination.",
                  },
                  {
                    title: "Visa Advisory & Fee Settlement",
                    desc: "Upon securing admission, we initiate visa filing workshops, housing briefings, and tuition payment processes.",
                  }
                ].map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[47px] top-0 bg-[#020813] border border-white/20 text-blue-sky w-8 h-8 rounded-full flex items-center justify-center font-mono text-[10px] font-bold shadow-sm">
                      {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                    <h4 className="font-display font-bold text-white uppercase text-base leading-none pt-1">
                      {item.title}
                    </h4>
                    <p className="text-slate-400 text-xs sm:text-sm mt-2 leading-relaxed font-light">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: Financial & FAQ Sidebar */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Tuition card */}
            <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 space-y-5 shadow-sm hover:border-blue-sky/40 transition-colors duration-300">
              <div className="flex items-center gap-2 text-white">
                <BadgeDollarSign className="text-blue-sky" size={20} />
                <h3 className="font-display text-lg font-bold uppercase tracking-tight text-glow-gradient">
                  Tuition & Grants
                </h3>
              </div>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                WMES implements a transparent fee structure. Local school fees, professional diploma rates, and consultancy booking retainers are available upon request from our registry desk. Financial support options include:
              </p>
              <ul className="text-xs text-slate-400 space-y-2 pl-4 list-disc font-light">
                <li>Academic Merit Awards (top 5% entrance test)</li>
                <li>Sibling enrollment fee discounts</li>
                <li>Corporate partner staff training grants</li>
              </ul>
              <Link 
                href="/contact" 
                className="w-full text-center py-3.5 bg-white text-navy-ink hover:bg-slate-100 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all block hover:scale-[1.02]"
              >
                Contact Admissions Desk
              </Link>
            </div>

            {/* Help Callout (Dark) */}
            <div className="bg-white/[0.02] text-white rounded-3xl p-8 space-y-4 border border-white/10 shadow-lg hover:border-blue-sky/40 transition-colors">
              <h4 className="font-display text-md font-bold uppercase tracking-tight text-blue-sky">Need Registry Support?</h4>
              <p className="text-xs text-slate-400 font-light leading-relaxed">
                Our enrollment registrars are available Monday-Friday to answer questions about requirements and foreign placements.
              </p>
              <Link 
                href="/contact" 
                className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest font-bold text-blue-sky hover:text-white transition-colors"
              >
                <span>Contact Registrar</span>
                <ArrowRight size={12} />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-[#020813] border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-55 pointer-events-none" />
        
        <div className="max-w-4xl mx-auto px-6 sm:px-8 relative z-10">
          
          <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-10">
            <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
              <HelpCircle size={18} />
            </div>
            <div>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
                Frequently Asked Questions
              </h2>
              <p className="text-slate-400 text-xs font-light">
                Get answers to commonly asked questions regarding admissions and placement procedures.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {admissionsFaqs.map((faq, index) => (
              <DisclosureCard
                key={index}
                index={index + 5}
                title={faq.title}
                summary={faq.summary}
                whatCovers={faq.whatCovers}
                whatsIncluded={faq.whatsIncluded}
                whoFor={faq.whoFor}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
