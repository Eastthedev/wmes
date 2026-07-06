"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Send, Globe } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    console.log("Newsletter Subscription Email:", email);
    setSubmitted(true);
    setEmail("");
  };

  return (
    <footer className="bg-[#030a12] bg-dot-grid-dark text-white border-t border-white/5 pt-24 pb-12 font-body relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute right-0 bottom-0 w-80 h-80 rounded-full bg-blue-primary/5 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
        
        {/* Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 pb-16 border-b border-white/5">
          
          {/* Column 1: Brand & Description */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5 p-1 focus:outline-none group">
              <div className="relative w-8 h-8 overflow-hidden rounded-md shrink-0">
                <Image
                  src="/images/logo.png"
                  alt="WMES Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-2xl font-black uppercase tracking-tight text-white leading-none group-hover:text-blue-sky transition-colors">
                  WMES
                </span>
                <span className="font-mono text-[8px] tracking-widest text-blue-sky uppercase font-bold mt-0.5 leading-none">
                  Global Management Hub
                </span>
              </div>
            </Link>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm font-light">
              World Mobile Educational System (WMES) delivers contract operations and turnaround governance across schools, hospitality, and energy portfolios.
            </p>
            
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  label: "LinkedIn",
                  url: "#",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin">
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                      <rect width="4" height="12" x="2" y="9"/>
                      <circle cx="4" cy="4" r="2"/>
                    </svg>
                  )
                },
                {
                  label: "Facebook",
                  url: "#",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                    </svg>
                  )
                },
                {
                  label: "Twitter",
                  url: "#",
                  icon: (
                    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-twitter">
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
                    </svg>
                  )
                }
              ].map((item, idx) => (
                <a
                  key={idx}
                  href={item.url}
                  className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 bg-[#05111d] text-slate-400 hover:text-white hover:border-blue-sky/40 hover:bg-white/5 hover:scale-105 transition-all duration-300"
                  aria-label={`Follow WMES on ${item.label}`}
                >
                  {item.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-4 border-b border-white/5 pb-2">
              Corporate Directory
            </h3>
            <ul className="space-y-2.5 text-[10px] font-mono tracking-widest uppercase text-slate-400">
              <li>
                <Link href="/about" className="hover:text-blue-sky transition-colors block py-0.5">
                  About the Group
                </Link>
              </li>
              <li>
                <Link href="/leadership" className="hover:text-blue-sky transition-colors block py-0.5">
                  Academic Faculty
                </Link>
              </li>
              <li>
                <Link href="/partnerships" className="hover:text-blue-sky transition-colors block py-0.5">
                  Affiliations Board
                </Link>
              </li>

              <li>
                <Link href="/gallery" className="hover:text-blue-sky transition-colors block py-0.5">
                  Media Archives
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Management Links */}
          <div>
            <h3 className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-4 border-b border-white/5 pb-2">
              Management Portals
            </h3>
            <div className="space-y-4 text-[10px] font-mono tracking-widest uppercase">
              <div>
                <p className="font-mono text-[8px] tracking-widest text-blue-sky uppercase mb-1.5 font-bold">Corporate Partner</p>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/consultancy" className="hover:text-blue-sky transition-colors block">
                      Consultancy Services
                    </Link>
                  </li>
                  <li>
                    <Link href="/consultancy#request-form" className="hover:text-blue-sky transition-colors block">
                      Request Consultation
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="font-mono text-[8px] tracking-widest text-blue-sky uppercase mb-1.5 font-bold">Academics Candidate</p>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/programmes" className="hover:text-blue-sky transition-colors block">
                      Academic Programmes
                    </Link>
                  </li>
                  <li>
                    <Link href="/admissions" className="hover:text-blue-sky transition-colors block">
                      Admissions Portal
                    </Link>
                  </li>

                </ul>
              </div>
            </div>
          </div>

          {/* Column 4: Contact & Newsletter */}
          <div className="space-y-6">
            <div>
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-3 border-b border-white/5 pb-2">
                Headquarters
              </h3>
              <ul className="space-y-2 text-xs text-slate-400 font-light mb-4">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-blue-sky shrink-0 mt-0.5" />
                  <span>National Centre for Women Development, Central Area, Abuja</span>
                </li>
              </ul>
              
              <h3 className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold mb-3 border-b border-white/5 pb-2">
                Eastern Regional HQ
              </h3>
              <ul className="space-y-2 text-xs text-slate-400 font-light">
                <li className="flex items-start gap-2">
                  <MapPin size={14} className="text-blue-sky shrink-0 mt-0.5" />
                  <span>Chika&apos;s Plaza, Centenary Estate, Enugu</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone size={14} className="text-blue-sky shrink-0" />
                  <span>+234 904 888 8400</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail size={14} className="text-blue-sky shrink-0" />
                  <span>info@worldedusystem.com</span>
                </li>
              </ul>
            </div>

            <div>
              <p className="font-mono text-[8px] tracking-widest text-blue-sky uppercase mb-2 font-bold">Subscribe to Briefings</p>
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Corporate email"
                  required
                  className="bg-[#05111d] border border-white/10 rounded-full px-4 py-2.5 text-xs text-white placeholder-slate-650 focus:outline-none focus:border-blue-sky w-full font-mono transition-colors"
                />
                <button
                  type="submit"
                  className="bg-white hover:bg-slate-100 text-navy-ink px-4 py-2.5 rounded-full text-xs font-mono uppercase font-bold transition-all flex items-center justify-center cursor-pointer hover:scale-[1.03] shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                  aria-label="Subscribe to newsletter"
                >
                  <Send size={12} />
                </button>
              </form>
              {submitted && (
                <p className="text-[9px] text-blue-sky mt-2 font-mono uppercase tracking-widest font-bold">Subscription logged.</p>
              )}
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-12 flex flex-col sm:flex-row justify-between items-center text-[9px] font-mono tracking-widest uppercase text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} World Mobile Educational System (WMES). All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors">
              Terms of Use
            </Link>
            <span className="flex items-center gap-1.5 text-slate-600">
              <Globe size={11} />
              <span>International</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
