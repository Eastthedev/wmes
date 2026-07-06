import React from "react";
import DisclosureCard from "@/components/DisclosureCard";
import ConsultationForm from "@/components/ConsultationForm";
import { Building2 } from "lucide-react";

export const metadata = {
  title: "Management Consultancy & Operations | WMES",
  description: "Explore the 10 professional management and advisory divisions of the World Mobile Educational System, including school operations, hospitality, and turnaround restructuring.",
};

const consultancyServices = [
  {
    title: "Contract Management of Schools (Nursery – Tertiary & Vocational)",
    summary: "Complete operational and administrative management of educational institutions under a defined management contract.",
    whatCovers: "WMES takes full responsibility for the day-to-day operations of schools, covering governance, administration, staffing, curriculum quality, and facilities, while allowing proprietors to retain ownership.",
    whatsIncluded: [
      "Daily school administrative and operational oversight",
      "Staff recruitment, training, and performance management",
      "Accredited curriculum implementation (national & international)",
      "Facilities management, budgeting, and financial reporting",
      "Student enrollment marketing and growth campaigns"
    ],
    whoFor: "School proprietors, investors, and boards seeking professional third-party management for their institutions."
  },
  {
    title: "Contract Management of Hospitality & Energy Facilities",
    summary: "Operational oversight of hotels, recreational hubs, petrol stations, and gas plants on a contract basis.",
    whatCovers: "We apply our strict operational governance and auditing framework to hospitality and retail energy facilities, ensuring cost efficiency, regulatory compliance, excellent customer experience, and profitability.",
    whatsIncluded: [
      "Day-to-day operations and facility management",
      "Staff training and hospitality/customer service standards",
      "Inventory audit and supply chain management",
      "Safety compliance and environmental standards regulation",
      "Financial auditing and revenue optimization models"
    ],
    whoFor: "Owners and investors of hotels, recreation centers, petrol stations, and gas plants seeking disciplined, hands-off management."
  },
  {
    title: "Educational Research, Publications & Content Development",
    summary: "Academic research coordination, educational publishing, and curriculum content design.",
    whatCovers: "We conduct academic research, publish educational materials, and design custom curriculum content and study guides aligned with modern educational standards and pedagogy.",
    whatsIncluded: [
      "Curriculum design and syllabus content development",
      "Academic textbook and learning guide publication",
      "Educational diagnostic studies and performance research",
      "Institutional policy papers and whitepaper writing",
      "Digital learning content creation and resource mapping"
    ],
    whoFor: "Publishers, schools, government bodies, and educational organizations needing premium content and research insights."
  },
  {
    title: "Institutional Rehabilitation & Restructuring (Contract Basis)",
    summary: "Turnaround services for underperforming or struggling schools and commercial facilities.",
    whatCovers: "For organizations facing operational distress, financial leaks, or declining enrollment, WMES conducts comprehensive diagnostics and implements a complete turnaround restructuring plan covering management, finance, and academics on a contract basis.",
    whatsIncluded: [
      "Full diagnostic audit of operations and financials",
      "Leadership reorganization and governance updates",
      "Staff retraining, restructuring, and optimization",
      "Academics/curriculum overhaul and quality control",
      "Enrollment recovery strategy and brand rebuilding"
    ],
    whoFor: "Proprietors and boards of struggling schools, colleges, or other institutions requiring rapid operational recovery."
  },
  {
    title: "Educational Project Design & Implementation",
    summary: "Planning, development, and execution of educational projects for public and private sponsors.",
    whatCovers: "We handle end-to-end execution of educational initiatives, from constructing and setting up new campuses to rolling out large-scale literacy or digital learning programs for government and private entities.",
    whatsIncluded: [
      "Feasibility studies, budget design, and planning",
      "Project execution monitoring and site management",
      "Procurement of school equipment and teaching resources",
      "Stakeholder engagement and regulatory clearance handling",
      "Post-implementation performance evaluations"
    ],
    whoFor: "Government ministries, development agencies, and private philanthropists or investors sponsoring educational projects."
  },
  {
    title: "Industrial Funding & Investment Facilitation",
    summary: "Securing growth capital, partnerships, and investment pipelines for institutional and corporate projects.",
    whatCovers: "WMES works to connect educational institutions and commercial companies with local and international funding opportunities, assisting with proposal packaging and matching projects with prospective investors.",
    whatsIncluded: [
      "Funding proposal compilation and presentation",
      "Investor matching and partnership pitch sessions",
      "Financial modeling and feasibility documentation",
      "Joint venture structuring and guidance",
      "Ongoing compliance advisory for funding utilization"
    ],
    whoFor: "Proprietors, educational bodies, and corporate entities seeking capital to scale operations."
  },
  {
    title: "Local & International School Centre Management",
    summary: "Management and support services for school learning hubs, branches, and testing centers.",
    whatCovers: "We establish, license, and manage physical school centers and study hubs locally and internationally, ensuring uniform administrative standards and seamless operational support.",
    whatsIncluded: [
      "Hub establishment and local zoning/accreditation licensing",
      "International student support and hub coordination",
      "Standardized testing facility administration (WAEC, Cambridge, etc.)",
      "Cross-border academic program coordination",
      "Digital infrastructure setup for distant learning centers"
    ],
    whoFor: "Educational institutions wishing to expand their reach through local and international study centers."
  },
  {
    title: "Industrial & Educational Conference Hosting",
    summary: "End-to-end organization and coordination of local and international conferences, seminars, and summits.",
    whatCovers: "We host large-scale events that bring together leaders, educators, and industry experts to discuss innovation, policies, vocational skills, and operational governance.",
    whatsIncluded: [
      "Event planning, theme design, and speaker recruitment",
      "Venue sourcing and physical/digital logistics management",
      "Marketing, registration, and attendee coordination",
      "Sponsorship management and partner networking",
      "Conference proceedings publication and follow-up reports"
    ],
    whoFor: "Professional bodies, educational associations, corporate sectors, and ministries seeking elite event management."
  }
];

export default function Consultancy() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header */}
      <section className="bg-dot-grid-dark py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Consultancy & Operations
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-4xl leading-none text-glow-gradient">
            Management Consultancy
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            WMES coordinates contract-governed operations and diagnostic restructuring across ten commercial sectors. Select a sector below to review detailed specifications.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Services List Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-10">
          <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
            <Building2 size={18} />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
              Core Divisions
            </h2>
            <p className="text-slate-400 text-xs font-light">
              Review specifications lists and operational inclusions.
            </p>
          </div>
        </div>

        {/* The Expandable Disclosure List */}
        <div className="space-y-4">
          {consultancyServices.map((service, index) => (
            <DisclosureCard
              key={index}
              index={index}
              title={service.title}
              summary={service.summary}
              whatCovers={service.whatCovers}
              whatsIncluded={service.whatsIncluded}
              whoFor={service.whoFor}
            />
          ))}
        </div>

      </section>

      {/* Booking Form Section */}
      <section className="py-24 bg-[#020813] border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-50 pointer-events-none" />
        <div className="max-w-3xl mx-auto px-6 sm:px-8 relative z-10">
          <ConsultationForm />
        </div>
      </section>

    </div>
  );
}
