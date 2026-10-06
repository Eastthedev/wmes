"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Eye,
  EyeOff,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  X,
  Send,
  HelpCircle,
  ShieldCheck,
  UserPlus,
  ArrowRight,
  Lock,
  Mail,
  KeyRound,
  RotateCcw,
} from "lucide-react";

interface Slide {
  id: number;
  image: string;
  tagline: string;
  subtitle: string;
  badge: string;
}

const slides: Slide[] = [
  {
    id: 0,
    image: "/images/login-slide-tailoring-1.jpg",
    tagline: "Learn the Craft.\nMaster the Needle.",
    subtitle:
      "Hands-on tailoring training with industry-grade equipment in a fully equipped modern atelier.",
    badge: "TAILORING & FASHION DESIGN",
  },
  {
    id: 1,
    image: "/images/login-slide-tailoring-2.jpg",
    tagline: "Stitch by Stitch.\nSkill by Skill.",
    subtitle:
      "Develop expert-level embroidery, garment construction, and pattern making skills from certified tutors.",
    badge: "VOCATIONAL CRAFT EXCELLENCE",
  },
  {
    id: 2,
    image: "/images/login-slide-tailoring-3.jpg",
    tagline: "Train Together.\nGrow Together.",
    subtitle:
      "Join a vibrant community of fashion and tailoring students in WMES accredited vocational classrooms.",
    badge: "WMES TRAINING INSTITUTE",
  },
  {
    id: 3,
    image: "/images/login-slide-tailoring-4.jpg",
    tagline: "Certified.\nReady for the World.",
    subtitle:
      "Graduate with an accredited WMES certificate and the skills to build a thriving tailoring career.",
    badge: "ACCREDITED GRADUATION",
  },
];

