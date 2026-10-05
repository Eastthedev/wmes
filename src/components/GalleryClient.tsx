"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import Image from "next/image";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
} from "lucide-react";

export type GalleryCategory =
  | "all"
  | "conferments"
  | "convocations"
  | "executive";

export interface GalleryItem {
  id: number;
  title: string;
  category: "conferments" | "convocations" | "executive";
  categoryLabel: string;
  src: string;
  location: string;
  year: string;
  description: string;
  featured?: boolean;
}

export const galleryItems: GalleryItem[] = [
  { id: 0, title: "Conferring of Honour on Rev. Fr. Ejike Mbaka", category: "conferments", categoryLabel: "Honorary Conferment", src: "/images/media0.jpeg", location: "Enugu Directorate", year: "Archive Record", description: "World Mobile Educational System conferring official institutional honour on Rev. Father Ejike Camillus Mbaka in recognition of humanitarian leadership.", featured: true },
  { id: 1, title: "Honorary Doctorate Laureate Presentation", category: "convocations", categoryLabel: "Doctoral Conferment", src: "/images/media1.jpeg", location: "Convocation Hall", year: "Academic Session", description: "An honorary doctorate recipient proudly displaying her official degree scroll and credential at a WMES academic ceremony." },
  { id: 2, title: "Executive Protocol & Document Signing", category: "executive", categoryLabel: "Executive Secretariat", src: "/images/media2.jpeg", location: "Chancellery Secretariat", year: "Administrative Vault", description: "A senior WMES official validating institutional partnership dockets, academic charters, and bilateral training pacts." },
  { id: 3, title: "Certificate Presentation Handshake Exchange", category: "conferments", categoryLabel: "Honorary Assembly", src: "/images/media3.jpeg", location: "Main Auditorium", year: "Honours Assembly", description: "Formal handshake exchange between council executives during an honorary conferment ceremony and award credential handover." },
  { id: 4, title: "Honorary Laureates & Council Portrait", category: "convocations", categoryLabel: "Doctoral Cohort", src: "/images/media4.jpeg", location: "Grand Foyer", year: "Graduation Docket", description: "Distinguished honorary doctorate recipients posing with WMES governing council officers following the conferment rite.", featured: true },
  { id: 5, title: "Conferment of Honour on Prof. John Kennedy Opara", category: "conferments", categoryLabel: "Honorary Conferment", src: "/images/media5.jpeg", location: "Executive Chambers", year: "Special Session", description: "Professor John Ihuoma Nwokike, Chancellor of WMES, presenting the distinguished institutional medal to Professor John Kennedy Opara.", featured: true },
  { id: 6, title: "Governing Council High Table Assembly", category: "executive", categoryLabel: "Council Assembly", src: "/images/media6.jpeg", location: "Convention Hall", year: "Annual Council", description: "Members of the WMES Governing Board and esteemed guests seated at the presiding high table during ceremonial opening formalities." },
  { id: 7, title: "Accredited Vocational Diploma Award", category: "convocations", categoryLabel: "Diploma Conferment", src: "/images/media7.jpeg", location: "Atelier Auditorium", year: "Academic Term", description: "Conferral of accredited professional credentials to an outstanding graduand during the annual institutional graduation." },
  { id: 8, title: "Ceremonial Robing & Investiture Protocol", category: "conferments", categoryLabel: "Investiture Rite", src: "/images/media8.jpeg", location: "Investiture Suite", year: "Induction Docket", description: "An inductee being officially robed in ceremonial academic velvet regalia ahead of the solemn conferment procession." },
  { id: 9, title: "Chancellery Keynote Address", category: "executive", categoryLabel: "Keynote Address", src: "/images/media9.jpeg", location: "Plenary Chamber", year: "National Assembly", description: "High table address articulating WMES institutional development, vocational technology integration, and human resource management." },
  { id: 10, title: "Chancellor Arrival & Diplomatic Escort", category: "executive", categoryLabel: "Official Protocol", src: "/images/media10.jpeg", location: "Conference Pavilion", year: "National Symposium", description: "Prof. John Ihuoma Nwokike accompanied by administrative security escorts arriving for the Educational Leadership Convention." },
  { id: 11, title: "Academic Council in Full Velvet Regalia", category: "convocations", categoryLabel: "Academic Regalia", src: "/images/media11.jpeg", location: "Concourse Plaza", year: "Presiding Senate", description: "Comprehensive group portrait of the Chancellor, deans, and honorary fellows adorned in official academic ceremonial vestments." },
  { id: 12, title: "Honour Portrait with Dr. Chioma Amarachi Nwanze", category: "conferments", categoryLabel: "Honorary Laureate", src: "/images/media12.jpeg", location: "Chancellery Gallery", year: "Laureate Archive", description: "Formal photographic portrait of Chancellor Prof. John Ihuoma Nwokike with distinguished award recipient Dr. Chioma Amarachi Nwanze." },
  { id: 13, title: "National Educational Conference Address", category: "executive", categoryLabel: "National Conference", src: "/images/media13.jpeg", location: "Merit House, Maitama, Abuja", year: "Federal Capital Territory", description: "Prof. John Ihuoma Nwokike delivering the keynote lecture on vocational human resource standardisation at Merit House, Maitama, Abuja.", featured: true },
  { id: 14, title: "Valedictory Presentation to Graduating Trainee", category: "convocations", categoryLabel: "Graduation Award", src: "/images/media14.jpeg", location: "Training Atelier", year: "Vocational Term", description: "Presentation of official completion certificate and trade certification to a certified graduate of the WMES training curriculum." },
  { id: 15, title: "Solemn Opening Ceremonies & National Formalities", category: "executive", categoryLabel: "Ceremonial Opening", src: "/images/media15.jpeg", location: "Assembly Auditorium", year: "Plenary Protocol", description: "Presiding dignitaries, faculty heads, and delegates standing at attention during institutional and national opening protocols." },
  { id: 16, title: "Council Leadership Congratulatory Exchange", category: "conferments", categoryLabel: "Council Exchange", src: "/images/media16.jpeg", location: "Honours Dais", year: "Institutional Awards", description: "Formal congratulations and scroll exchange celebrating milestone operational achievements in regional vocational stewardship." },
  { id: 17, title: "Presiding Senate Academic Address", category: "executive", categoryLabel: "Academic Remarks", src: "/images/media17.jpeg", location: "Symposium Hall", year: "Faculty Assembly", description: "A senior governing dignitary delivering pedagogical remarks on competency-based curriculum development and community impact." },
  { id: 18, title: "Chancellor Exhortation to the Laureates", category: "executive", categoryLabel: "Chancellor Remarks", src: "/images/media18.jpeg", location: "Main Stage", year: "Conferment Plenary", description: "Prof. John Ihuoma Nwokike addressing awardees, highlighting the ethical obligations of scholarship, craft excellence, and community mentorship." },
  { id: 19, title: "Appointment of Regional Marketing Manager", category: "executive", categoryLabel: "Executive Commission", src: "/images/media19.jpeg", location: "Regional Directorate", year: "Eastern Region", description: "Chancellor Prof. John Ihuoma Nwokike presenting the official commission letter to Mr. Ogwudinso Jerry Ugochukwu as Marketing Manager." },
  { id: 20, title: "Commissioning of National Marketing Manager", category: "executive", categoryLabel: "National Directorate", src: "/images/media20.jpeg", location: "Liaison Office", year: "National Expansion", description: "Prof. John Ihuoma Nwokike commissioning Mrs. Chinelo Margaret Nonwani as the National Marketing Manager for World Mobile Educational System." },
  { id: 21, title: "Appointment of Regional Marketing Director", category: "executive", categoryLabel: "Executive Board", src: "/images/media21.jpeg", location: "Regional HQ, Enugu", year: "Executive Gazetting", description: "Official investiture of Mr. Mgbadike Okwudili as Marketing Director of WMES Eastern Region by Chancellor Prof. John Ihuoma Nwokike." },
];



