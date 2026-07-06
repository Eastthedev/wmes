import React from "react";
import Image from "next/image";
import { Camera, Image as ImageIcon, HelpCircle } from "lucide-react";

export const metadata = {
  title: "Media & Event Archives | WMES",
  description: "Browse photos and media from the WMES managed campuses, professional training workshops, and corporate outreach events.",
};

const galleryItems = [
  {
    title: "WMES Corporate Headquarters & Campus",
    category: "CAMPUS",
    src: "/images/campus.png",
    description: "Our central operations hub and registrar facilities based in Enugu, Nigeria, coordinating regional consultancy."
  },
  {
    title: "Vocational Skills & Management Training Seminar",
    category: "TRAINING",
    src: "/images/training.png",
    description: "Instructors delivering hospitality management and customer relations courses to our vocational candidates."
  },
  {
    title: "Secondary School Classroom Operations",
    category: "CAMPUS",
    src: null,
    description: "A K-12 contract-managed classroom implementing our standard accredited syllabus curriculum."
  },
  {
    title: "Executive Director's Administrative Audit Review",
    category: "EVENTS",
    src: null,
    description: "Academic supervisors and school governors aligning operational reporting structures for nursery-tertiary networks."
  },
  {
    title: "Vocational IT Laboratory Infrastructure",
    category: "TRAINING",
    src: null,
    description: "Our benchmarked computing lab facilities supporting diploma students in technical skill acquisition."
  },
  {
    title: "Annual Bilateral Partnership Summit",
    category: "EVENTS",
    src: null,
    description: "Foreign university registrars and local education board members aligning credit transfer visa directories."
  }
];

export default function Gallery() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Gallery & Media
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-3xl leading-none text-glow-gradient">
            Media & Event Archives
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            Visual records from our managed academic campuses, professional training workshops, and corporate outreach operations.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Gallery Photo Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        
        {/* Section Header */}
        <div className="flex items-center gap-3 border-b border-white/5 pb-6 mb-12">
          <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
            <Camera size={18} />
          </div>
          <div>
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
              Photo Records
            </h2>
            <p className="text-slate-400 text-xs font-light">
              Explore photography records of academic, operational, and event activities.
            </p>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-blue-sky/40 hover:shadow-lg transition-all duration-300 group"
            >
              {/* Media Section */}
              <div className="relative aspect-video bg-white/5 flex items-center justify-center border-b border-white/5 overflow-hidden">
                {item.src ? (
                  <Image
                    src={item.src}
                    alt={item.title}
                    fill
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                    sizes="(max-w-7xl) 33vw"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-500 p-4 text-center">
                    <ImageIcon size={22} className="text-slate-600 mb-2" />
                    <span className="font-mono text-[9px] uppercase tracking-widest text-slate-500 bg-white/5 px-2 py-0.5 rounded font-bold">
                      Archive {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                    </span>
                  </div>
                )}
                <span className="absolute top-3 left-3 bg-[#020813]/80 text-white font-mono text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Caption Section */}
              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between bg-[#030a12]/30">
                <div>
                  <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mt-2 font-light">
                    {item.description}
                  </p>
                </div>
                <div className="mt-6 pt-3 border-t border-white/5 flex justify-between items-center text-[8px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                  <span>WMES MEDIA</span>
                  <span>RECORDED — 2026</span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </section>

      {/* Media Policy Disclaimer */}
      <section className="py-12 bg-white/[0.01] border-t border-white/5 text-center text-[10px] font-mono tracking-widest uppercase text-slate-500">
        <div className="max-w-xl mx-auto px-6">
          <HelpCircle size={16} className="mx-auto mb-2 text-slate-600" />
          <p>
            All media displayed are intellectual property of World Mobile Educational System (WMES). Re-publishing or hotlinking media files without written authorization from the Press Secretariat is strictly prohibited.
          </p>
        </div>
      </section>

    </div>
  );
}
