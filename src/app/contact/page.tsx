import React from "react";
import ContactForm from "@/components/ContactForm";
import { Mail, Phone, MapPin, Clock, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Registry & Secretariat Contact Desk | WMES",
  description: "Get in touch with the WMES admissions registrar, corporate consultancy Secretariat, or visit our headquarters in Enugu, Nigeria.",
};

export default function Contact() {
  return (
    <div className="font-body bg-[#020813] text-white">
      
      {/* Hero Header - Dark Dot Grid */}
      <section className="bg-dark-tech bg-dot-grid-dark text-white py-24 relative">
        <div className="absolute right-0 top-0 w-80 h-full bg-blue-primary/10 blur-[100px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 relative z-10">
          <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky bg-white/5 px-3.5 py-1.5 rounded-full border border-white/10 w-fit block font-bold">
            Get In Touch
          </span>
          <h1 className="font-display text-4xl sm:text-6xl font-black uppercase tracking-tight text-white mt-4 max-w-3xl leading-none text-glow-gradient">
            Registry & Secretariat
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-4 font-light leading-relaxed">
            Connect with our admissions registrar, corporate consulting secretariat, or visit our regional office in Enugu, Nigeria.
          </p>
        </div>
        
        {/* Layered Overlapping Ribbon */}
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-blue-sky/10 clip-ribbon-stripe z-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 bottom-0 h-10 bg-[#020813] clip-ribbon-base z-1" aria-hidden="true" />
      </section>

      {/* Main Content Grid */}
      <section className="py-24 max-w-7xl mx-auto px-6 sm:px-8 bg-dot-grid-dark">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left Column: Contact details */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Address Details */}
            <div className="space-y-6">
              <span className="font-mono text-[9px] uppercase tracking-widest text-blue-sky font-bold">
                HEAD OFFICE
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-white text-glow-gradient">
                Enugu Headquarters
              </h2>

              
              <ul className="space-y-5">
                <li className="flex items-start gap-3 border-b border-white/5 pb-3">
                  <MapPin className="text-blue-sky shrink-0 mt-1" size={16} />
                  <div>
                    <h4 className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">Physical Address</h4>
                    <p className="text-white text-sm font-semibold mt-0.5">Chika&apos;s Plaza, Centenary City Estate, Enugu, Nigeria</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-3 border-b border-white/5 pb-3">
                  <Phone className="text-blue-sky shrink-0 mt-1" size={16} />
                  <div>
                    <h4 className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">Telephone Lines</h4>
                    <p className="text-white text-sm font-semibold mt-0.5">+234 904 888 8400</p>
                  </div>
                </li>

                <li className="flex items-start gap-3 border-b border-white/5 pb-3">
                  <Mail className="text-blue-sky shrink-0 mt-1" size={16} />
                  <div>
                    <h4 className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">Email Communications</h4>
                    <p className="text-white text-sm font-semibold mt-0.5 hover:text-blue-sky transition-colors">
                      <a href="mailto:info@worldedusystem.com">info@worldedusystem.com</a>
                    </p>
                    <p className="text-slate-400 text-xs mt-1 hover:text-blue-sky transition-colors font-light">
                      Secondary: <a href="mailto:worldmobileedusystem@gmail.com">worldmobileedusystem@gmail.com</a>
                    </p>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="text-blue-sky shrink-0 mt-1" size={16} />
                  <div>
                    <h4 className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">Office Hours (GMT+1)</h4>
                    <p className="text-white text-sm font-semibold mt-0.5">Monday – Friday: 8:00 AM – 5:00 PM</p>
                    <p className="text-slate-450 text-xs mt-0.5 font-light">Saturday: 9:00 AM – 1:00 PM (Admissions Only)</p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Embedded Google Map Frame */}
            <div className="border border-white/10 rounded-3xl overflow-hidden bg-white/[0.02] p-2 shadow-xl hover:border-blue-sky/40 transition-colors">
              <div className="aspect-video w-full rounded-2xl overflow-hidden border border-white/5 bg-white/5 relative">
                <iframe 
                  src="https://maps.google.com/maps?q=Centenary%20City%20Estate%20Enugu&t=&z=14&ie=UTF8&iwloc=&output=embed" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  className="w-full h-full opacity-80 hover:opacity-100 transition-opacity duration-300"
                  title="Chika's Plaza Centenary City Estate Enugu Map"
                />
              </div>
            </div>

          </div>

          {/* Right Column: Contact form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>

        </div>
      </section>

      {/* Security Disclaimer */}
      <section className="bg-white/[0.01] py-12 border-t border-white/5 relative overflow-hidden">
        <div className="absolute left-0 top-0 w-full h-full bg-dot-grid-dark opacity-40 pointer-events-none" />
        
        <div className="max-w-2xl mx-auto text-center px-6 space-y-2 relative z-10">
          <ShieldCheck className="mx-auto text-blue-sky" size={24} />
          <h3 className="font-display text-sm font-bold uppercase tracking-tight text-white">
            Official Inquiry Dispatch Policy
          </h3>
          <p className="text-[9px] font-mono tracking-widest uppercase text-slate-550 leading-relaxed font-bold">
            All general communications logged are routed through the corporate secretary board. Personal data is encrypted and handled in compliance with national privacy guidelines.
          </p>
        </div>
      </section>

    </div>
  );
}
