"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import { Mail, X } from "lucide-react";

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

// 13 distinct sculptural organic blob geometries
const BLOB_SHAPES = [
  "60% 40% 30% 70% / 60% 30% 70% 40%",
  "38% 62% 63% 37% / 41% 44% 56% 59%",
  "50% 50% 33% 67% / 55% 27% 73% 45%",
  "67% 33% 47% 53% / 37% 58% 42% 63%",
  "30% 70% 70% 30% / 52% 30% 70% 48%",
  "58% 42% 38% 62% / 42% 58% 42% 58%",
  "42% 58% 65% 35% / 63% 45% 55% 37%",
  "70% 30% 52% 48% / 48% 65% 35% 52%",
  "48% 52% 38% 62% / 54% 46% 54% 46%",
  "35% 65% 60% 40% / 45% 55% 45% 55%",
  "62% 38% 44% 56% / 38% 62% 38% 62%",
  "53% 47% 65% 35% / 48% 35% 65% 52%",
  "44% 56% 35% 65% / 58% 42% 58% 42%"
];

function FloatingLeaderBlob({
  member,
  index,
  blobShape,
  containerScrollYProgress,
  onSelect
}: {
  member: Member;
  index: number;
  blobShape: string;
  containerScrollYProgress: any;
  onSelect: (m: Member) => void;
}) {
  const [repel, setRepel] = useState({ x: 0, y: 0, tiltX: 0, tiltY: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Parallax float on scroll:
  // Floats gradually from bottom to top at the speed of the user's scroll
  const floatSpeed = 40 + (index % 4) * 25; // 40px to 115px range
  const rawY = useTransform(containerScrollYProgress, [0, 1], [floatSpeed, -floatSpeed]);
  const smoothScrollY = useSpring(rawY, { stiffness: 65, damping: 20 });

  // Cursor repulsion physics: making way for the cursor to pass
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.hypot(dx, dy);
    const maxDist = rect.width / 2;

    // Repulsion force vector: moves AWAY from cursor (-dx, -dy)
    // Stronger when cursor approaches center
    const ratio = Math.max(0, 1 - dist / (maxDist * 1.3));
    const force = 38 * (0.35 + ratio * 0.65);
    const angle = Math.atan2(dy, dx);
    const pushX = -Math.cos(angle) * force;
    const pushY = -Math.sin(angle) * force;

    // Subtle 3D tilt away from cursor
    const tiltX = (dy / rect.height) * 12;
    const tiltY = -(dx / rect.width) * 12;

    setRepel({ x: pushX, y: pushY, tiltX, tiltY });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRepel({ x: 0, y: 0, tiltX: 0, tiltY: 0 });
  };

  return (
    <motion.div
      style={{ y: smoothScrollY }}
      className={`relative group cursor-pointer w-full max-w-[420px] mx-auto ${
        index % 3 === 1
          ? "sm:translate-y-8 lg:translate-y-14"
          : index % 3 === 2
          ? "sm:-translate-y-4 lg:-translate-y-8"
          : ""
      }`}
      onClick={() => onSelect(member)}
    >
      {/* Interactive Repel Container with Spring Physics */}
      <motion.div
        animate={{
          x: repel.x,
          y: repel.y,
          rotateX: repel.tiltX,
          rotateY: repel.tiltY,
          scale: isHovered ? 1.05 : 1
        }}
        transition={{
          type: "spring",
          stiffness: 240,
          damping: 18,
          mass: 0.6
        }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full aspect-square flex items-center justify-center select-none"
        style={{ perspective: 900 }}
      >
        {/* Ambient Glow behind blob */}
        <div
          className={`absolute -inset-4 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
            isHovered
              ? "opacity-70 bg-blue-500/25"
              : "opacity-20 bg-blue-500/10"
          }`}
        />

        {/* The Sculptural Blob Container */}
        <div
          className="relative w-full h-full overflow-hidden transition-all duration-500 bg-[#060D1A] border border-white/10"
          style={{
            borderRadius: blobShape,
            boxShadow: isHovered
              ? "0 30px 60px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(59, 130, 246, 0.35)"
              : "0 20px 45px -15px rgba(0, 0, 0, 0.65)"
          }}
        >
          {/* Portrait Image */}
          {member.image ? (
            <Image
              src={member.image}
              alt={member.name}
              fill
              className={`object-cover transition-all duration-700 pointer-events-none ${
                isHovered ? "scale-110 brightness-75" : "scale-100 brightness-95"
              } ${
                member.image.includes("staff4") ? "object-top" : "object-center"
              }`}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-slate-500 bg-white/5">
              <span className="font-mono text-[9px] uppercase tracking-widest text-slate-400 font-bold">
                Board Member
              </span>
            </div>
          )}

          {/* Name & Role — ONLY appears when hovered! */}
          <div
            className={`absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 text-center z-20 transition-all duration-300 pointer-events-none ${
              isHovered ? "opacity-100 scale-100" : "opacity-0 scale-90"
            }`}
          >
            {/* Matching Frosted Glass Overlay */}
            <div
              className="absolute inset-0 bg-[#020814]/85 backdrop-blur-md border border-white/20 transition-all"
              style={{ borderRadius: blobShape }}
            />

            {/* Inscribed Info */}
            <div className="relative z-10 space-y-2.5 max-w-[90%] px-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-400 block drop-shadow">
                {member.role}
              </span>
              <h3 className="font-display text-lg sm:text-2xl font-black uppercase tracking-tight text-white leading-tight drop-shadow">
                {member.name}
              </h3>
              <p className="text-xs text-slate-300 font-light line-clamp-2 pt-0.5 hidden sm:block">
                {member.qualifications}
              </p>
              <div className="pt-3 flex items-center justify-center gap-1.5 text-[10px] font-mono text-blue-300 font-bold uppercase tracking-widest">
                <span>View Dossier &rarr;</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function LeadershipClient({ leadershipTeam }: LeadershipClientProps) {
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

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
      {/* Floating Blobs Gallery Container — Increased size 3-column layout */}
      <div
        ref={containerRef}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-14 lg:gap-16 py-12 max-w-6xl mx-auto"
      >
        {leadershipTeam.map((member, index) => (
          <FloatingLeaderBlob
            key={index}
            member={member}
            index={index}
            blobShape={BLOB_SHAPES[index % BLOB_SHAPES.length]}
            containerScrollYProgress={scrollYProgress}
            onSelect={(m) => setSelectedMember(m)}
          />
        ))}
      </div>

      {/* Modal Popup Overlay */}
      <AnimatePresence>
        {selectedMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6 cursor-default"
            onClick={() => setSelectedMember(null)}
          >
            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 15 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="bg-[#030a14] border border-white/10 rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col md:flex-row"
              onClick={(e) => e.stopPropagation()}
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
              <div className="w-full md:w-1/2 aspect-square md:aspect-auto md:min-h-[420px] relative bg-white/5">
                <Image
                  src={selectedMember.image}
                  alt={selectedMember.name}
                  fill
                  className={`object-cover ${
                    selectedMember.image.includes("staff4") ? "object-top" : "object-center"
                  }`}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Content Column */}
              <div className="w-full md:w-1/2 p-8 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="font-mono text-[9px] uppercase tracking-widest text-blue-400 font-bold block">
                    Governing Board Directorate
                  </span>
                  <h3 className="font-display text-2xl font-extrabold uppercase tracking-tight text-white leading-tight">
                    {selectedMember.name}
                  </h3>
                  <p className="text-blue-400 text-xs font-mono uppercase tracking-widest font-semibold">
                    {selectedMember.role}
                  </p>
                  <p className="text-xs text-slate-300 font-light leading-relaxed pt-2">
                    {selectedMember.bio}
                  </p>
                  <div className="pt-2 border-t border-white/5 space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block font-bold">
                      Credentials & Accreditations
                    </span>
                    <p className="text-xs text-slate-400 font-light">
                      {selectedMember.qualifications}
                    </p>
                  </div>
                </div>

                {/* Action Bar */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <a
                    href={`mailto:${selectedMember.email}`}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-mono text-[9px] font-bold uppercase tracking-widest transition-all hover:scale-[1.02] flex items-center gap-1.5"
                  >
                    <Mail size={12} />
                    <span>Contact Director</span>
                  </a>
                </div>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
