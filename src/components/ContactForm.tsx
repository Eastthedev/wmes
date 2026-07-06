"use client";

import React, { useActionState } from "react";
import { submitContact, ContactFormState } from "@/app/actions/contact";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const initialState: ContactFormState = {
  success: false,
  error: null,
  message: null,
};

export default function ContactForm() {
  const [state, formAction, isPending] = useActionState(submitContact, initialState);

  return (
    <div className="bg-[#030a12] bg-dot-grid-dark border border-white/10 rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute right-0 top-0 w-60 h-60 rounded-full bg-blue-primary/10 blur-[80px] pointer-events-none" />

      <div className="mb-8 relative z-10">
        <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full font-bold">
          Send Us a Message
        </span>
        <h3 className="font-display text-3xl font-extrabold uppercase tracking-tight text-white mt-4 text-glow-gradient">
          General Inquiry
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-1 font-light">
          Are you seeking general info, partnerships, or school placements? Complete the dispatch docket below.
        </p>
      </div>

      <form action={formAction} className="space-y-6 relative z-10">
        
        {/* Name */}
        <div className="space-y-2">
          <label htmlFor="name" className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            Contact Name <span className="text-blue-sky">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="e.g. Obinna Nze"
            className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label htmlFor="email" className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            Email Address <span className="text-blue-sky">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="obinna@company.com"
            className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <label htmlFor="subject" className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            Subject Matter <span className="text-blue-sky">*</span>
          </label>
          <input
            id="subject"
            name="subject"
            type="text"
            required
            placeholder="Academic Placement / Affiliation"
            className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
          />
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-[9px] font-mono uppercase tracking-widest text-slate-400 font-bold">
            Dossier Scope <span className="text-blue-sky">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Provide context for our administrative registry team..."
            className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors"
          />
        </div>

        {/* Error alert */}
        {state.error && (
          <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Success alert */}
        {state.success && state.message && (
          <div className="flex items-center gap-3 p-4 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-emerald-300 text-xs font-mono uppercase tracking-wider">
            <CheckCircle size={16} className="shrink-0 text-blue-sky" />
            <span>{state.message}</span>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 disabled:bg-white/50 text-navy-ink font-mono uppercase tracking-widest text-xs font-bold py-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-sky cursor-pointer hover:scale-[1.01] shadow-sm"
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin text-navy-ink" />
              <span>Dispatching...</span>
            </>
          ) : (
            <span>Dispatch general Inquiry</span>
          )}
        </button>

      </form>
    </div>
  );
}
