import React from "react";
import AboutCards from "@/components/AboutCards";
import { Bookmark, Award, Landmark, CheckCircle2, ShieldCheck, Globe, GraduationCap, Briefcase, Users, Building2, Activity, BookOpen, Compass, TrendingUp, Calendar, FileText } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Institutional Profile & Corporate Mission",
  description: "Learn about the history, corporate vision, and academic/operational objectives of World Mobile Educational System (WMES), accredited in the United States.",
  keywords: [
    "about WMES",
    "WMES profile",
    "educational registry Nigeria",
    "US accredited education organization"
  ],
  alternates: {
    canonical: "/about"
  }
};

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

const objectivePillars = [
  {
    title: "Academic & Educational Excellence",
    icon: GraduationCap,
    objectives: [
      "To provide accessible, high-quality education that meets national and international standards and promotes academic excellence.",
      "To promote lifelong learning through formal education, professional certification, vocational training, executive development, and continuous capacity-building programmes.",
      "To promote digital learning, innovation, and the responsible use of emerging technologies in education, business, and professional practice.",
      "To create an inclusive learning environment that respects diversity, promotes equal opportunities, and empowers learners from all backgrounds to achieve their full potential."
    ]
  },
  {
    title: "Leadership & Capacity Building",
    icon: Award,
    objectives: [
      "To develop competent, ethical, innovative, and globally competitive leaders capable of making meaningful contributions to society.",
      "To encourage entrepreneurship and self-reliance by equipping individuals with practical skills for business creation, employment, and wealth generation.",
      "To promote ethical leadership, integrity, accountability, inclusiveness, and social responsibility in all programmes and institutional activities."
    ]
  },
  {
    title: "Advisory & Corporate Solutions",
    icon: Briefcase,
    objectives: [
      "To provide professional consultancy services in education, business management, hospitality, human resource management, institutional development, project management, and related sectors.",
      "To support schools, organizations, businesses, and government institutions through strategic planning, organizational restructuring, policy development, and performance improvement.",
      "To provide recruitment, staff development, leadership training, and workforce solutions that improve organizational productivity and service delivery."
    ]
  },
  {
    title: "Research, Innovation & Partnerships",
    icon: Globe,
    objectives: [
      "To advance research, innovation, technology, and entrepreneurship as drivers of sustainable economic growth and social development.",
      "To facilitate international educational opportunities by assisting students with admissions, scholarships, study abroad programmes, and academic partnerships.",
      "To establish and strengthen strategic partnerships with educational institutions, industries, governments, development agencies, and international organizations for knowledge exchange and collaborative development."
    ]
  },
  {
    title: "Community Outreach & Global Impact",
    icon: Users,
    objectives: [
      "To contribute to community development through educational outreach, youth empowerment, women's empowerment, environmental sustainability, and social impact initiatives.",
      "To position World Mobile Educational System as a globally respected institution recognized for excellence in education, professional development, research, innovation, consultancy, and international collaboration."
    ]
  }
];

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    "name": "About World Mobile Educational System",
    "description": "Institutional profile, corporate vision, and academic/operational objectives of World Mobile Educational System (WMES).",
    "publisher": {
      "@type": "EducationalOrganization",
      "name": "World Mobile Educational System",
      "url": "https://worldedusystem.com"
    }
  };

  return (
    <div className="font-body bg-[#020813] text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            About WMES
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-3xl leading-none text-glow-gradient">
            Institutional Profile
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            World Mobile Educational System (WMES) is an international educational and management consultancy organization committed to delivering innovative solutions in education, hospitality, institutional management, business development, and professional training. The organization works with governments, educational institutions, corporate organizations, and private investors to improve standards, enhance operational efficiency, and promote sustainable development.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* History and Background Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          <div className="lg:col-span-7 space-y-6 text-slate-300">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
              Our Story & Background
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-glow-gradient leading-tight">
              World Mobile Educational System (WMES)
            </h2>
            
            <p className="leading-relaxed text-sm sm:text-base font-light">
              World Mobile Educational System (WMES) is an internationally oriented educational, professional training, and management consultancy organization committed to transforming lives through quality education, innovation, research, leadership development, and human capacity building.
            </p>
            <p className="leading-relaxed text-sm sm:text-base font-light">
              Headquartered at the National Centre for Women Development, Central Area, Abuja, with its Eastern Regional Headquarters at Chika&apos;s Plaza, Centenary Estate, Enugu, Nigeria, WMES is dedicated to delivering educational and professional services that meet global standards while responding to the evolving needs of individuals, businesses, institutions, and communities.
            </p>

            {/* US Accreditation Callout */}
            <div className="bg-gradient-to-r from-blue-primary/10 to-blue-sky/10 border border-blue-sky/20 rounded-2xl p-5 relative overflow-hidden my-4">
              <div className="absolute right-0 top-0 w-24 h-full bg-white/5 skew-x-12 pointer-events-none" />
              <div className="flex gap-4 items-start relative z-10">
                <div className="p-2.5 bg-blue-sky/15 rounded-xl text-blue-sky shrink-0">
                  <ShieldCheck size={18} />
                </div>
                <div className="space-y-1">
                  <span className="font-mono text-[7px] tracking-widest text-blue-sky uppercase font-bold block">Accreditation status</span>
                  <p className="text-slate-200 text-xs leading-relaxed">
                    WMES is registered in Nigeria and <span className="text-white font-semibold underline decoration-blue-sky decoration-wavy underline-offset-4">accredited in the United States</span>, reflecting our commitment to international quality standards, institutional credibility, and global collaboration. Through these foundations, the institution builds strategic partnerships with corporate organizations, educational networks, and international stakeholders.
                  </p>
                </div>
              </div>
            </div>

            <p className="leading-relaxed text-sm sm:text-base font-light">
              WMES offers a broad range of services and programmes designed to prepare individuals and institutions for success in an increasingly interconnected world. We work with schools, corporate partners, government agencies, and non-governmental organizations to promote sustainable development and lifelong learning.
            </p>



            <p className="leading-relaxed text-sm sm:text-base font-light pt-4">
              Guided by the core values of excellence, integrity, innovation, inclusiveness, professionalism, accountability, and service, WMES seeks to empower learners, professionals, entrepreneurs, and institutions with the knowledge, skills, and leadership needed to make a positive impact in their communities and across the world.
            </p>

            <blockquote className="border-l-2 border-blue-sky pl-6 py-2.5 text-white font-semibold italic bg-white/5 rounded-r text-sm">
              &quot;At World Mobile Educational System, we believe that education is more than the acquisition of knowledge—it is the foundation for innovation, responsible leadership, economic growth, and positive social transformation. We are committed to empowering individuals and institutions to succeed while making lasting contributions to humanity.&quot;
            </blockquote>
          </div>
          
          <div className="lg:col-span-5 bg-white/[0.02] text-white rounded-3xl p-8 sm:p-10 space-y-8 border border-white/10 shadow-xl">
            <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white">
              Hub Dossier
            </h3>
            <div className="space-y-4 font-mono text-[10px] uppercase tracking-widest text-slate-400">
              <div className="border-b border-white/5 pb-3 flex justify-between items-start gap-4">
                <span>HEADQUARTERS</span>
                <span className="font-semibold text-white text-right">National Centre for Women Development, Central Area, Abuja, Nigeria</span>
              </div>
              <div className="border-b border-white/5 pb-3 flex justify-between items-start gap-4">
                <span>EASTERN REGIONAL HQ</span>
                <span className="font-semibold text-white text-right">Chika&apos;s Plaza, Centenary Estate, Enugu, Nigeria</span>
              </div>
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <span>REGISTRATION</span>
                <span className="font-semibold text-white">Registered in Nigeria</span>
              </div>
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <span>ACCREDITATION</span>
                <span className="font-semibold text-blue-sky">United States Accredited</span>
              </div>
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <span>FOUNDING YEAR</span>
                <span className="font-semibold text-white">22nd June 2021</span>
              </div>
              <div className="border-b border-white/5 pb-3 flex justify-between items-center">
                <span>SECTORS SERVED</span>
                <span className="font-semibold text-white">Education, Hospitality, HR, Energy</span>
              </div>
              <div className="pb-3 flex justify-between items-center">
                <span>REACH</span>
                <span className="font-semibold text-white">Nigeria & International</span>
              </div>
            </div>
            <Link 
              href="/contact" 
              className="block w-full text-center py-3.5 bg-white text-navy-ink rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all hover:scale-[1.03] shadow-sm"
            >
              Contact Directory
            </Link>
          </div>
        </div>
      </section>

      {/* Offerings Portfolio Section */}
      <section className="py-24 border-b border-white/5 bg-white/[0.01] relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full font-bold">
              Offerings Portfolio
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-4 text-glow-gradient font-black">
              Our Service Contracts
            </h2>
            <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light">
              World Mobile Educational System operates comprehensive contract-managed frameworks across educational, hospitality, and corporate advisory sectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {offeringsPortfolio.map((item, idx) => (
              <div 
                key={idx} 
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-blue-sky">
                    <item.icon size={22} />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision, Mission, Values Section */}
      <section className="py-24 bg-white/[0.01] border-t border-b border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <AboutCards />
        </div>
      </section>

      {/* Strategic Objectives Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 border-b border-white/5 bg-dot-grid-dark relative">
        <div className="absolute right-1/4 bottom-0 w-96 h-96 rounded-full bg-blue-primary/5 blur-[120px] pointer-events-none" />
        
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
            Actionable Mandates
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-2 text-glow-gradient">
            Strategic Objectives
          </h2>
          <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light">
            Our established benchmarks designed to advance quality education, capacity building, and leadership development globally.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {objectivePillars.map((pillar, idx) => (
            <div 
              key={idx} 
              className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 sm:p-8 hover:border-blue-sky/40 hover:bg-white/[0.03] transition-all duration-300 relative group flex flex-col justify-between"
            >
              <div className="space-y-6">
                <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                  <div className="w-10 h-10 rounded-full bg-blue-sky/10 flex items-center justify-center text-blue-sky group-hover:bg-blue-sky/20 transition-colors">
                    <pillar.icon size={20} />
                  </div>
                  <h3 className="font-display text-base font-bold uppercase tracking-tight text-white group-hover:text-blue-sky transition-colors leading-tight">
                    {pillar.title}
                  </h3>
                </div>

                <ul className="space-y-4">
                  {pillar.objectives.map((obj, oIdx) => (
                    <li key={oIdx} className="flex items-start gap-3">
                      <CheckCircle2 size={13} className="text-blue-sky/70 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 font-light leading-relaxed">
                        {obj}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Why Choose WMES Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
            THE WMES ADVANTAGE
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-2 text-glow-gradient">
            Operational Strengths
          </h2>
          <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light">
            We provide institutional owners and candidates distinct structural advantages.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              icon: Landmark,
              title: "Verified Governance",
              desc: "Our financial auditing systems, compliance monitoring, and structured executive updates guarantee asset health.",
            },
            {
              icon: Award,
              title: "Accredited Excellence",
              desc: "All contract-managed schools implement curriculum designs benchmarked against Cambridge and national standards.",
            },
            {
              icon: Bookmark,
              title: "Diversified Reach",
              desc: "We coordinate adjacent sectors—hotels, recreational sites, and energy outlets—ensuring standardized staff training.",
            },
          ].map((item, idx) => (
            <div key={idx} className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 space-y-4 hover:border-blue-sky/40 hover:shadow-sm transition-all duration-300">
              <div className="text-blue-sky">
                <item.icon size={22} />
              </div>
              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white">
                {item.title}
              </h3>
              <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
