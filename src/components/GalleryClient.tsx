"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Camera, HelpCircle, X } from "lucide-react";

interface GalleryItem {
  title: string;
  category: string;
  src: string;
  description: string;
}

const galleryItems: GalleryItem[] = [
  {
    title: "Conferring of Honour",
    category: "EVENTS",
    src: "/images/media0.jpeg",
    description: "World Mobile Educational System conferring honour on Rev. Father Ejike Camillus Mbaka."
  },
  {
    title: "Honorary Doctorate Recipient",
    category: "GRADUATION",
    src: "/images/media1.jpeg",
    description: "An honorary doctorate recipient proudly displaying her certificate at a WMES graduation ceremony."
  },
  {
    title: "Document Signing",
    category: "CAMPUS",
    src: "/images/media2.jpeg",
    description: "A WMES official signing official documents at his desk."
  },
  {
    title: "Certificate Presentation Handshake",
    category: "EVENTS",
    src: "/images/media3.jpeg",
    description: "Handshake exchange during a certificate presentation at a WMES honorary conferment ceremony."
  },
  {
    title: "Honorary Group Portrait",
    category: "GRADUATION",
    src: "/images/media4.jpeg",
    description: "Honorary doctorate recipients posing with a WMES official after receiving their certificates."
  },
  {
    title: "Conferring of Honour",
    category: "EVENTS",
    src: "/images/media5.jpeg",
    description: "Professor John Ihuoma Nwokike, Chancellor of World Mobile Educational System, conferring honour on Professor John Kennedy Opara."
  },
  {
    title: "Seated Dignitaries",
    category: "EVENTS",
    src: "/images/media6.jpeg",
    description: "Dignitaries seated at the high table during a WMES ceremony."
  },
  {
    title: "Accredited Certificate Award",
    category: "GRADUATION",
    src: "/images/media7.jpeg",
    description: "Certificate presentation to an honorary doctorate recipient at a WMES graduation ceremony."
  },
  {
    title: "Induction Robing Prep",
    category: "EVENTS",
    src: "/images/media8.jpeg",
    description: "An awardee being robed ahead of a WMES induction ceremony."
  },
  {
    title: "Keynote Address at High Table",
    category: "EVENTS",
    src: "/images/media9.jpeg",
    description: "A dignitary addressing the audience at the high table during a WMES event."
  },
  {
    title: "Dignitary Escort",
    category: "EVENTS",
    src: "/images/media10.jpeg",
    description: "Prof. John Ihuoma Nwokike alongside with his security aid for a conference."
  },
  {
    title: "Academic Regalia Group Photo",
    category: "GRADUATION",
    src: "/images/media11.jpeg",
    description: "Group photo of dignitaries in academic regalia at a WMES event."
  },
  {
    title: "Formal Portrait",
    category: "EVENTS",
    src: "/images/media12.jpeg",
    description: "Prof. John Ihuoma Nwokike with awardee Dr. Chioma Amarachi Nwanze."
  },
  {
    title: "Educational Conference Address",
    category: "EVENTS",
    src: "/images/media13.jpeg",
    description: "Prof. John Ihuoma Nwokike addressing the audience in an Educational Conference @ Merit House, Maitama, FCT, Abuja."
  },
  {
    title: "Graduate Presentation",
    category: "GRADUATION",
    src: "/images/media14.jpeg",
    description: "Certificate presentation to a graduate at a WMES academic ceremony."
  },
  {
    title: "Opening Formalities",
    category: "EVENTS",
    src: "/images/media15.jpeg",
    description: "Dignitaries standing at attention during the opening formalities of a WMES ceremony."
  },
  {
    title: "Dignitaries Handshake Exchange",
    category: "EVENTS",
    src: "/images/media16.jpeg",
    description: "Handshake and certificate presentation between two dignitaries at a WMES event."
  },
  {
    title: "Academic Remarks Address",
    category: "EVENTS",
    src: "/images/media17.jpeg",
    description: "A dignitary in academic regalia delivering remarks at a WMES ceremony."
  },
  {
    title: "Addressing the Audience",
    category: "EVENTS",
    src: "/images/media18.jpeg",
    description: "Prof. John Ihuoma Nwokike of WMES addressing the awardee."
  },
  {
    title: "Marketing Manager Appointment",
    category: "EVENTS",
    src: "/images/media19.jpeg",
    description: "Prof. John Ihuoma Nwokike, Chancellor of WMES, presenting an appointment letter to Mr. Ogwudinso Jerry Ugochukwu, Marketing Manager of World Mobile Educational System, Eastern Region."
  },
  {
    title: "National Marketing Manager Appointment",
    category: "EVENTS",
    src: "/images/media20.jpeg",
    description: "Prof. John Ihuoma Nwokike, Chancellor of WMES, presenting an appointment letter to Mrs. Chinelo Margaret Nonwani as the National Marketing Manager of World Mobile Educational System, Eastern Region."
  },
  {
    title: "Marketing Director Appointment",
    category: "EVENTS",
    src: "/images/media21.jpeg",
    description: "Prof. John Ihuoma Nwokike, Chancellor of WMES, presenting an appointment letter to Mr. Mgbadike Okwudili, Marketing Director of World Mobile Educational System, Eastern Region, Enugu."
  }
];

