import React from "react";
import Image from "next/image";
import { Mail, GraduationCap, ArrowDown } from "lucide-react";
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
    email: "j.nwokike@worldedusystem.com",
    bio: "Professor John coordinates the strategic governance and contract acquisition pipeline for the group. Over the past 20 years, he has structured operational turnaround models for tertiary colleges and retail properties across West Africa.",
    image: "/images/staff0.jpeg",
  },
  {
    name: "Yvoone B. Bently",
    role: "WMES President USA",
    qualifications: "Ph.D. in Educational Leadership (Harvard), M.A. in Public Administration",
    email: "y.bently@worldedusystem.com",
    bio: "Yvoone leads the international operations and US accreditation compliance. She designs corporate training modules and oversees strategic institutional relations with global partners.",
    image: "/images/staff1.jpeg",
  },
  {
    name: "Prof. Samuel K. Wright",
    role: "Global Psychologist, WMES",
    qualifications: "Ph.D. in Clinical & Educational Psychology, Fellow of the APA",
    email: "s.wright@worldedusystem.com",
    bio: "Professor Samuel directs academic counseling frameworks and psychological assessments across managed schools. He advises the board on cognitive research and student mental health policies.",
    image: "/images/staff2.jpeg",
  },
  {
    name: "Stacy Harden Williams",
    role: "Global Registrar, WMES USA",
    qualifications: "M.Sc. in Academic Registry Systems, B.A. in Communications",
    email: "s.williams@worldedusystem.com",
    bio: "Stacy administers student records, transcripts, and admissions clearances for foreign partners. She supervises registry operations across regional training campuses.",
    image: "/images/staff3.jpeg",
  },
  {
    name: "Dr. Moses Simon",
    role: "Global Manager, WMES",
    qualifications: "DBA in Organizational Management, MBA in Operations Management",
    email: "m.simon@worldedusystem.com",
    bio: "Dr. Moses manages facility operations, resource planning, and logistics. He oversees efficiency targets across educational, recreational, and hospitality contract holdings.",
    image: "/images/staff4.jpeg",
  },
  {
    name: "Dr. Isabella Gowon",
    role: "National Secretary, WMES",
    qualifications: "Ph.D. in Educational Policy, B.Sc. in Business Education",
    email: "i.gowon@worldedusystem.com",
    bio: "Isabella coordinates board resolutions, institutional communications, and legal compliance. She acts as the primary liaison between WMES and national regulatory bodies.",
    image: "/images/staff5.jpeg",
  },
  {
    name: "Apostle Prof. Queen Christopher, PhD",
    role: "Vice President, WMES",
    qualifications: "Ph.D. in Theology & Leadership, M.Ed. in Educational Supervision",
    email: "q.christopher@worldedusystem.com",
    bio: "Queen oversees regional academic operations, vocational capacity building, and institutional community partnerships. She directs teacher development initiatives.",
    image: "/images/staff6.jpeg",
  },
  {
    name: "Engr. John Odoh Sunday",
    role: "Eastern Regional Secretary, WMES",
    qualifications: "B.Eng. in Mechanical Engineering, MNSE",
    email: "j.sunday@worldedusystem.com",
    bio: "Engr. John coordinates our eastern regional administrative desk, managing school operations and regional partnership agreements across Nigeria.",
    image: "/images/staff7.jpeg",
  },
  {
    name: "Prof. Mohammadali Morshedi",
    role: "WMES Partner",
    qualifications: "Ph.D. in Educational Technology, Global Academic Partner",
    email: "m.morshedi@worldedusystem.com",
    bio: "Prof. Mohammadali Morshedi serves as an international academic partner, steering technological integration, cross-border research coordination, and global educational systems advisory.",
    image: "/images/staff8.jpeg",
  },
  {
    name: "Chief Dr. Mrs. Uzoamaka Irene Okoli",
    role: "WMES Board Member",
    qualifications: "Ada Ugo Ufuma, Governing Board Director",
    email: "u.okoli@worldedusystem.com",
    bio: "Chief Dr. Mrs. Uzoamaka Irene Okoli (Ada Ugo Ufuma) serves as a key member of the governing board, advising on community partnerships, institutional development, and corporate social responsibility projects.",
    image: "/images/staff9.jpeg",
  },
  {
    name: "Mr. Mgbadike Okwudili",
    role: "Marketing Director",
    qualifications: "MBA in Marketing & Strategic Brand Management, B.Sc. in Business Administration",
    email: "m.okwudili@worldedusystem.com",
    bio: "Mr. Mgbadike oversees the global marketing strategies and brand communications for the group, driving enrollment growth and institutional partner engagement across regional networks.",
    image: "/images/staff10.jpeg",
  },
  {
    name: "Mrs. Chinelo Margaret Nonwani James",
    role: "National Marketing Manager",
    qualifications: "M.Sc. in Corporate Communications, B.A. in Mass Communication",
    email: "c.james@worldedusystem.com",
    bio: "Mrs. Chinelo coordinates national marketing campaigns, regional outreach initiatives, and strategic admissions publicity pipelines across our campus hubs.",
    image: "/images/staff11.jpeg",
  },
  {
    name: "Mr. Ogwudinso Jerry Ugochukwu",
    role: "Real Estate Manager",
    qualifications: "B.Sc. in Marketing & Public Relations",
    email: "j.ogwudinso@worldedusystem.com",
    bio: "Mr. Ogwudinso leads property acquisition programs, client relationship management, and site development operations within the real estate division.",
    image: "/images/staff12.jpeg",
  }
];

