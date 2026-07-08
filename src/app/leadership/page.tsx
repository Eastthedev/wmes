import React from "react";
import Image from "next/image";
import { Mail, GraduationCap } from "lucide-react";
import LeadershipClient from "@/components/LeadershipClient";

export const metadata = {
  title: "Leadership Board & Governance",
  description: "Read the Chancellor's welcome address and review the governing directors of the WMES Governance Board.",
  keywords: [
    "governing board",
    "board of directors",
    "Professor John Ihuoma Nwokike",
    "school administrators",
    "WMES directors"
  ],
  alternates: {
    canonical: "/leadership"
  }
};

const leadershipTeam = [
  {
    name: "Professor John Ihuoma Nwokike",
    role: "Chancellor, WMES",
    qualifications: "Ph.D. in Educational Administration (UNN), MBA in Strategic Operations",
    email: "j.nwokike@wmesgroup.com",
    bio: "Professor John coordinates the strategic governance and contract acquisition pipeline for the group. Over the past 20 years, he has structured operational turnaround models for tertiary colleges and retail properties across West Africa.",
    image: "/images/staff0.jpeg",
  },
  {
    name: "Yvoone B. Bently",
    role: "WMES President USA",
    qualifications: "Ph.D. in Educational Leadership (Harvard), M.A. in Public Administration",
    email: "y.bently@wmesgroup.com",
    bio: "Yvoone leads the international operations and US accreditation compliance. She designs corporate training modules and oversees strategic institutional relations with global partners.",
    image: "/images/staff1.jpeg",
  },
  {
    name: "Prof. Samuel K. Wright",
    role: "Global Psychologist, WMES",
    qualifications: "Ph.D. in Clinical & Educational Psychology, Fellow of the APA",
    email: "s.wright@wmesgroup.com",
    bio: "Professor Samuel directs academic counseling frameworks and psychological assessments across managed schools. He advises the board on cognitive research and student mental health policies.",
    image: "/images/staff2.jpeg",
  },
  {
    name: "Stacy Harden Williams",
    role: "Global Registrar, WMES USA",
    qualifications: "M.Sc. in Academic Registry Systems, B.A. in Communications",
    email: "s.williams@wmesgroup.com",
    bio: "Stacy administers student records, transcripts, and admissions clearances for foreign partners. She supervises registry operations across regional training campuses.",
    image: "/images/staff3.jpeg",
  },
  {
    name: "Dr. Moses Simon",
    role: "Global Manager, WMES",
    qualifications: "DBA in Organizational Management, MBA in Operations Management",
    email: "m.simon@wmesgroup.com",
    bio: "Dr. Moses manages facility operations, resource planning, and logistics. He oversees efficiency targets across educational, recreational, and hospitality contract holdings.",
    image: "/images/staff4.jpeg",
  },
  {
    name: "Dr. Isabella Gowon",
    role: "National Secretary, WMES",
    qualifications: "Ph.D. in Educational Policy, B.Sc. in Business Education",
    email: "i.gowon@wmesgroup.com",
    bio: "Isabella coordinates board resolutions, institutional communications, and legal compliance. She acts as the primary liaison between WMES and national regulatory bodies.",
    image: "/images/staff5.jpeg",
  },
  {
    name: "Apostle Prof. Queen Christopher, PhD",
    role: "Vice President, WMES",
    qualifications: "Ph.D. in Theology & Leadership, M.Ed. in Educational Supervision",
    email: "q.christopher@wmesgroup.com",
    bio: "Queen oversees regional academic operations, vocational capacity building, and institutional community partnerships. She directs teacher development initiatives.",
    image: "/images/staff6.jpeg",
  },
  {
    name: "Engr. John Odoh Sunday",
    role: "Eastern Regional Secretary, WMES",
    qualifications: "B.Eng. in Mechanical Engineering, MNSE",
    email: "j.sunday@wmesgroup.com",
    bio: "Engr. John coordinates our eastern regional administrative desk, managing school operations and regional partnership agreements across Nigeria.",
    image: "/images/staff7.jpeg",
  },
  {
    name: "Prof. Mohammadali Morshedi",
    role: "WMES Partner",
    qualifications: "Ph.D. in Educational Technology, Global Academic Partner",
    email: "m.morshedi@wmesgroup.com",
    bio: "Prof. Mohammadali Morshedi serves as an international academic partner, steering technological integration, cross-border research coordination, and global educational systems advisory.",
    image: "/images/staff8.jpeg",
  },
  {
    name: "Chief Dr. Mrs. Uzoamaka Irene Okoli",
    role: "WMES Board Member",
    qualifications: "Ada Ugo Ufuma, Governing Board Director",
    email: "u.okoli@wmesgroup.com",
    bio: "Chief Dr. Mrs. Uzoamaka Irene Okoli (Ada Ugo Ufuma) serves as a key member of the governing board, advising on community partnerships, institutional development, and corporate social responsibility projects.",
    image: "/images/staff9.jpeg",
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
          <div className="lg:col-span-4 bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col text-center relative hover:border-blue-sky/40 transition-colors shadow-xl overflow-hidden group">
            <div className="relative w-full aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5">
              <Image
                src="/images/chancellor.jpeg"
                alt="Professor John Ihuoma Nwokike, Chancellor of World Mobile Educational System (WMES)"
                fill
                className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                sizes="(max-w-7xl) 33vw"
                priority
              />
            </div>
            <div className="mt-4 space-y-1">
              <h3 className="font-display text-lg font-bold uppercase tracking-wide text-white">
                Professor John Ihuoma Nwokike
              </h3>
              <p className="text-blue-sky text-xs font-mono uppercase tracking-widest font-bold">
                Chancellor, WMES
              </p>
              <p className="text-slate-400 text-xs leading-relaxed font-light pt-2">
                Professor John Ihuoma Nwokike is an educationist, a theologian, psychologist and a political scientist.
              </p>
            </div>
          </div>

          {/* Chancellor Message Content */}
          <div className="lg:col-span-8 space-y-6 text-slate-300">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
              Chancellor's Welcome Address
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white text-glow-gradient leading-tight">
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
              <p className="font-bold text-white text-sm sm:text-base">Prof. John Ihuoma Nwokike</p>
              <p className="text-blue-sky text-xs font-mono uppercase tracking-widest mt-0.5 font-bold">Chancellor, WMES</p>
              <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest mt-0.5">World Mobile Educational System (WMES)</p>
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

          <LeadershipClient leadershipTeam={leadershipTeam} />

        </div>
      </section>

    </div>
  );
}