export default function GalleryClient() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="font-body bg-[#020813] text-white min-h-screen">
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
              Explore photography records of academic, operational, and event activities. Click on any image for high-resolution view.
            </p>
          </div>
        </div>

        {/* The Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {galleryItems.map((item, idx) => (
            <div 
              key={idx}
              onClick={() => setSelectedItem(item)}
              className="bg-white/[0.02] border border-white/10 rounded-3xl overflow-hidden flex flex-col justify-between hover:border-blue-sky/40 hover:shadow-lg hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer"
            >
              {/* Media Section */}
              <div className="relative aspect-video bg-white/5 flex items-center justify-center border-b border-white/5 overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  sizes="(max-w-7xl) 33vw"
                />
                <span className="absolute top-3 left-3 bg-[#020813]/80 text-white font-mono text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-white/10">
                  {item.category}
                </span>
              </div>

              {/* Caption Section */}
              <div className="p-6 space-y-2 flex-grow flex flex-col justify-between bg-[#030a12]/30">
                <div>
                  <h3 className="font-display text-base font-bold uppercase tracking-wider text-white leading-snug group-hover:text-blue-sky transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-slate-400 text-xs leading-relaxed mt-2 font-light line-clamp-3">
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

      {/* Modal Popup Preview Overlay */}
      {selectedItem && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 cursor-default animate-fade-in"
          onClick={() => setSelectedItem(null)}
        >
          {/* Modal Container */}
          <div 
            className="bg-[#030a12] border border-white/10 rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl relative animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent close on clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Preview"
            >
              <X size={16} />
            </button>

            {/* Media Box */}
            <div className="w-full aspect-video relative bg-white/5 border-b border-white/10">
              <Image
                src={selectedItem.src}
                alt={selectedItem.title}
                fill
                className="object-contain p-2"
                sizes="(max-w-7xl) 80vw"
                priority
              />
            </div>

            {/* Caption Info Box */}
            <div className="p-6 sm:p-8 space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-sky/15 text-blue-sky font-mono text-[8px] font-bold tracking-widest uppercase px-2.5 py-0.5 rounded-full border border-blue-sky/20">
                  {selectedItem.category}
                </span>
                <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">
                  WMES Press Archive
                </span>
              </div>
              <h3 className="font-display text-xl font-extrabold uppercase tracking-tight text-white leading-tight">
                {selectedItem.title}
              </h3>
              <p className="text-slate-400 text-xs font-light leading-relaxed pt-2 border-t border-white/5">
                {selectedItem.description}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
