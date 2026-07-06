"use client";

import React, { useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface DisclosureCardProps {
  title: string;
  summary: string;
  whatCovers: string;
  whatsIncluded: string[];
  whoFor: string;
  index: number;
}

export default function DisclosureCard({
  title,
  summary,
  whatCovers,
  whatsIncluded,
  whoFor,
  index,
}: DisclosureCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div 
      className={`border-b border-white/5 last:border-0 transition-all duration-300 ${
        isOpen ? "bg-white/[0.03] px-4 sm:px-6 rounded-2xl border-transparent" : "hover:bg-white/[0.01] px-4 sm:px-6 rounded-2xl border-white/5"
      }`}
    >
      {/* Header Row Button */}
      <button
        onClick={handleToggle}
        aria-expanded={isOpen}
        aria-controls={`disclosure-panel-${index}`}
        id={`disclosure-button-${index}`}
        className="w-full text-left py-6 flex justify-between items-center gap-6 focus:outline-none cursor-pointer group"
      >
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Index Counter - Glowing Circular Ring */}
          <span className={`w-8 h-8 rounded-full flex items-center justify-center font-mono text-xs font-bold transition-all duration-300 shrink-0 ${
            isOpen 
              ? "bg-blue-primary text-white ring-2 ring-blue-sky/40 shadow-[0_0_15px_rgba(111,168,220,0.4)]" 
              : "bg-white/5 text-slate-400 ring-1 ring-white/10 group-hover:border-blue-sky group-hover:text-blue-sky"
          }`}>
            {index + 1 < 10 ? `0${index + 1}` : index + 1}
          </span>
          <div className="space-y-1">
            <h3 className={`font-display text-lg sm:text-xl font-bold uppercase tracking-wider transition-colors duration-300 ${
              isOpen ? "text-blue-sky" : "text-white group-hover:text-blue-sky"
            }`}>
              {title}
            </h3>
            <p className="text-slate-400 text-[11px] sm:text-xs font-body font-normal leading-relaxed max-w-3xl font-light">
              {summary}
            </p>
          </div>
        </div>
        <div className="shrink-0">
          <div className={`w-6 h-6 rounded-full border border-white/10 flex items-center justify-center transition-all duration-300 ${
            isOpen ? "border-blue-sky/40 bg-blue-sky/10 text-blue-sky" : "text-slate-400 group-hover:text-white group-hover:border-white/20"
          }`}>
            <ChevronDown 
              size={12} 
              className={`transition-transform duration-300 ${
                isOpen ? "rotate-180" : ""
              }`} 
            />
          </div>
        </div>
      </button>

      {/* Accordion Content animated with Framer Motion */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`disclosure-panel-${index}`}
            role="region"
            aria-labelledby={`disclosure-button-${index}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pl-12 pr-4 sm:pl-14 pb-8 grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
              
              {/* Column 1: Scope */}
              <div className="md:col-span-2 space-y-4">
                <div className="space-y-2">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">
                    Service Scope & Diagnostics
                  </span>
                  <p className="text-slate-350 text-xs sm:text-sm leading-relaxed font-light">
                    {whatCovers}
                  </p>
                </div>
                
                {/* Target Audience */}
                <div className="pt-4 border-t border-white/5 flex items-center gap-3">
                  <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky bg-blue-sky/10 px-2 py-0.5 rounded border border-blue-sky/20 font-bold">TARGET AUDIENCE</span>
                  <span className="text-white text-xs font-semibold">{whoFor}</span>
                </div>
              </div>

              {/* Column 2: Inclusions List */}
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 space-y-4 shadow-sm hover:border-blue-sky/40 transition-colors duration-300">
                <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold block">
                  Service Inclusions
                </span>
                <ul className="space-y-2.5">
                  {whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-slate-300 text-xs font-light leading-snug">
                      <div className="w-4.5 h-4.5 rounded-full bg-blue-sky/10 border border-blue-sky/25 flex items-center justify-center text-blue-sky shrink-0 mt-0.5">
                        <Check size={9} className="stroke-[3]" />
                      </div>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