export default function LoginClient() {
  const router = useRouter();

  // Slider state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Portal form flow state
  const [loginStep, setLoginStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  // OTP Verification state
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(45);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Dialog modals
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [forgotSent, setForgotSent] = useState(false);

  // Sign Up Modal State & OTP verification
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [signupStep, setSignupStep] = useState<"form" | "otp">("form");
  const [signupName, setSignupName] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupNameError, setSignupNameError] = useState("");
  const [signupEmailError, setSignupEmailError] = useState("");
  const [isSendingSignupOtp, setIsSendingSignupOtp] = useState(false);
  const [isVerifyingSignupOtp, setIsVerifyingSignupOtp] = useState(false);
  const [signupOtpDigits, setSignupOtpDigits] = useState<string[]>([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [signupOtpError, setSignupOtpError] = useState("");
  const [signupResendCountdown, setSignupResendCountdown] = useState(45);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const signupOtpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  // Signup OTP Resend Countdown Timer
  useEffect(() => {
    if (signupStep !== "otp" || !showSignUpModal || signupResendCountdown <= 0) return;
    const timer = setInterval(() => {
      setSignupResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [signupStep, showSignUpModal, signupResendCountdown]);

  const handleOpenSignUpModal = () => {
    setSignupStep("form");
    setSignupName("");
    setSignupEmail("");
    setSignupNameError("");
    setSignupEmailError("");
    setSignupOtpError("");
    setSignupOtpDigits(["", "", "", "", "", "", "", ""]);
    setSignupSuccess(false);
    setShowSignUpModal(true);
  };

  const handleCloseSignUpModal = () => {
    setShowSignUpModal(false);
    setSignupStep("form");
    setSignupOtpDigits(["", "", "", "", "", "", "", ""]);
    setSignupOtpError("");
    setSignupSuccess(false);
  };

  /** Step 1: Validate name/email and send verification OTP */
  const handleStartSignup = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    let hasError = false;

    if (!signupName.trim()) {
      setSignupNameError("Please enter your full name");
      hasError = true;
    } else {
      setSignupNameError("");
    }

    if (!signupEmail.trim() || !/\S+@\S+\.\S+/.test(signupEmail)) {
      setSignupEmailError("Please enter a valid email address");
      hasError = true;
    } else {
      setSignupEmailError("");
    }

    if (hasError) return;

    setIsSendingSignupOtp(true);
    setSignupEmailError("");
    setSignupOtpError("");

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail.trim() }),
      });

      const data = await res.json();
      setIsSendingSignupOtp(false);

      if (!res.ok || !data.success) {
        setSignupEmailError(data.error || "Failed to dispatch verification code.");
        return;
      }

      setSignupOtpDigits(["", "", "", "", "", "", "", ""]);
      setSignupStep("otp");
      setSignupResendCountdown(45);
      setSignupOtpError("");
      setTimeout(() => {
        signupOtpInputRefs.current[0]?.focus();
      }, 150);
    } catch (_e) {
      setIsSendingSignupOtp(false);
      setSignupEmailError("Network error. Please check your connection.");
    }
  };

  /** Handle digit changes in signup OTP inputs */
  const handleSignupOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...signupOtpDigits];
    newDigits[index] = digit;
    setSignupOtpDigits(newDigits);
    if (signupOtpError) setSignupOtpError("");

    if (digit && index < 7) {
      signupOtpInputRefs.current[index + 1]?.focus();
    }
  };

  const handleSignupOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !signupOtpDigits[index] && index > 0) {
      signupOtpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleSignupOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;
    const newDigits = [...signupOtpDigits];
    for (let i = 0; i < 8; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setSignupOtpDigits(newDigits);
    if (signupOtpError) setSignupOtpError("");
    const nextEmpty = newDigits.findIndex((d) => !d);
    if (nextEmpty !== -1) {
      signupOtpInputRefs.current[nextEmpty]?.focus();
    } else {
      signupOtpInputRefs.current[7]?.focus();
    }
  };

  const handleResendSignupOtp = async () => {
    if (signupResendCountdown > 0 || isSendingSignupOtp) return;
    setIsSendingSignupOtp(true);
    setSignupOtpError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: signupEmail.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSignupResendCountdown(45);
        setSignupOtpDigits(["", "", "", "", "", "", "", ""]);
        setTimeout(() => {
          signupOtpInputRefs.current[0]?.focus();
        }, 100);
      } else {
        setSignupOtpError(data.error || "Failed to resend code. Please try again.");
      }
    } catch (_e) {
      setSignupOtpError("Network error. Please try again.");
    } finally {
      setIsSendingSignupOtp(false);
    }
  };

  /** Step 2: Verify OTP and create/activate user profile */
  const handleVerifySignupAndCreate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = signupOtpDigits.join("").trim();
    if (fullCode.length < 6) {
      setSignupOtpError("Please enter the verification code");
      return;
    }

    setSignupOtpError("");
    setIsVerifyingSignupOtp(true);

    try {
      // 1. Verify OTP against Supabase / auth_otps
      const verifyRes = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: signupEmail.trim(),
          code: fullCode,
          name: signupName.trim(),
        }),
      });

      const verifyData = await verifyRes.json();
      if (!verifyRes.ok || !verifyData.success) {
        setIsVerifyingSignupOtp(false);
        setSignupOtpError(verifyData.error || "Invalid or expired verification code.");
        return;
      }

      // 2. Ensure user registered in profiles with full name & student ID
      let finalUser = verifyData.user;
      try {
        const regRes = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: signupName.trim(),
            email: signupEmail.trim(),
          }),
        });
        const regData = await regRes.json();
        if (regRes.ok && regData.success && regData.user) {
          finalUser = regData.user;
        }
      } catch (_e) {}

      // 3. Save session in localStorage
      try {
        localStorage.setItem("wmes_session", JSON.stringify(finalUser));
      } catch (_e) {}

      setIsVerifyingSignupOtp(false);
      setSignupSuccess(true);

      setTimeout(() => {
        setShowSignUpModal(false);
        router.push("/dashboard?new=true");
      }, 1000);
    } catch (_e) {
      setIsVerifyingSignupOtp(false);
      setSignupOtpError("Network connection error. Please try again.");
    }
  };

  // Auto-advance slides
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, nextSlide]);

  // Resend Countdown Timer
  useEffect(() => {
    if (loginStep !== "otp" || resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [loginStep, resendCountdown]);

  // Step 1: Send OTP to email
  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();

    if (!email.trim()) {
      setEmailError("Email address is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      return;
    }

    setEmailError("");
    setIsSendingOtp(true);

    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      setIsSendingOtp(false);

      if (!res.ok || !data.success) {
        setEmailError(data.error || "Failed to generate access code.");
        return;
      }

      setOtpDigits(["", "", "", "", "", "", "", ""]);
      setLoginStep("otp");
      setResendCountdown(45);
      setOtpError("");
      setTimeout(() => {
        otpInputRefs.current[0]?.focus();
      }, 100);
    } catch (_e) {
      setIsSendingOtp(false);
      setEmailError("Network connection error. Please try again.");
    }
  };

  // Step 2: Handle individual OTP input changes
  const handleOtpChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, "").slice(-1);
    const newDigits = [...otpDigits];
    newDigits[index] = digit;
    setOtpDigits(newDigits);
    if (otpError) setOtpError("");

    if (digit && index < 7) {
      otpInputRefs.current[index + 1]?.focus();
    }
  };

  // Handle Backspace navigation
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  // Handle Paste full OTP
  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 8);
    if (!pasted) return;
    const newDigits = [...otpDigits];
    for (let i = 0; i < 8; i++) {
      newDigits[i] = pasted[i] || "";
    }
    setOtpDigits(newDigits);
    if (otpError) setOtpError("");
    const nextEmpty = newDigits.findIndex((d) => !d);
    if (nextEmpty !== -1) {
      otpInputRefs.current[nextEmpty]?.focus();
    } else {
      otpInputRefs.current[7]?.focus();
    }
  };

  // Resend OTP code — real call to Supabase signInWithOtp
  const handleResendOtp = async () => {
    if (resendCountdown > 0) return;
    setIsSendingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setResendCountdown(45);
        setOtpDigits(["", "", "", "", "", "", "", ""]);
      } else {
        setOtpError(data.error || "Failed to resend code. Please try again.");
      }
    } catch (_e) {
      setOtpError("Network error. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Verify OTP submission against Supabase auth_otps
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullCode = otpDigits.join("");
    if (fullCode.length < 8) {
      setOtpError("Please enter the complete 8-digit code");
      return;
    }

    setOtpError("");
    setIsVerifyingOtp(true);

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          code: fullCode,
        }),
      });

      const data = await res.json();
      setIsVerifyingOtp(false);

      if (!res.ok || !data.success) {
        setOtpError(data.error || "Invalid or expired access code.");
        return;
      }

      // Persist active verified session
      try {
        localStorage.setItem("wmes_session", JSON.stringify(data.user));
      } catch (_e) {}

      setLoginSuccess(true);
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    } catch (_e) {
      setIsVerifyingOtp(false);
      setOtpError("Network connection error. Please try again.");
    }
  };


  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-[#FFFFFF] text-slate-900 overflow-x-hidden font-body">
      
      {/* ══════════════════════════════════════════════════════════
          LEFT SIDE: CINEMATIC SLIDER (50% on desktop, 100vh)
      ═══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Image Showcase Slider"
        className="relative w-full lg:w-1/2 h-[420px] sm:h-[500px] lg:h-screen bg-[#070D18] select-none overflow-hidden shrink-0 group/slider"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Animated Background Slides */}
        <AnimatePresence initial={false} mode="wait">
          <motion.div
            key={slides[currentSlide].id}
            initial={{ opacity: 0, scale: 1.06 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slides[currentSlide].image}
              alt={slides[currentSlide].tagline.replace("\n", " ")}
              fill
              priority
              className="object-cover object-center"
            />
            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#020813] via-[#020813]/40 to-[#020813]/25" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/30" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
          </motion.div>
        </AnimatePresence>

        {/* Top Header: Brand Logo & Navigation */}
        <div className="absolute top-0 left-0 right-0 z-20 p-6 sm:p-8 lg:p-10 flex items-center justify-between">
          <Link
            href="/"
            className="group inline-flex items-center gap-3 focus:outline-none"
            aria-label="Return to WMES Homepage"
          >
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-lg overflow-hidden bg-black/40 backdrop-blur-md p-1 border border-white/15 group-hover:border-white/40 transition-all shadow-lg">
              <Image
                src="/images/logo.png"
                alt="WMES Logo"
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex flex-col">
              <span className="font-display text-sm sm:text-base font-black tracking-wider uppercase text-white leading-none group-hover:text-blue-300 transition-colors">
                WMES
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/60 font-semibold mt-0.5">
                Global Portal
              </span>
            </div>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/15 text-white/80 hover:text-white text-xs font-mono tracking-wider transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Back to website</span>
          </Link>
        </div>

        {/* Left / Right Slider Arrows (Visible on hover) */}
        <div className="hidden lg:flex absolute inset-y-0 left-4 right-4 z-20 items-center justify-between pointer-events-none opacity-0 group-hover/slider:opacity-100 transition-opacity duration-300">
          <button
            onClick={prevSlide}
            aria-label="Previous slide"
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            aria-label="Next slide"
            className="pointer-events-auto w-10 h-10 rounded-full bg-black/40 hover:bg-black/70 backdrop-blur-md text-white/80 hover:text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer hover:scale-105 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Bottom Content: Tagline, Description & Progress Bars */}
        <div className="absolute bottom-0 left-0 right-0 z-20 p-6 sm:p-10 lg:p-14 flex flex-col justify-end">
          <AnimatePresence mode="wait">
            <motion.div
              key={slides[currentSlide].id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45 }}
              className="max-w-xl"
            >
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-mono uppercase tracking-[0.18em] text-white/80 font-bold mb-3">
                <ShieldCheck className="w-2.5 h-2.5 text-blue-300" />
                <span>{slides[currentSlide].badge}</span>
              </div>

              {/* Bold Slogan */}
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.08] whitespace-pre-line drop-shadow-md">
                {slides[currentSlide].tagline}
              </h1>

              {/* Subtitle */}
              <p className="mt-3 text-sm sm:text-base text-white/80 font-light leading-relaxed max-w-lg drop-shadow">
                {slides[currentSlide].subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Slider Pagination Indicator Bars */}
          <div
            role="tablist"
            aria-label="Slide indicators"
            className="flex items-center gap-2.5 mt-8"
          >
            {slides.map((slide, idx) => {
              const isActive = idx === currentSlide;
              return (
                <button
                  key={slide.id}
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                    isActive
                      ? "w-10 sm:w-14 bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]"
                      : "w-3 sm:w-4 bg-white/40 hover:bg-white/70"
                  }`}
                />
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════
          RIGHT SIDE: AUTHENTICATION PORTAL (50% on desktop)
      ═══════════════════════════════════════════════════════════ */}
      <section
        aria-label="Login Portal"
        className="relative w-full lg:w-1/2 min-h-[calc(100vh-420px)] lg:min-h-screen flex flex-col justify-between p-6 sm:p-10 lg:p-14 bg-white relative overflow-hidden"
      >
        {/* Subtle Watermark Graphic Backdrop matching screenshot */}
        <div className="absolute right-0 top-1/4 w-[500px] h-[500px] pointer-events-none opacity-[0.03] select-none">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-slate-900">
            <path d="M44.7,-76.4C58.8,-69.2,71.8,-59.1,79.6,-45.8C87.4,-32.6,90,-16.3,88.5,-0.9C86.9,14.6,81.2,29.1,72.6,41.4C64,53.7,52.6,63.7,39.4,70.9C26.3,78,11.3,82.4,-3.2,87.9C-17.7,93.4,-31.6,100,-43.3,95.7C-55,91.3,-64.5,76.1,-72.1,61.7C-79.6,47.3,-85.2,33.7,-87.3,19.6C-89.4,5.5,-88,-9.2,-82.7,-22.3C-77.4,-35.4,-68.2,-46.9,-56.3,-54.6C-44.4,-62.3,-29.8,-66.2,-15.4,-74.4C-1.1,-82.5,13.1,-94.9,28.2,-91.7C43.3,-88.4,59.3,-69.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Top Bar: Sign Up Callout */}
        <div className="w-full flex items-center justify-between text-xs sm:text-sm font-medium text-slate-600 mb-8">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-mono tracking-wider uppercase text-[11px] text-slate-500 font-semibold">
              SSL Encrypted
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span>Don&apos;t have an account yet?</span>
            <button
              onClick={handleOpenSignUpModal}
              className="text-[#EB3449] hover:text-[#D92D41] font-bold hover:underline cursor-pointer transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Center: Main Form Container */}
        <div className="w-full max-w-[430px] mx-auto my-auto py-4">
          {/* STEP 1: EMAIL ENTRY FORM */}
          {loginStep === "email" ? (
            <div>
              {/* Header Title with Avatar Icon */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                  <User className="w-5 h-5 fill-current" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Sign In
                </h2>
              </div>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mb-6">
                Enter your registered email address to receive an instant one-time login code (OTP).
              </p>

              {/* Form Card with Soft Rose Tint matching reference */}
              <div className="bg-[#FFF5F6] border border-[#FFE2E6] rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(235,52,73,0.03)]">
                <form onSubmit={handleSendOtp} noValidate className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-xs font-semibold text-slate-800 mb-1.5"
                    >
                      Email Address
                    </label>
                    <div className="relative">
                      <input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        placeholder="e.g. user@worldedusystem.com"
                        autoComplete="email"
                        className={`w-full pl-3.5 pr-10 py-2.5 sm:py-3 bg-white rounded-lg border text-sm text-slate-900 placeholder:text-slate-400 transition-all focus:outline-none ${
                          emailError
                            ? "border-[#EB3449] ring-1 ring-[#EB3449]/30"
                            : "border-slate-300 focus:border-[#EB3449] focus:ring-2 focus:ring-[#EB3449]/15"
                        }`}
                      />
                      <Mail className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                    {emailError && (
                      <p className="text-xs text-[#EB3449] font-medium mt-1.5 flex items-center gap-1">
                        {emailError}
                      </p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSendingOtp}
                      className="w-full py-3 px-4 rounded-lg bg-[#E53935] hover:bg-[#D32F2F] text-white font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-red-500/20 active:scale-[0.99]"
                    >
                      {isSendingOtp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Dispatching Login Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Login Code</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          ) : (
            /* STEP 2: 6-DIGIT OTP VERIFICATION */
            <div>
              {/* Back to change email button */}
              <button
                type="button"
                onClick={() => setLoginStep("email")}
                className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium mb-5 group cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                <span>Change email ({email})</span>
              </button>

              {/* Header Title with Security Icon */}
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                  Enter Verification Code
                </h2>
              </div>

              <p className="text-slate-500 text-xs sm:text-sm font-normal mb-6 leading-relaxed">
                We have sent a 8-digit one-time code to{" "}
                <span className="font-semibold text-slate-800">{email}</span>. Please enter it below to gain access.
              </p>

              {/* OTP Form Card */}
              <div className="bg-[#FFF5F6] border border-[#FFE2E6] rounded-2xl p-6 sm:p-7 shadow-[0_4px_25px_rgba(235,52,73,0.03)]">
                <form onSubmit={handleVerifyOtp} noValidate className="space-y-5">
                  <div>
                    <label className="block text-xs font-semibold text-slate-800 mb-2.5 text-center">
                      8-Digit Security Code
                    </label>

                    {/* Segmented 8 OTP Input Boxes */}
                    <div className="flex items-center justify-center gap-1 sm:gap-2">
                      {otpDigits.map((digit, idx) => (
                        <input
                          key={idx}
                          ref={(el) => {
                            otpInputRefs.current[idx] = el;
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(idx, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                          onPaste={handleOtpPaste}
                          className={`w-8 h-10 sm:w-11 sm:h-12 md:w-12 md:h-14 text-center font-mono font-black text-sm sm:text-lg md:text-xl rounded-lg sm:rounded-xl border bg-white text-slate-900 shadow-sm transition-all focus:outline-none ${
                            otpError
                              ? "border-[#EB3449] ring-2 ring-[#EB3449]/20"
                              : digit
                              ? "border-slate-800 ring-1 ring-slate-800/10"
                              : "border-slate-300 focus:border-[#EB3449] focus:ring-2 focus:ring-[#EB3449]/20"
                          }`}
                        />
                      ))}
                    </div>

                    {otpError && (
                      <p className="text-xs text-[#EB3449] font-medium mt-2 text-center">
                        {otpError}
                      </p>
                    )}
                  </div>

                  {/* Resend Code Section */}
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-red-100/60 text-slate-500">
                    <span>Didn&apos;t get the code?</span>
                    {resendCountdown > 0 ? (
                      <span className="font-mono text-[11px] text-slate-400">
                        Resend in {resendCountdown}s
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={handleResendOtp}
                        className="text-[#EB3449] hover:underline font-bold cursor-pointer transition-colors"
                      >
                        Resend code now
                      </button>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isVerifyingOtp || loginSuccess}
                    className={`w-full py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 shadow-sm active:scale-[0.99] ${
                      loginSuccess
                        ? "bg-emerald-600 text-white"
                        : "bg-[#E53935] hover:bg-[#D32F2F] text-white hover:shadow-md hover:shadow-red-500/20"
                    }`}
                  >
                    {isVerifyingOtp ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Verifying Security Code...</span>
                      </>
                    ) : loginSuccess ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Access Granted · Redirecting...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>Verify & Gain Access</span>
                      </>
                    )}
                  </button>
                </form>

                {/* Success Toast */}
                <AnimatePresence>
                  {loginSuccess && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                      exit={{ opacity: 0, height: 0 }}
                      className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-xs text-emerald-800 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <div>
                        <span className="font-bold">Identity Confirmed!</span> Loading your dashboard...
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}

        </div>

        {/* Bottom Footer: Corporate Copyright & Links */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-slate-400 gap-2 pt-6 border-t border-slate-100">
          <p>© {new Date().getFullYear()} WMES Hub</p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="hover:text-slate-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-slate-600 transition-colors">
              Support Desk
            </Link>
          </div>
        </div>

        {/* Floating Action Button (Settings / Help Support) in Bottom Right */}
        <div className="fixed bottom-6 right-6 z-40">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowHelpTooltip(!showHelpTooltip)}
              className="w-12 h-12 rounded-full bg-[#EB3449] hover:bg-[#D92D41] text-white flex items-center justify-center shadow-lg shadow-red-500/30 transition-transform hover:scale-105 active:scale-95 cursor-pointer"
              aria-label="Open support and settings help"
            >
              <HelpCircle className="w-6 h-6" />
            </button>

            {/* Help Popup */}
            <AnimatePresence>
              {showHelpTooltip && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 8 }}
                  className="absolute bottom-14 right-0 w-72 bg-white rounded-xl shadow-2xl border border-slate-200 p-4 text-slate-800"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-red-100 text-[#EB3449] flex items-center justify-center">
                        <HelpCircle className="w-3.5 h-3.5" />
                      </div>
                      <h4 className="font-bold text-xs text-slate-900">Portal Support</h4>
                    </div>
                    <button
                      onClick={() => setShowHelpTooltip(false)}
                      className="text-slate-400 hover:text-slate-600 cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                    Having trouble accessing your student portal? Contact the registry desk.
                  </p>
                  <div className="space-y-1.5 text-[10px] font-mono text-slate-500 border-t border-slate-100 pt-2">
                    <div>Abuja HQ: +234 904 888 8400</div>
                    <div>Email: support@worldedusystem.com</div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </section>

      {/* ══════════════════════════════════════════════════════════
          FORGOT PASSWORD MODAL
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showForgotModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setShowForgotModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10"
            >
              <button
                onClick={() => setShowForgotModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full bg-red-100 text-[#EB3449] flex items-center justify-center mb-3">
                <Lock className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Reset your password
              </h3>
              <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                Enter your registered corporate email and we&apos;ll send you an encrypted authentication link to reset your credentials.
              </p>

              {forgotSent ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 text-xs text-emerald-800 space-y-2">
                  <div className="flex items-center gap-2 font-bold">
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span>Reset Link Dispatched</span>
                  </div>
                  <p>
                    Instructions sent to <strong>{forgotEmail}</strong>. Please verify your inbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotSent(false);
                      setShowForgotModal(false);
                    }}
                    className="mt-2 text-emerald-700 font-bold underline hover:text-emerald-900 cursor-pointer"
                  >
                    Return to login
                  </button>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!forgotEmail) return;
                    setForgotSent(true);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Account Email
                    </label>
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="e.g. user@worldedusystem.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-[#EB3449] focus:bg-white"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-lg bg-[#EB3449] hover:bg-[#D92D41] text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-red-500/20"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Reset Instructions</span>
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════
          SIGN UP / ONBOARDING MODAL
      ═══════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════
          SIGN UP / ONBOARDING MODAL WITH 2-STEP OTP VERIFICATION
      ═══════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {showSignUpModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={handleCloseSignUpModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10"
            >
              <button
                onClick={handleCloseSignUpModal}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-5 h-5" />
              </button>

              {signupSuccess ? (
                /* SUCCESS STATE */
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">
                    Email Verified!
                  </h3>
                  <p className="text-sm text-slate-600 mb-6">
                    Welcome to WMES, <span className="font-semibold text-slate-900">{signupName}</span>. Your account has been verified and registered. Redirecting to your dashboard...
                  </p>
                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <div className="w-3.5 h-3.5 border-2 border-[#EB3449] border-t-transparent rounded-full animate-spin" />
                    <span>Launching portal...</span>
                  </div>
                </div>
              ) : signupStep === "form" ? (
                /* STEP 1: NAME & EMAIL */
                <div>
                  <div className="w-10 h-10 rounded-full bg-red-100 text-[#EB3449] flex items-center justify-center mb-3">
                    <UserPlus className="w-5 h-5" />
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-1">
                    Create an Account
                  </h3>
                  <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                    Fill in your details to register. A verification code will be sent to your email to confirm validity before accessing the dashboard.
                  </p>

                  <form onSubmit={handleStartSignup} noValidate>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          value={signupName}
                          onChange={(e) => {
                            setSignupName(e.target.value);
                            if (signupNameError) setSignupNameError("");
                          }}
                          placeholder="e.g. Chidi Okonkwo"
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                            signupNameError
                              ? "border-[#EB3449] ring-1 ring-[#EB3449]/20"
                              : "border-slate-300 focus:border-[#EB3449]"
                          }`}
                        />
                        {signupNameError && (
                          <p className="text-xs text-[#EB3449] mt-1 font-medium">
                            {signupNameError}
                          </p>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                          Email Address <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          value={signupEmail}
                          onChange={(e) => {
                            setSignupEmail(e.target.value);
                            if (signupEmailError) setSignupEmailError("");
                          }}
                          placeholder="yourname@example.com"
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white transition-all ${
                            signupEmailError
                              ? "border-[#EB3449] ring-1 ring-[#EB3449]/20"
                              : "border-slate-300 focus:border-[#EB3449]"
                          }`}
                        />
                        {signupEmailError && (
                          <p className="text-xs text-[#EB3449] mt-1 font-medium">
                            {signupEmailError}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSendingSignupOtp}
                      className="w-full py-3 px-4 rounded-xl bg-[#EB3449] hover:bg-[#D92D41] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/25 transition-all mb-4 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSendingSignupOtp ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Sending Verification Code...</span>
                        </>
                      ) : (
                        <>
                          <span>Continue to Verification</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                    <span className="text-xs text-slate-500">
                      Already registered?
                    </span>
                    <button
                      type="button"
                      onClick={handleCloseSignUpModal}
                      className="text-xs font-bold text-[#EB3449] hover:underline cursor-pointer"
                    >
                      Log in to your account →
                    </button>
                  </div>
                </div>
              ) : (
                /* STEP 2: OTP VERIFICATION */
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      setSignupStep("form");
                      setSignupOtpError("");
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 font-medium mb-4 group cursor-pointer transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    <span>Change details ({signupEmail})</span>
                  </button>

                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-[#E53935] text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
                      <KeyRound className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        Verify Your Email
                      </h3>
                      <p className="text-xs text-slate-500">
                        Step 2 of 2: Security Verification
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs sm:text-sm mb-5 leading-relaxed">
                    We sent an 8-digit verification code to{" "}
                    <span className="font-semibold text-slate-800">{signupEmail}</span>. Enter it below to activate your account.
                  </p>

                  <div className="bg-[#FFF5F6] border border-[#FFE2E6] rounded-2xl p-5 sm:p-6 mb-4">
                    <form onSubmit={handleVerifySignupAndCreate} noValidate className="space-y-4">
                      <div>
                        <label className="block text-xs font-semibold text-slate-800 mb-2 text-center">
                          Verification Code
                        </label>

                        <div className="flex items-center justify-center gap-1 sm:gap-2">
                          {signupOtpDigits.map((digit, idx) => (
                            <input
                              key={idx}
                              ref={(el) => {
                                signupOtpInputRefs.current[idx] = el;
                              }}
                              type="text"
                              inputMode="numeric"
                              maxLength={1}
                              value={digit}
                              onChange={(e) => handleSignupOtpChange(idx, e.target.value)}
                              onKeyDown={(e) => handleSignupOtpKeyDown(idx, e)}
                              onPaste={handleSignupOtpPaste}
                              className={`w-8 h-10 sm:w-10 sm:h-12 text-center font-mono font-black text-sm sm:text-xl rounded-lg sm:rounded-xl border bg-white text-slate-900 shadow-sm transition-all focus:outline-none ${
                                signupOtpError
                                  ? "border-[#EB3449] ring-2 ring-[#EB3449]/20"
                                  : digit
                                  ? "border-slate-800 ring-1 ring-slate-800/10"
                                  : "border-slate-300 focus:border-[#EB3449] focus:ring-2 focus:ring-[#EB3449]/20"
                              }`}
                            />
                          ))}
                        </div>

                        {signupOtpError && (
                          <p className="text-xs text-[#EB3449] font-medium mt-2 text-center">
                            {signupOtpError}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center justify-between text-xs pt-2 border-t border-red-100/60 text-slate-500">
                        <span>Didn&apos;t get the code?</span>
                        {signupResendCountdown > 0 ? (
                          <span className="font-mono text-[11px] text-slate-400">
                            Resend in {signupResendCountdown}s
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleResendSignupOtp}
                            disabled={isSendingSignupOtp}
                            className="text-[#EB3449] hover:underline font-bold cursor-pointer transition-colors"
                          >
                            {isSendingSignupOtp ? "Resending..." : "Resend Code"}
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isVerifyingSignupOtp}
                        className="w-full py-3 px-4 rounded-xl bg-[#EB3449] hover:bg-[#D92D41] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-500/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isVerifyingSignupOtp ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Verifying & Accessing Portal...</span>
                          </>
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify & Access User Dashboard</span>
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