export default function GalleryClient() {
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [heroIndex, setHeroIndex] = useState(0);

  const heroItems = useMemo(() => galleryItems.filter((i) => i.featured), []);

  useEffect(() => {
    const t = setInterval(() => setHeroIndex((p) => (p + 1) % heroItems.length), 5500);
    return () => clearInterval(t);
  }, [heroItems.length]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (!selectedItem) return;
      const idx = galleryItems.findIndex((i) => i.id === selectedItem.id);
      if (idx === -1) return;
      setSelectedItem(galleryItems[(idx + dir + galleryItems.length) % galleryItems.length]);
    },
    [selectedItem]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedItem) return;
      if (e.key === "Escape") setSelectedItem(null);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [selectedItem, navigate]);

  const accent = (cat: GalleryItem["category"]) => {
    if (cat === "conferments") return "text-amber-400 border-amber-500/40 bg-amber-400/10";
    if (cat === "convocations") return "text-emerald-400 border-emerald-500/40 bg-emerald-400/10";
    return "text-sky-400 border-sky-500/40 bg-sky-400/10";
  };

  const col1 = useMemo(() => galleryItems.filter((_, idx) => idx % 4 === 0), []);
  const col2 = useMemo(() => galleryItems.filter((_, idx) => idx % 4 === 1), []);
  const col3 = useMemo(() => galleryItems.filter((_, idx) => idx % 4 === 2), []);
  const col4 = useMemo(() => galleryItems.filter((_, idx) => idx % 4 === 3), []);

  const renderCard = (item: GalleryItem, index: number, colIndex: number) => {
    const tall = (index + colIndex) % 2 === 0;
    return (
      <div
        key={`${item.id}-${index}`}
        onClick={() => setSelectedItem(item)}
        className="group relative overflow-hidden rounded-xl cursor-pointer break-inside-avoid shrink-0 select-none mb-3 sm:mb-4 transition-transform duration-300 hover:scale-[1.02] shadow-lg"
        style={{ aspectRatio: tall ? "3/4" : "4/3", background: "#0c1422" }}
      >
        <Image
          src={item.src}
          alt={item.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />
        {/* Scrim */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: "linear-gradient(to top, rgba(5,10,20,0.92) 0%, rgba(5,10,20,0.3) 60%, transparent 100%)" }}
        />
        {/* Category badge */}
        <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 z-10 pointer-events-none">
          <span className={`px-2 py-0.5 sm:px-2.5 rounded-full font-mono text-[8px] sm:text-[9px] font-bold uppercase tracking-wider border backdrop-blur-sm ${accent(item.category)}`}>
            {item.categoryLabel}
          </span>
        </div>
        {/* Expand icon on hover */}
        <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 flex items-center justify-center shadow-lg">
            <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#050a14]" />
          </div>
        </div>
        {/* Title on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
          <h3 className="font-bold text-white text-xs sm:text-sm leading-snug line-clamp-2">
            {item.title}
          </h3>
          <p className="text-white/40 text-[9px] sm:text-[10px] font-mono mt-0.5 uppercase tracking-wide truncate">{item.location}</p>
        </div>
      </div>
    );
  };

  const activeHero = heroItems[heroIndex];

  return (
    <div className="bg-[#050a14] text-white min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* 1. CINEMATIC HERO */}
      <section className="relative w-full overflow-hidden" style={{ height: "100svh", minHeight: 600, maxHeight: 900 }}>
        {heroItems.map((item, i) => (
          <div
            key={item.id}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover object-center"
              style={{ transform: i === heroIndex ? "scale(1.05)" : "scale(1)", transition: "transform 8s ease-out" }}
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, #050a14 0%, rgba(5,10,20,0.5) 45%, rgba(5,10,20,0.15) 100%)" }} />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to right, rgba(5,10,20,0.75) 0%, transparent 60%)" }} />
          </div>
        ))}

        <div className="absolute inset-0 flex flex-col justify-end z-10 px-6 sm:px-12 lg:px-20 pb-16 sm:pb-20">
          <p className="text-[11px] font-mono uppercase tracking-[0.22em] text-white/40 mb-4">
            World Mobile Educational System — Visual Archive
          </p>
          <h1 className="font-black uppercase leading-[0.9] text-white max-w-3xl" style={{ fontSize: "clamp(2.8rem,8vw,6rem)", letterSpacing: "-0.03em" }}>
            <span className="block">Moments</span>
            <span className="block" style={{ background: "linear-gradient(90deg,#FBBF24,#F59E0B)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              That Matter
            </span>
          </h1>
          <div className="w-14 h-px bg-amber-400/60 my-5" />
          <div className="flex items-start gap-3 max-w-lg">
            <span className={`mt-0.5 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border font-mono shrink-0 ${accent(activeHero.category)}`}>
              {activeHero.categoryLabel}
            </span>
            <p className="text-white/60 text-sm leading-relaxed font-light">{activeHero.title}</p>
          </div>
          <div className="flex items-center gap-2 mt-6">
            {heroItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className="rounded-full transition-all duration-300 cursor-pointer"
                style={{ width: i === heroIndex ? 28 : 8, height: 8, background: i === heroIndex ? "rgba(251,191,36,0.9)" : "rgba(255,255,255,0.2)" }}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </div>


      </section>


      {/* 5. FULL PHOTO GRID (INFINITE 4-COLUMN MARQUEE) */}
      <section className="px-4 sm:px-8 lg:px-16 xl:px-20 py-16 sm:py-20">
        <div className="mb-8 sm:mb-10">
          <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-amber-400 mb-2">All Records</p>
          <h2 className="font-black uppercase text-white" style={{ fontSize: "clamp(2rem,5vw,3.5rem)", letterSpacing: "-0.02em", lineHeight: 1 }}>
            Full Collection
          </h2>
        </div>

        {/* Viewport container with top & bottom edge fade masks */}
        <div className="relative w-full h-[760px] sm:h-[840px] lg:h-[920px] overflow-hidden rounded-2xl border border-white/10 bg-[#040812]">
          {/* Top subtle vignette mask */}
          <div className="absolute inset-x-0 top-0 h-20 sm:h-28 bg-gradient-to-b from-[#040812] via-[#040812]/80 to-transparent z-20 pointer-events-none" />
          
          {/* Bottom subtle vignette mask */}
          <div className="absolute inset-x-0 bottom-0 h-20 sm:h-28 bg-gradient-to-t from-[#040812] via-[#040812]/80 to-transparent z-20 pointer-events-none" />

          {/* 4-Column Grid: Col 1 DOWN, Col 2 UP, Col 3 DOWN, Col 4 UP */}
          <div className="overflow-x-auto h-full scrollbar-none">
            <div className="grid grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5 h-full min-w-[560px] md:min-w-0 p-2.5 sm:p-4 lg:p-5">
              {/* Column 1: DOWN */}
              <div className="relative h-full overflow-hidden">
                <div className="gallery-col-track gallery-col-down-1 flex flex-col will-change-transform">
                  {[...col1, ...col1].map((item, idx) => renderCard(item, idx, 0))}
                </div>
              </div>

              {/* Column 2: UP */}
              <div className="relative h-full overflow-hidden">
                <div className="gallery-col-track gallery-col-up-2 flex flex-col will-change-transform">
                  {[...col2, ...col2].map((item, idx) => renderCard(item, idx, 1))}
                </div>
              </div>

              {/* Column 3: DOWN */}
              <div className="relative h-full overflow-hidden">
                <div className="gallery-col-track gallery-col-down-3 flex flex-col will-change-transform">
                  {[...col3, ...col3].map((item, idx) => renderCard(item, idx, 2))}
                </div>
              </div>

              {/* Column 4: UP */}
              <div className="relative h-full overflow-hidden">
                <div className="gallery-col-track gallery-col-up-4 flex flex-col will-change-transform">
                  {[...col4, ...col4].map((item, idx) => renderCard(item, idx, 3))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. FOOTER */}
      <footer className="px-6 sm:px-12 lg:px-20 pb-16 pt-2 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-4" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <p className="text-white/25 text-[11px] font-mono uppercase tracking-widest">
          © World Mobile Educational System — All Archival Rights Reserved
        </p>
        <p className="text-white/15 text-[10px] font-mono">WMES Registry Press Vault · ARCH-2026</p>
      </footer>

      {/* 7. LIGHTBOX */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          style={{ background: "rgba(0,0,0,0.96)", backdropFilter: "blur(20px)" }}
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative w-full max-w-5xl rounded-2xl overflow-hidden flex flex-col"
            style={{ background: "#0c1422", border: "1px solid rgba(255,255,255,0.1)", maxHeight: "90vh" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3.5 border-b" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <span className={`px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase tracking-wider border ${accent(selectedItem.category)}`}>{selectedItem.categoryLabel}</span>
              <button onClick={() => setSelectedItem(null)} className="w-9 h-9 rounded-full flex items-center justify-center text-white/50 hover:text-white cursor-pointer transition-colors" style={{ background: "rgba(255,255,255,0.05)" }} aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative flex-1 min-h-[300px] sm:min-h-[460px] bg-black flex items-center justify-center overflow-hidden">
              <Image src={selectedItem.src} alt={selectedItem.title} fill className="object-contain p-3 sm:p-8" sizes="95vw" priority />
              <button onClick={(e) => { e.stopPropagation(); navigate(-1); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }} aria-label="Previous">
                <ChevronLeft className="w-6 h-6 text-white" />
              </button>
              <button onClick={(e) => { e.stopPropagation(); navigate(1); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-all" style={{ background: "rgba(0,0,0,0.7)", border: "1px solid rgba(255,255,255,0.15)" }} aria-label="Next">
                <ChevronRight className="w-6 h-6 text-white" />
              </button>
            </div>
            <div className="px-6 py-5 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
              <h3 className="font-black text-white text-lg sm:text-xl leading-tight uppercase tracking-tight mb-1">{selectedItem.title}</h3>
              <p className="text-white/40 text-xs font-mono mb-3">{selectedItem.location} · {selectedItem.year}</p>
              <p className="text-white/60 text-sm font-light leading-relaxed">{selectedItem.description}</p>
              <p className="mt-4 text-white/20 text-[10px] font-mono uppercase tracking-widest">Use ← → to navigate · Esc to close</p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
