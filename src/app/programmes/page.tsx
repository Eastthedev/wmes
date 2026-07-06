import React from "react";
import DisclosureCard from "@/components/DisclosureCard";
import { GraduationCap, BookOpen, Compass, Award } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Academic & Training Programmes | WMES",
  description: "Explore educational programs coordinated by WMES. From Nursery through Secondary, professional diplomas, vocational skills, and foreign university placement services.",
};

const academicProgrammes = [
  {
    title: "Local & International Student Recruitment & Placement Services",
    summary: "Direct admission processing and placement services for domestic and foreign educational institutions.",
    whatCovers: "WMES facilitates smooth transition routes for students applying to accredited colleges and universities in Nigeria and abroad, handling transcript evaluation, application review, and admission representation.",
    whatsIncluded: [
      "Admissions counseling and university selection",
      "Document review and transcript evaluation support",
      "Statement of Purpose (SOP) guidance and tutorials",
      "Application tracking and institutional follow-up",
      "Visa application compilation and counseling"
    ],
    whoFor: "Students seeking direct entry or transfers into universities in Europe, North America, Asia, and top local institutions."
  },
  {
    title: "Training, Vocational & Skills Acquisition Programmes (with Overseas Job Placement)",
    summary: "Accredited technical training and vocational programmes paired with global job placement opportunities.",
    whatCovers: "We offer hands-on training across high-demand vocational fields, certifying students and guiding them through applications for international job placement and skilled worker pathways.",
    whatsIncluded: [
      "Technical and vocational skill certification",
      "CV writing and global employer interview preparation",
      "Overseas job application support and visa advisory",
      "Pre-departure orientation and settlement guidance",
      "Bilateral employer connection networks"
    ],
    whoFor: "School leavers, graduates, and young professionals seeking global employment opportunities."
  },
  {
    title: "Career Guidance & Professional Development Programmes",
    summary: "Personalized mentorship and professional coaching to align academic pathways with successful careers.",
    whatCovers: "This programme offers students individual counseling, aptitude mapping, and professional workshops to build leadership, soft skills, and strategic career planning.",
    whatsIncluded: [
      "Individual career path counseling and assessment",
      "Resume, cover letter, and LinkedIn optimization",
      "Professional networking workshops & seminars",
      "Mock interview sessions with industry professionals",
      "Leadership and soft skills development modules"
    ],
    whoFor: "Secondary school seniors, university students, and early-career professionals."
  },
  {
    title: "General Educational Consultancy & Academic Advisory Services",
    summary: "Academic planning and consulting for students aiming to maximize their academic performance and university readiness.",
    whatCovers: "We guide students in selecting correct subject combinations, designing effective study plans, choosing extra-curricular targets, and achieving compliance with local and international admission criteria.",
    whatsIncluded: [
      "Academic progress monitoring and intervention planning",
      "Advising on standardized test preparation (WAEC, NECO, JAMB, IELTS, TOEFL)",
      "Subject selection and curriculum pathway consulting",
      "Higher education preparedness audits",
      "One-on-one academic mentoring sessions"
    ],
    whoFor: "Students of all levels aiming for top-tier academic success and parents seeking educational guidance for their children."
  }
];

export default function Programmes() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Academic Programmes
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-4xl leading-none text-glow-gradient">
            Academic Registry
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            Providing structured educational pathways from early foundation nurseries to international university admissions. Select a directory to view curriculum profiles.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Main Programs List */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-[#020813] bg-dot-grid-dark">
        
        {/* Intro Cards Grid with Hover Glows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              icon: BookOpen,
              title: "Basic Education",
              desc: "Foundational literacy and cognitive syllabus structures designed for managed K-12 K-School systems."
            },
            {
              icon: Award,
              title: "Vocational Skills",
              desc: "Accredited diplomas and certificate systems mapping to energy, hospitality, and admin sectors."
            },
            {
              icon: Compass,
              title: "Global Placements",
              desc: "Registry support, visa advisories, and foreign university transcript transfer pipelines."
            }
          ].map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white/[0.02] border border-white/10 p-8 rounded-2xl space-y-4 hover:border-blue-sky/40 transition-all duration-300 hover:shadow-md"
            >
              <div className="text-blue-sky">
                <item.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">{item.title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>

        {/* Accordions Title */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-10">
          <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
            <GraduationCap size={18} />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
              Accredited Curriculums
            </h2>
            <p className="text-slate-400 text-xs font-light">
              Review syllabus outlines and target candidate groups.
            </p>
          </div>
        </div>

        {/* Specifications List */}
        <div className="space-y-4">
          {academicProgrammes.map((program, index) => (
            <DisclosureCard
              key={index}
              index={index}
              title={program.title}
              summary={program.summary}
              whatCovers={program.whatCovers}
              whatsIncluded={program.whatsIncluded}
              whoFor={program.whoFor}
            />
          ))}
        </div>

      </section>

      {/* Admissions Call to Action */}
      <section className="bg-[#020813] bg-dot-grid-dark text-white py-24 text-center relative overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-80 h-80 rounded-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute left-0 right-0 top-0 h-10 bg-[#020813] clip-ribbon-base" aria-hidden="true" />
        
        <div className="max-w-3xl mx-auto px-6 sm:px-8 mt-6 space-y-6 relative z-10">
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-glow-gradient">
            Initiate Enrollment Pathways
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-xl mx-auto font-light leading-relaxed">
            Apply online for local admissions or speak directly with our admissions registrars regarding international studies.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link 
              href="/admissions" 
              className="bg-white hover:bg-slate-100 text-navy-ink px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:scale-[1.03]"
            >
              Admissions Portal
            </Link>
            <Link 
              href="/contact" 
              className="bg-transparent hover:bg-white/5 border border-white/10 text-white px-8 py-3.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-colors"
            >
              Contact Directory
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
