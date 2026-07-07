"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Mail, GraduationCap, X } from "lucide-react";

interface Member {
  name: string;
  role: string;
  qualifications: string;
  email: string;
  bio: string;
  image: string;
}

interface LeadershipClientProps {
  leadershipTeam: Member[];
}

export default function LeadershipClient({ leadershipTeam }: LeadershipClientProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  // Close modal on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedMember(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {leadershipTeam.map((member, index) => (
          <div 
            key={index}
            onClick={() => setSelectedMember(member)}
            className="bg-white/[0.02] border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:shadow-xl hover:border-blue-sky/40 hover:bg-white/[0.04] transition-all duration-300 group cursor-pointer"
          >
            <div>
              {/* Photo Container */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 border border-white/5 bg-white/5 relative">
                {member.image ? (
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className={`object-cover group-hover:scale-[1.03] transition-transform duration-300 ${
                      member.image.includes("staff4") ? "object-top" : "object-center"
                    }`}
                    sizes="(max-w-7xl) 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-500">
                    <span className="font-mono text-[8px] uppercase tracking-widest text-slate-500 font-bold">
                      Board Member
                    </span>
                  </div>
                )}
              </div>

              <h3 className="font-display text-lg font-bold uppercase tracking-wider text-white leading-snug">
                {member.name}
              </h3>
              <p className="text-blue-sky text-xs font-mono uppercase tracking-widest font-bold mb-3 mt-1">
                {member.role}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-blue-sky uppercase tracking-widest font-bold">
              <span className="hover:text-white flex items-center gap-1.5">
                <Mail size={11} />
                <span>View Profile</span>
              </span>
              <span className="text-[8px] text-slate-500 font-bold">Board Member</span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Popup Overlay */}
      {selectedMember && (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 cursor-default"
          onClick={() => setSelectedMember(null)}
        >
          {/* Modal Container */}
          <div 
            className="bg-[#030a12] border border-white/10 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row animate-scale-in"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close Modal"
            >
              <X size={16} />
            </button>

            {/* Photo Column */}
            <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[400px] relative bg-white/5">
              <Image
                src={selectedMember.image}
                alt={selectedMember.name}
                fill
                className={`object-cover ${
                  selectedMember.image.includes("staff4") ? "object-top" : "object-center"
                }`}
                sizes="(max-w-7xl) 50vw"
                priority
              />
            </div>

            {/* Content Column */}
            <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky font-bold block">
                  Governing Board
                </span>
                <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white leading-tight">
                  {selectedMember.name}
                </h3>
                <p className="text-blue-sky text-xs font-mono uppercase tracking-widest font-bold">
                  {selectedMember.role}
                </p>
              </div>

              {/* Action Bar */}
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <a 
                  href={`mailto:${selectedMember.email}`}
                  className="px-6 py-2.5 bg-white hover:bg-slate-100 text-navy-ink rounded-full font-mono text-[9px] font-bold uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center gap-1.5"
                >
                  <Mail size={12} />
                  <span>Contact Director</span>
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