export default function Leadership() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* ══════════════════════════════════════════
          1. HERO — CHANCELLOR'S WELCOME ADDRESS
      ═════════════════════════════════════════ */}
      <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 border-b border-white/[0.08] bg-gradient-to-b from-[#060D1A] via-[#040A16] to-[#020813] overflow-hidden">
        {/* Ambient Lighting */}
        <div className="absolute left-1/4 -top-32 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute right-0 top-1/3 w-80 h-80 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left: Chancellor's Welcome Message Content (7 cols) */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-[1.5px] bg-blue-500" />
                  <span className="text-xs uppercase tracking-wider text-blue-400 font-semibold">
                    Office of the Chancellor • WMES Governance
                  </span>
                </div>
                <h1 className="font-display text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-white leading-[1.08]">
                  Welcome to World Mobile Educational System
                </h1>
              </div>

              <div className="space-y-4 text-slate-300 text-sm sm:text-base font-light leading-relaxed">
                <p>
                  On behalf of our entire team, I warmly welcome you to a global platform dedicated to transforming education, professional development, innovation, and sustainable growth. At World Mobile Educational System, we are committed to building international partnerships, developing world-class institutions, empowering individuals with quality education and skills, and promoting excellence in management and consultancy.
                </p>
                <p>
                  We invite students, institutions, governments, businesses, and development partners from around the world to join us as we work together to create opportunities, inspire innovation, and build a brighter future for generations to come.
                </p>
                <p className="font-medium text-white italic font-serif text-base sm:text-lg">
                  &ldquo;Thank you for believing in our vision.&rdquo;
                </p>
              </div>

              {/* Chancellor Credentials & Sign-off Block */}
              <div className="pt-6 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-display text-lg font-bold uppercase text-white tracking-wide">
                    Prof. John Ihuoma Nwokike
                  </h4>
                  <p className="text-blue-400 text-xs font-mono uppercase tracking-wider font-semibold">
                    Chancellor & Chairman of Governing Council
                  </p>
                  <p className="text-slate-400 text-xs font-light">
                    Educationist, Theologian, Psychologist & Political Scientist
                  </p>
                </div>

                <a
                  href="#governance-board"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 hover:border-blue-400/50 hover:bg-white/[0.08] text-xs font-mono uppercase tracking-wider text-slate-300 hover:text-white transition-all shrink-0 w-fit"
                >
                  <span>Meet Governing Board</span>
                  <ArrowDown className="w-3.5 h-3.5 text-blue-400" />
                </a>
              </div>
            </div>

            {/* Right: Sculptural Organic Blob Portrait (5 cols) */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-full max-w-md aspect-square">
                {/* Ambient Behind-Blob Glow */}
                <div className="absolute inset-0 bg-blue-600/20 rounded-full blur-3xl pointer-events-none scale-95" />

                {/* The Sculptural Organic Blob */}
                <div
                  className="relative w-full h-full overflow-hidden border border-white/15 shadow-2xl bg-[#060D1A] group"
                  style={{
                    borderRadius: "38% 62% 63% 37% / 41% 44% 56% 59%"
                  }}
                >
                  <Image
                    src="/images/chancellor.jpeg"
                    alt="Professor John Ihuoma Nwokike, Chancellor of World Mobile Educational System (WMES)"
                    fill
                    className="object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    priority
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          2. GOVERNANCE BOARD — FLOATING ORGANIC BLOBS
      ═════════════════════════════════════════ */}
      <section id="governance-board" className="py-24 sm:py-32 bg-[#020813] relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24 space-y-3">
            <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 font-bold inline-block">
              BOARD DIRECTORS & REGENTS
            </span>
            <h2 className="font-display text-3xl sm:text-5xl font-black uppercase tracking-tight text-white mt-2 leading-tight">
              The Governance Board
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm font-light leading-relaxed">
              Our directors combine verified academic credentials with decades of operational field experience across universities, regulatory councils, and enterprise management.
            </p>
          </div>

          <LeadershipClient leadershipTeam={leadershipTeam} />

        </div>
      </section>

    </div>
  );
}
