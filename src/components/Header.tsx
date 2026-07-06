"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown, Building2, GraduationCap } from "lucide-react";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [prevPath, setPrevPath] = useState(pathname);
  if (pathname !== prevPath) {
    setPrevPath(pathname);
    setIsOpen(false);
    setActiveDropdown(null);
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name);
  };

  const handleKeyDown = (event: React.KeyboardEvent, name: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleDropdown(name);
    }
  };

  return (
    <div className="sticky top-0 z-50 w-full flex justify-center px-4 sm:px-6 pt-4">
      <header className="w-full max-w-7xl h-16 rounded-full bg-[#030a12]/80 border border-white/10 backdrop-blur-md text-white shadow-xl flex items-center justify-between px-6 transition-all duration-300">
        
        {/* Brand/Logo */}
        <Link 
          href="/" 
          className="flex items-center gap-2.5 focus:outline-none p-1 shrink-0 group"
          aria-label="WMES Home"
        >
          <div className="relative w-7 h-7 overflow-hidden rounded-md shrink-0">
            <Image
              src="/images/logo.png"
              alt="WMES Logo"
              fill
              className="object-contain"
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-base sm:text-lg font-black uppercase tracking-tight text-white leading-none group-hover:text-blue-sky transition-colors">
              WMES
            </span>
            <span className="font-mono text-[6px] sm:text-[7px] uppercase tracking-widest text-blue-sky mt-0.5 leading-none font-bold">
              GLOBAL MANAGEMENT HUB
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-6 font-body font-normal" ref={dropdownRef}>
          
          {/* Dropdown 1: Institutions */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("institutions")}
              onKeyDown={(e) => handleKeyDown(e, "institutions")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                activeDropdown === "institutions" || pathname.startsWith("/consultancy") 
                  ? "bg-white/15 text-white border-blue-sky/50 shadow-[0_0_12px_rgba(111,168,220,0.2)]" 
                  : "text-slate-300 hover:text-white border-white/5 bg-white/5 hover:border-white/20"
              }`}
              aria-expanded={activeDropdown === "institutions"}
              aria-haspopup="true"
            >
              <Building2 size={10} className="text-blue-sky" />
              <span>For Institutions</span>
              <ChevronDown size={10} className={`transition-transform duration-250 ${activeDropdown === "institutions" ? "rotate-180" : ""}`} />
            </button>
            
            {activeDropdown === "institutions" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl shadow-2xl bg-[#030a12]/95 border border-white/10 p-3 z-50 animate-fade-in-up">
                <div className="font-mono text-[8px] tracking-widest text-slate-500 uppercase border-b border-white/5 pb-1.5 mb-2 px-2">Corporate Advisory</div>
                <div className="flex flex-col gap-1">
                  <Link 
                    href="/consultancy" 
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors block border border-transparent hover:border-white/5"
                  >
                    <div className="text-xs font-semibold text-white">Consultancy Divisions</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-light">Explore our 10 contract management & turnaround sectors.</div>
                  </Link>
                  <Link 
                    href="/consultancy#request-form" 
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors block border border-transparent hover:border-white/5"
                  >
                    <div className="text-xs font-semibold text-white">Book Consultation</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-light">Submit organizational briefs to our executive team.</div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Dropdown 2: Students */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("students")}
              onKeyDown={(e) => handleKeyDown(e, "students")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-mono tracking-widest uppercase transition-all duration-300 border cursor-pointer ${
                activeDropdown === "students" || pathname.startsWith("/programmes") || pathname.startsWith("/admissions") 
                  ? "bg-white/15 text-white border-blue-sky/50 shadow-[0_0_12px_rgba(111,168,220,0.2)]" 
                  : "text-slate-300 hover:text-white border-white/5 bg-white/5 hover:border-white/20"
              }`}
              aria-expanded={activeDropdown === "students"}
              aria-haspopup="true"
            >
              <GraduationCap size={10} className="text-blue-sky" />
              <span>For Students</span>
              <ChevronDown size={10} className={`transition-transform duration-250 ${activeDropdown === "students" ? "rotate-180" : ""}`} />
            </button>

            {activeDropdown === "students" && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-3 w-80 rounded-2xl shadow-2xl bg-[#030a12]/95 border border-white/10 p-3 z-50 animate-fade-in-up">
                <div className="font-mono text-[8px] tracking-widest text-slate-500 uppercase border-b border-white/5 pb-1.5 mb-2 px-2">Academics Registry</div>
                <div className="flex flex-col gap-1">
                  <Link 
                    href="/programmes" 
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors block border border-transparent hover:border-white/5"
                  >
                    <div className="text-xs font-semibold text-white">Academic Programmes</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-light">Nursery-Secondary curriculum and Professional vocational certificates.</div>
                  </Link>
                  <Link 
                    href="/admissions" 
                    className="p-2 rounded-xl hover:bg-white/5 transition-colors block border border-transparent hover:border-white/5"
                  >
                    <div className="text-xs font-semibold text-white">Admissions & Guidelines</div>
                    <div className="text-[10px] text-slate-400 mt-0.5 font-light">Entry requirements, tuition listings, and registration FAQs.</div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Standard Navigation Link tags */}
          <div className="flex items-center gap-5 text-[10px] font-mono uppercase tracking-widest text-slate-300">
            {[
              { label: "About", path: "/about" },
              { label: "Leadership", path: "/leadership" },
              { label: "Affiliates", path: "/partnerships" },
              { label: "Gallery", path: "/gallery" },
              { label: "Contact", path: "/contact" }
            ].map((link) => (
              <Link 
                key={link.label}
                href={link.path}
                className={`transition-colors hover:text-white ${
                  pathname === link.path ? "text-blue-sky font-semibold" : ""
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

        </nav>

        {/* Consultation CTA Pill */}
        <Link
          href="/consultancy#request-form"
          className="hidden lg:inline-block px-5 py-2 text-[10px] font-mono uppercase tracking-widest bg-white hover:bg-slate-100 text-navy-ink rounded-full font-bold transition-all hover:scale-[1.03] shadow-[0_0_15px_rgba(255,255,255,0.15)]"
        >
          Consult Form
        </Link>

        {/* Mobile menu toggle */}
        <div className="flex lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-full hover:bg-white/5 text-white cursor-pointer"
            aria-expanded={isOpen}
            aria-label="Toggle navigation menu"
          >
            {isOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </header>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-4 right-4 bg-[#030a12]/95 border border-white/10 rounded-2xl p-6 space-y-4 shadow-2xl lg:hidden animate-fade-in-up">
          <div className="space-y-1">
            <p className="font-mono text-[9px] tracking-widest text-slate-500 uppercase px-3">Business Pathways</p>
            <Link href="/consultancy" className="block px-3 py-1.5 text-sm font-medium hover:text-blue-sky transition-colors">
              Consultancy Services
            </Link>
            <Link href="/consultancy#request-form" className="block px-3 py-1.5 text-sm font-medium hover:text-blue-sky transition-colors">
              Request Consultation
            </Link>
          </div>

          <div className="space-y-1">
            <p className="font-mono text-[9px] tracking-widest text-slate-500 uppercase px-3">Academic Pathways</p>
            <Link href="/programmes" className="block px-3 py-1.5 text-sm font-medium hover:text-blue-sky transition-colors">
              Academic Programmes
            </Link>
            <Link href="/admissions" className="block px-3 py-1.5 text-sm font-medium hover:text-blue-sky transition-colors">
              Enrollment & Tuition
            </Link>
          </div>

          <div className="space-y-1 border-t border-white/5 pt-3">
            <p className="font-mono text-[9px] tracking-widest text-slate-500 uppercase px-3">Directory</p>
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs font-mono uppercase tracking-wider px-3 text-slate-300">
              <Link href="/about" className="py-1 hover:text-white">About Us</Link>
              <Link href="/leadership" className="py-1 hover:text-white">Leadership</Link>
              <Link href="/partnerships" className="py-1 hover:text-white">Partnerships</Link>
              <Link href="/gallery" className="py-1 hover:text-white">Gallery</Link>
              <Link href="/contact" className="py-1 hover:text-white">Contact</Link>
            </div>
          </div>

          <div className="pt-4 px-3">
            <Link
              href="/consultancy#request-form"
              className="block w-full text-center py-2.5 bg-white text-navy-ink hover:bg-slate-100 rounded-full text-xs font-mono uppercase tracking-widest font-bold transition-all"
            >
              Consultation Form
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
