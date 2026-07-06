"use client";

import React, { useState } from "react";
import { Eye, Target, Award, X, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AboutCards() {
  const [activeModal, setActiveModal] = useState<"vision" | "mission" | null>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* 1. Vision Card */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveModal("vision")}
          className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.1)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-blue-sky/5 blur-[30px] pointer-events-none" />
          
          <div className="text-blue-sky">
            <Eye size={26} />
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white border-b border-white/5 pb-2">
            Our Vision
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
            To become a globally recognized centre of excellence in education, research, innovation, leadership development, and professional consultancy...
          </p>
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-blue-sky font-bold group-hover:text-white transition-colors pt-2">
            Read full vision &rarr;
          </span>
        </motion.div>

        {/* 2. Mission Card */}
        <motion.div
          whileHover={{ y: -4 }}
          onClick={() => setActiveModal("mission")}
          className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.1)] transition-all duration-300 cursor-pointer group relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-blue-sky/5 blur-[30px] pointer-events-none" />
          
          <div className="text-blue-sky">
            <Target size={26} />
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white border-b border-white/5 pb-2">
            Our Mission
          </h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed font-light line-clamp-3">
            World Mobile Educational System (WMES) is committed to delivering high-quality, accessible, and innovative education that meets international standards...
          </p>
          <span className="inline-block text-[10px] font-mono uppercase tracking-widest text-blue-sky font-bold group-hover:text-white transition-colors pt-2">
            Read full mission &rarr;
          </span>
        </motion.div>

        {/* 3. Motto Card */}
        <div
          className="bg-white/[0.02] border border-white/10 p-8 rounded-3xl space-y-4 hover:border-blue-sky/40 hover:shadow-[0_0_30px_rgba(111,168,220,0.1)] transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute right-0 top-0 w-24 h-24 rounded-full bg-blue-sky/5 blur-[30px] pointer-events-none" />
          
          <div className="text-blue-sky">
            <Award size={26} />
          </div>
          <h3 className="font-display text-xl font-bold uppercase tracking-tight text-white border-b border-white/5 pb-2">
            WMES Motto
          </h3>
          <p className="text-slate-200 text-sm sm:text-base leading-relaxed font-semibold italic text-glow-gradient">
            &quot;Knowledge, Innovation and Global Excellence.&quot;
          </p>
        </div>

      </div>

      {/* Modal Popup overlay */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#020813]/90 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-[#030a12] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl text-white overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Radial glow header */}
              <div className="absolute left-1/4 -top-20 w-80 h-80 rounded-full bg-blue-primary/10 blur-[80px] pointer-events-none" />

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 text-white transition-colors focus:outline-none cursor-pointer"
                aria-label="Close modal"
              >
                <X size={16} />
              </button>

              <div className="overflow-y-auto space-y-6 pr-2 mt-4 flex-grow relative z-10 scrollbar-thin">
                
                {/* Vision Details */}
                {activeModal === "vision" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
                        <Eye size={18} />
                      </div>
                      <div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Institutional Vision</h4>
                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white text-glow-gradient">Our Vision</h3>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-light">
                      To become a globally recognized centre of excellence in education, research, innovation, leadership development, and professional consultancy, empowering individuals and institutions to create sustainable solutions and make meaningful contributions to society through knowledge, integrity, and service.
                    </p>
                  </div>
                )}

                {/* Mission Details */}
                {activeModal === "mission" && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                      <div className="w-10 h-10 rounded-full bg-blue-sky/15 flex items-center justify-center text-blue-sky">
                        <Target size={18} />
                      </div>
                      <div>
                        <h4 className="font-mono text-[9px] uppercase tracking-widest text-slate-400">Operational Mandates</h4>
                        <h3 className="font-display text-2xl font-bold uppercase tracking-tight text-white text-glow-gradient">Our Mission</h3>
                      </div>
                    </div>
                    
                    <p className="text-slate-400 text-xs font-mono uppercase tracking-widest font-bold">
                      World Mobile Educational System (WMES) is committed to:
                    </p>
                    
                    <ul className="space-y-3.5">
                      {[
                        "Delivering high-quality, accessible, and innovative education that meets international standards.",
                        "Developing competent, ethical, and visionary leaders through academic excellence and practical training.",
                        "Providing professional consultancy services in education, business, hospitality, human resource management, institutional development, and related sectors.",
                        "Promoting research, innovation, entrepreneurship, and technological advancement to address local and global challenges.",
                        "Building strategic partnerships with educational institutions, governments, industries, and international organizations to foster knowledge exchange and sustainable development.",
                        "Equipping learners and professionals with the skills, values, and confidence required to excel in a rapidly changing global environment.",
                        "Encouraging lifelong learning, inclusiveness, diversity, integrity, accountability, and social responsibility in all our programmes and activities.",
                        "Contributing to national and global development by producing graduates, professionals, and leaders who positively impact their communities and the world."
                      ].map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                          <CheckCircle2 size={16} className="text-blue-sky shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}



              </div>

              {/* Modal Footer */}
              <div className="mt-8 pt-4 border-t border-white/5 flex justify-end">
                <button
                  onClick={closeModal}
                  className="bg-white text-navy-ink px-6 py-2.5 rounded-full text-xs font-mono uppercase tracking-widest font-bold hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
                >
                  Close Address
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
