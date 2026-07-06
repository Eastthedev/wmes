"use client";

import React, { useActionState } from "react";
import { submitConsultation, FormState } from "@/app/actions/consultation";
import { Loader2, AlertCircle, CheckCircle } from "lucide-react";

const initialState: FormState = {
  success: false,
  error: null,
  message: null,
};

export default function ConsultationForm() {
  const [state, formAction, isPending] = useActionState(submitConsultation, initialState);

  return (
    <div id="request-form" className="bg-[#030a12] bg-dot-grid-dark border border-white/10 rounded-3xl p-8 sm:p-12 text-white scroll-mt-24 shadow-2xl relative overflow-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute right-0 top-0 w-60 h-60 rounded-full bg-blue-primary/10 blur-[80px] pointer-events-none" />

      <div className="mb-10 text-center sm:text-left relative z-10">
        <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full font-bold">
          Book a Consultation
        </span>
        <h3 className="font-display text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-white mt-4 text-glow-gradient">
          Request Consultation
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm mt-2 font-light">
          Submit organizational requirements. Our corporate advisory desk will contact you to structure a contract agreement.
        </p>
      </div>

      <form action={formAction} className="space-y-8 relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Full Name */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-[9px] font-mono uppercase tracking-widest text-slate-450 font-bold">
              Contact Name <span className="text-blue-sky">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              placeholder="Dr. Emeka Okafor"
              className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-[9px] font-mono uppercase tracking-widest text-slate-450 font-bold">
              Email Address <span className="text-blue-sky">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              placeholder="name@company.com"
              className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* Phone */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-[9px] font-mono uppercase tracking-widest text-slate-450 font-bold">
              Phone Number
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+234 (0) 803 123 4567"
              className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
            />
          </div>

          {/* Organization */}
          <div className="space-y-2">
            <label htmlFor="organization" className="block text-[9px] font-mono uppercase tracking-widest text-slate-450 font-bold">
              Organization Name
            </label>
            <input
              id="organization"
              name="organization"
              type="text"
              placeholder="Royal Academy Enugu"
              className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors font-mono"
            />
          </div>
        </div>

        {/* Sector Selection */}
        <div className="space-y-2">
          <label htmlFor="sector" className="block text-[9px] font-mono uppercase tracking-widest text-slate-450 font-bold">
            Consultancy Sector <span className="text-blue-sky">*</span>
          </label>
          <select
            id="sector"
            name="sector"
            required
            defaultValue=""
            className="w-full bg-[#030a12] border-b border-white/15 py-3 text-xs text-white focus:outline-none focus:border-blue-sky transition-colors cursor-pointer font-mono"
          >
            <option value="" disabled className="text-slate-600">Select the required service sector</option>
            <option value="School Contract Management">School Contract Management (K-12 & Tertiary)</option>
            <option value="Educational Advisory">Educational Consultancy & Academic Advisory</option>
            <option value="Hospitality Operations">Hospitality & Recreation Management</option>
            <option value="Fuel Operations">Fuel Station & Gas Plant Management</option>
            <option value="Rehabilitation">Institutional Rehabilitation & Restructuring</option>
            <option value="Vocational Skills">Training & Vocational Skills Acquisition</option>
            <option value="Recruitment">Local & International Recruitment & Placement</option>
            <option value="Project Design">Educational Project Design & Implementation</option>
            <option value="General Management">Business Development, HR & Project Management</option>
            <option value="Investment Facilitation">Industrial Funding & Investment Facilitation</option>
          </select>
        </div>

        {/* Message */}
        <div className="space-y-2">
          <label htmlFor="message" className="block text-[9px] font-mono uppercase tracking-widest text-slate-450 font-bold">
            Project Advisory Scope <span className="text-blue-sky">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            placeholder="Outline current scales, locations, and structural challenges..."
            className="w-full bg-transparent border-b border-white/15 py-3 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-blue-sky transition-colors"
          />
        </div>

        {/* Error Notification */}
        {state.error && (
          <div className="flex items-center gap-3 p-4 bg-red-950/20 border border-red-500/20 rounded-xl text-red-300 text-xs">
            <AlertCircle size={16} className="shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        {/* Success Notification */}
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
          className="w-full flex items-center justify-center gap-2 bg-white hover:bg-slate-100 disabled:bg-white/50 text-navy-ink font-mono uppercase tracking-widest text-xs font-bold py-4 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-sky cursor-pointer hover:scale-[1.01] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
        >
          {isPending ? (
            <>
              <Loader2 size={14} className="animate-spin text-navy-ink" />
              <span>Logging Dossier...</span>
            </>
          ) : (
            <span>Submit Consultation Brief</span>
          )}
        </button>
      </form>
    </div>
  );
}
