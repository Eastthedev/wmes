"use client";

import React, { useState, useEffect } from "react";
import { Sun, Moon, X, Sparkles } from "lucide-react";

export default function ThemePrompt() {
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Trigger on every load
    setShowPrompt(true);
  }, []);

  const selectTheme = (theme: "dark" | "light") => {
    const root = document.documentElement;
    if (theme === "light") {
      root.classList.add("light-theme");
    } else {
      root.classList.remove("light-theme");
    }
    setShowPrompt(false);
  };

  if (!showPrompt) return null;

  return (
    <div 
      className="fixed top-24 right-6 sm:right-8 z-[9999] max-w-[280px] w-full bg-[#030a12] border border-white/10 rounded-2xl p-4 shadow-2xl animate-scale-in modal-exclude cursor-default"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Background radial glow */}
      <div className="absolute right-0 top-0 w-24 h-24 bg-blue-primary/10 rounded-full blur-2xl pointer-events-none" />

      {/* Close button */}
      <button
        onClick={() => setShowPrompt(false)}
        className="absolute top-3 right-3 w-5 h-5 rounded-full border border-white/5 bg-white/5 flex items-center justify-center text-slate-500 hover:text-white transition-colors cursor-pointer"
        aria-label="Dismiss theme selector"
      >
        <X size={10} />
      </button>

      {/* Title */}
      <div className="flex items-center gap-1.5 mb-2.5">
        <Sparkles size={11} className="text-blue-sky animate-pulse" />
        <span className="font-mono text-[8px] uppercase tracking-widest text-blue-sky font-bold">
          Display Theme
        </span>
      </div>

      <p className="text-[11px] text-slate-355 font-light leading-snug mb-3.5">
        Customize your layout theme. Switch to Light or keep Dark mode.
      </p>

      {/* Toggle Buttons */}
      <div className="grid grid-cols-2 gap-2">
        {/* Dark Pill */}
        <button
          onClick={() => selectTheme("dark")}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-white/10 bg-white/[0.01] hover:bg-white/5 hover:border-white/20 transition-all text-[10px] font-mono uppercase tracking-wider text-slate-300 hover:text-white cursor-pointer font-bold"
        >
          <Moon size={11} className="text-blue-sky" />
          <span>Dark</span>
        </button>

        {/* Light Pill */}
        <button
          onClick={() => selectTheme("light")}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-white/10 bg-white/[0.01] hover:bg-white/5 hover:border-white/20 transition-all text-[10px] font-mono uppercase tracking-wider text-slate-300 hover:text-white cursor-pointer font-bold"
        >
          <Sun size={11} className="text-yellow-500" />
          <span>Light</span>
        </button>
      </div>
    </div>
  );
}
