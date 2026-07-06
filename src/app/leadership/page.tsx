import React from "react";
import Image from "next/image";
import { Mail, GraduationCap } from "lucide-react";

export const metadata = {
  title: "Leadership Board & Governance | WMES",
  description: "Read the Chancellor's welcome address and review the governing directors of the WMES Governance Board.",
};

const leadershipTeam = [
  {
    name: "Dr. Victor O. Nwankwo, PhD",
    role: "Chancellor & Managing Partner",
    qualifications: "Ph.D. in Educational Administration (UNN), MBA in Strategic Operations",
    email: "v.nwankwo@wmesgroup.com",
    bio: "Dr. Victor coordinates the strategic governance and contract acquisition pipeline for the group. Over the past 20 years, he has structured operational turnaround models for tertiary colleges and retail properties across West Africa.",
    image: null,
  },
  {
    name: "Mrs. Chioma A. Okafor, M.Ed.",
    role: "Executive Director, K-12 Operations",
    qualifications: "M.Ed. in Curriculum Design (UI), B.Sc. in Secondary Education",
    email: "c.okafor@wmesgroup.com",
    bio: "Chioma directs the day-to-day academic delivery and supervisor audits inside all contract-managed nursery, primary, and secondary schools. She manages compliance audits against international frameworks.",
    image: null,
  },
  {
    name: "Mr. Tunde A. Balogun, MBA",
    role: "Director, Business & Energy Portfolio",
    qualifications: "MBA in Hospitality Operations (Cornell), B.Sc. in Finance (UNILAG)",
    email: "t.balogun@wmesgroup.com",
    bio: "Tunde oversees operational standard implementation and internal accounting structures for adjacent business properties including hotel franchises, restaurants, and petrol station chains managed by WMES.",
    image: null,
  },
  {
    name: "Barr. (Mrs.) Blessing N. Eke",
    role: "Registrar & Director of Legal Compliance",
    qualifications: "LL.B. (Hons), LL.M. in International Business Law (LSE)",
    email: "b.eke@wmesgroup.com",
    bio: "Blessing structures the regulatory compliance protocols, bilateral university admissions placements, visa advisories, and contract covenants protecting client-investor portfolios.",
    image: null,
  }
];

export default function Leadership() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Leadership & Governance
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-3xl leading-none text-glow-gradient">
            Leadership Board
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            Our directors coordinate academic policy, contract management standards, and international partnership pipelines across West African hubs.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Chancellor's Message Section */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Chancellor Portrait Card */}
          <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between text-center aspect-[3/4] relative hover:border-blue-sky/40 transition-colors shadow-xl overflow-hidden group">
            <div className="relative w-full h-[70%] rounded-2xl overflow-hidden border border-white/5 bg-white/5">
              <Image
                src="/images/chancellor.jpeg"
                alt="Dr. Victor O. Nwankwo"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-w-7xl) 33vw"
                priority
              />
            </div>
            <div className="mt-4">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                Dr. Victor O. Nwankwo
              </h3>
              <p className="text-blue-sky text-xs font-mono uppercase tracking-widest font-bold">
                Chancellor, WMES
              </p>
            </div>
          </div>

          {/* Chancellor Message Content */}
          <div className="lg:col-span-8 space-y-6 text-slate-300">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
              Chancellor's Welcome Address
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-glow-gradient leading-tight">
              Welcome Message
            </h2>
            <p className="leading-relaxed text-sm sm:text-base font-light">
              Welcome to World Mobile Educational System (WMES). It is a profound privilege to welcome prospective students, educators, research collaborators, corporate partners, and visitors from around the world to our official portal.
            </p>
            <p className="leading-relaxed text-sm sm:text-base font-light">
              WMES was established with a singular vision: to stand as a globally respected centre of excellence in academic placement, professional training, and contract management operations. We are dedicated to equipping both individuals and organizations with the analytical capabilities, strategic governance, and vision required to succeed in a rapidly evolving global economy.
            </p>
            <p className="leading-relaxed text-sm sm:text-base font-light">
              At our core, we believe that education extends far beyond classroom boundaries. Through our managed school networks, accredited vocational diplomas, and bilateral study placement pathways in UK, Canadian, and international universities, we develop high-performing leaders. Simultaneously, our B2B operations divisions deploy standard playbooks to oversee commercial and hospitality facilities for hands-off owners.
            </p>
            <p className="leading-relaxed text-sm sm:text-base font-light">
              Guided by a commitment to excellence, integrity, and innovation, we invite you to explore our website to discover our academic profiles, downloadable fee registries, and corporate consultancies. Together, let us coordinate pathways that empower communities and drive sustainable global progress.
            </p>
            <div className="pt-4 border-t border-white/5">
              <p className="font-bold text-white text-sm sm:text-base">Dr. Victor O. Nwankwo, PhD</p>
              <p className="text-slate-400 text-xs font-mono uppercase tracking-widest mt-0.5">Chancellor & Managing Partner</p>
            </div>
          </div>

        </div>
      </section>

      {/* Leadership Board Team Grid */}
      <section className="py-24 bg-white/[0.01] border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-50 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-20">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
              BOARD MEMBERS
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-glow-gradient mt-2">
              Governance Board
            </h2>
            <p className="text-slate-400 mt-3 text-xs sm:text-sm font-light">
              Our directors combine academic credentials with years of operational field experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {leadershipTeam.map((member, index) => (
              <div 
                key={index}
                className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-blue-sky/40 transition-all duration-300 group"
              >
                <div>
                  {/* Photo Placeholder */}
                  <div className="w-full aspect-square bg-white/5 rounded-2xl flex items-center justify-center text-slate-500 mb-4 border border-white/5 relative">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">
                      Board Member
                    </span>
                  </div>

                  <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white leading-snug">
                    {member.name}
                  </h3>
                  <p className="text-blue-sky text-xs font-mono uppercase tracking-widest font-bold mb-3 mt-1">
                    {member.role}
                  </p>
                  
                  {/* Qualifications */}
                  <div className="flex items-start gap-1.5 text-slate-400 mb-4 text-[11px] font-light leading-snug">
                    <GraduationCap size={13} className="shrink-0 mt-0.5 text-blue-sky" />
                    <span>{member.qualifications}</span>
                  </div>

                  <p className="text-slate-400 text-xs leading-relaxed border-t border-white/5 pt-4 font-light">
                    {member.bio}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-blue-sky uppercase tracking-widest font-bold">
                  <a 
                    href={`mailto:${member.email}`} 
                    className="hover:text-white flex items-center gap-1.5 focus:outline-none"
                  >
                    <Mail size={11} />
                    <span>Contact</span>
                  </a>
                  <span className="text-[8px] text-slate-500 font-bold">Board Member</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
