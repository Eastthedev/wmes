"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  FileText,
  CreditCard,
  ClipboardList,
  ShieldCheck,
  LogOut,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  TrendingUp,
  UserCheck,
  AlertCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  Menu,
  Check,
  ExternalLink,
  Eye,
  Filter,
  ArrowUpRight,
  SlidersHorizontal,
  Copy,
  Lock,
  Calendar,
  Phone,
  Mail,
  Building,
  GraduationCap,
  Sparkles,
  User,
  MapPin,
  Award,
  Scissors,
  BookOpen,
  Video,
  ArrowRight,
} from "lucide-react";
import ScholarshipsTab from "./ScholarshipsTab";
import AuditTrailTab from "./AuditTrailTab";
import SessionsTab from "./SessionsTab";

/* ─────────────────────────────────
   TYPES
───────────────────────────────── */
type AdminTab =
  | "overview"
  | "students"
  | "applications"
  | "payments"
  | "scholarships"
  | "sessions"
  | "submissions"
  | "audit"
  | "validation";

interface StatsData {
  totalStudents: number;
  totalRevenue: number;
  pendingApplications: number;
  totalApplications: number;
  verifiedProfiles: number;
  recentSignups: number;
  totalTransactions?: number;
  paidTransactions?: number;
  pendingTransactions?: number;
  failedTransactions?: number;
  paymentSuccessRate?: number;
  formFeesRevenue?: number;
  tuitionRevenue?: number;
  avgTransactionValue?: number;
  pendingProfiles?: number;
  rejectedProfiles?: number;
  kycVerificationRate?: number;
  trackDistribution?: Record<string, number>;
  approvedApplications?: number;
  rejectedApplications?: number;
  admissionApprovalRate?: number;
  centreDistribution?: Record<string, number>;
  totalFormSubmissions?: number;
}

interface StudentUser {
  id: string;
  matric_no: string;
  name: string;
  email: string;
  phone?: string;
  role?: string;
  track?: string;
  verification_status?: string;
  registry_hub?: string;
  created_at: string;
}

interface ApplicationItem {
  id: string;
  form_no: string;
  full_name: string;
  email: string;
  phone: string;
  gender?: string;
  dob?: string;
  age?: string;
  address?: string;
  education?: string;
  nin_number?: string;
  sponsor_name?: string;
  sponsor_type?: string;
  preferred_centre?: string;
  matric_no?: string;
  passport_photo_url?: string;
  status: "Pending" | "Submitted" | "Approved" | "Rejected";
  raw_data?: any;
  created_at: string;
}

interface TransactionItem {
  id: string;
  matric_no: string;
  description: string;
  amount: number;
  status: "Paid" | "Pending" | "Failed";
  reference?: string;
  method?: string;
  receipt_no?: string;
  created_at: string;
}

interface SubmissionItem {
  id: string;
  matric_no?: string;
  form_type?: string;
  type?: string;
  submitted_by?: string;
  name?: string;
  payload?: any;
  created_at: string;
}

/* ─────────────────────────────────
   CURRENCY & DATE FORMATTERS
───────────────────────────────── */
const fmtNGN = (n: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(n);

const fmtDate = (s: string) => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return s;
  }
};

const fmtDateTime = (s: string) => {
  if (!s) return "—";
  try {
    return new Date(s).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return s;
  }
};

/* ─────────────────────────────────
   STATUS BADGE COMPONENT
───────────────────────────────── */
function StatusBadge({ status }: { status?: string }) {
  const s = (status || "").toLowerCase();
  if (s === "paid" || s === "verified" || s === "approved") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
        {status || "Verified"}
      </span>
    );
  }
  if (s === "pending" || s === "submitted") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
        {status || "Pending"}
      </span>
    );
  }
  if (s === "failed" || s === "rejected") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/80">
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
        {status || "Rejected"}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
      {status || "—"}
    </span>
  );
}

/* ─────────────────────────────────
   ADMIN AUTH SCREEN (TWO-SECTION SPLIT LAYOUT)
───────────────────────────────── */
interface AdminOfficeSlide {
  id: number;
  image: string;
  alt: string;
}

const adminOfficeSlides: AdminOfficeSlide[] = [
  {
    id: 0,
    image: "/images/admin-slide-1.jpg",
    alt: "Super Administrator Office",
  },
  {
    id: 1,
    image: "/images/admin-slide-2.jpg",
    alt: "Secretariat & Admissions Office",
  },
];

function AdminAuthScreen({
  onUnlock,
}: {
  onUnlock: (role: "super_admin" | "secretary", email?: string) => void;
  initialRole?: "super_admin" | "secretary";
}) {
  // Slider State (2 sliding administrative pictures)
  const [currentSlide, setCurrentSlide] = useState(0);

  // OTP State - Starts completely empty with no prefilled details
  const [otpStep, setOtpStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [otpDigits, setOtpDigits] = useState<string[]>(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [countdown, setCountdown] = useState(0);

  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-advance the 2 slides every 5.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === 0 ? 1 : 0));
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  // Countdown timer for resending OTP
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Handle Requesting OTP Code
  const handleSendOtp = async (isResend = false) => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/\S+@\S+\.\S+/.test(cleanEmail)) {
      setError("Please provide a valid administrative email address.");
      return;
    }

    setLoading(true);
    setError("");
    setNotice("");

    try {
      const res = await fetch("/api/admin/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });
      const data = await res.json();

      if (data.success) {
        setOtpStep("code");
        setCountdown(60);
        setNotice(
          isResend
            ? `New security code sent to ${cleanEmail}.`
            : `A 6-digit verification code has been dispatched to ${cleanEmail}. Check your inbox.`
        );
        setOtpDigits(["", "", "", "", "", ""]);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 150);
      } else {
        setError(data.error || "Failed to dispatch verification code.");
      }
    } catch {
      setError("Network connection error. Please verify your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle OTP digit changes
  const handleOtpDigitChange = (index: number, val: string) => {
    const clean = val.replace(/\D/g, "").slice(-1);
    const next = [...otpDigits];
    next[index] = clean;
    setOtpDigits(next);
    setError("");

    if (clean && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
    }

    if (next.every(Boolean) && next.join("").length === 6) {
      verifyOtpCode(next.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;

    const next = ["", "", "", "", "", ""];
    for (let i = 0; i < pasted.length; i++) {
      next[i] = pasted[i];
    }
    setOtpDigits(next);
    if (pasted.length === 6) {
      verifyOtpCode(pasted);
    } else {
      otpInputRefs.current[pasted.length]?.focus();
    }
  };

  const verifyOtpCode = async (codeToVerify?: string) => {
    const code = codeToVerify || otpDigits.join("");
    if (code.length < 6) {
      setError("Please enter the complete 6-digit security code.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();

      if (data.success) {
        const detectedRole = data.role === "secretary" ? "secretary" : "super_admin";
        sessionStorage.setItem("wmes_admin_unlocked", "1");
        sessionStorage.setItem("wmes_admin_role", detectedRole);
        sessionStorage.setItem("wmes_admin_email", data.email);
        onUnlock(detectedRole, data.email);
      } else {
        setError(data.error || "Invalid or expired security code.");
        setOtpDigits(["", "", "", "", "", ""]);
        setTimeout(() => otpInputRefs.current[0]?.focus(), 50);
      }
    } catch {
      setError("Network connection error. Please verify your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070D18] flex flex-col lg:flex-row text-white font-body selection:bg-amber-500 selection:text-slate-950 overflow-x-hidden">
      {/* ─── SECTION 1: SLIDING ADMINISTRATIVE OFFICE SHOWCASE (LEFT) ─── */}
      <div className="relative w-full lg:w-1/2 min-h-[380px] lg:min-h-screen bg-[#070D18] overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10">
        {/* Top Left: JUST THE LOGO */}
        <div className="absolute top-6 left-6 sm:top-10 sm:left-10 z-30 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-2xl bg-black/50 backdrop-blur-md border border-white/20 p-2 flex items-center justify-center shadow-2xl">
            <Image
              src="/images/logo.png"
              alt="WMES Logo"
              fill
              className="object-contain p-1"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-display font-black tracking-widest text-base uppercase text-white drop-shadow-md leading-none">
              WMES
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400 font-semibold drop-shadow mt-1">
              Administration
            </span>
          </div>
        </div>

        {/* Sliding Background Images */}
        <div className="absolute inset-0 z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={adminOfficeSlides[currentSlide].id}
              initial={{ opacity: 0, scale: 1.04 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <Image
                src={adminOfficeSlides[currentSlide].image}
                alt={adminOfficeSlides[currentSlide].alt}
                fill
                className="object-cover"
                priority
              />
              {/* Soft subtle vignette for visual polish */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30 pointer-events-none" />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom Slide Indicators */}
        <div className="absolute bottom-6 left-6 sm:bottom-8 sm:left-8 z-20 flex items-center gap-2">
          {adminOfficeSlides.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "w-10 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)]"
                    : "w-3.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ─── SECTION 2: AUTHENTICATION FORM (RIGHT) ─── */}
      <div className="relative w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-16 bg-[#070D18]">
        {/* Ambient glow behind card */}
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-sm bg-[#0C1524]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-7 sm:p-9 shadow-2xl relative z-10">
          {/* Step 1: Input Email */}
          {otpStep === "email" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendOtp(false);
              }}
              className="space-y-4"
            >
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter email"
                  autoFocus
                  required
                  className="w-full bg-white/[0.04] border border-white/15 rounded-xl px-4 py-3.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:bg-white/[0.08] transition-all"
                />
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-rose-300 text-xs font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Get Code</span>
                )}
              </button>
            </form>
          )}

          {/* Step 2: 6-Digit OTP Entry */}
          {otpStep === "code" && (
            <div className="space-y-4">
              <div
                className="flex justify-center gap-2 sm:gap-2.5"
                onPaste={handleOtpPaste}
              >
                {otpDigits.map((d, i) => (
                  <input
                    key={i}
                    ref={(el) => {
                      otpInputRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleOtpDigitChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className={`w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-mono font-bold text-white rounded-xl outline-none transition-all duration-200 ${
                      d
                        ? "bg-amber-500/20 border-2 border-amber-400 shadow-md shadow-amber-500/20"
                        : "bg-white/[0.05] border border-white/10 focus:border-amber-400/70 focus:bg-white/[0.08]"
                    } ${error ? "border-rose-500/80 bg-rose-500/10 text-rose-300" : ""}`}
                    autoFocus={i === 0}
                    disabled={loading}
                  />
                ))}
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center gap-2 text-rose-300 text-xs font-medium animate-shake">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <button
                type="button"
                onClick={() => verifyOtpCode()}
                disabled={loading || otpDigits.some((d) => !d)}
                className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <span>Verify Code</span>
                )}
              </button>

              <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setOtpStep("email");
                    setError("");
                  }}
                  className="text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  &larr; Change email
                </button>

                {countdown > 0 ? (
                  <span className="font-mono text-slate-500">
                    Resend in <span className="text-amber-400 font-semibold">{countdown}s</span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleSendOtp(true)}
                    disabled={loading}
                    className="text-amber-400 hover:text-amber-300 font-semibold underline cursor-pointer"
                  >
                    Resend Code
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   MAIN ADMIN CLIENT COMPONENT
───────────────────────────────── */
export default function AdminClient({
  initialRole,
}: {
  initialRole?: "super_admin" | "secretary";
} = {}) {
  const [unlocked, setUnlocked] = useState(false);
  const [role, setRole] = useState<"super_admin" | "secretary">(initialRole || "super_admin");
  const [adminEmail, setAdminEmail] = useState<string>("");
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lookupQuery, setLookupQuery] = useState("");

  // Global aggregate stats
  const [stats, setStats] = useState<StatsData>({
    totalStudents: 0,
    totalRevenue: 0,
    pendingApplications: 0,
    totalApplications: 0,
    verifiedProfiles: 0,
    recentSignups: 0,
    totalTransactions: 0,
    paidTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    paymentSuccessRate: 100,
    formFeesRevenue: 0,
    tuitionRevenue: 0,
    avgTransactionValue: 0,
    pendingProfiles: 0,
    rejectedProfiles: 0,
    kycVerificationRate: 0,
    trackDistribution: {},
    approvedApplications: 0,
    rejectedApplications: 0,
    admissionApprovalRate: 0,
    centreDistribution: {},
    totalFormSubmissions: 0,
  });
  const [recentStudents, setRecentStudents] = useState<any[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
  const [loadingStats, setLoadingStats] = useState(true);

  // Check session unlock status on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("wmes_admin_unlocked") === "1";
      const savedRole = sessionStorage.getItem("wmes_admin_role") as
        | "super_admin"
        | "secretary"
        | null;
      const savedEmail = sessionStorage.getItem("wmes_admin_email") || "";
      setUnlocked(isAuth);
      if (savedRole) {
        setRole(savedRole);
      } else if (initialRole) {
        setRole(initialRole);
      }
      if (savedEmail) {
        setAdminEmail(savedEmail);
      }
    }
  }, [initialRole]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("wmes_admin_unlocked");
    sessionStorage.removeItem("wmes_admin_role");
    sessionStorage.removeItem("wmes_admin_email");
    setUnlocked(false);
    setAdminEmail("");
    showToast("Admin session locked.");
  };

  // Fetch KPI Stats
  const fetchStats = useCallback(async () => {
    setLoadingStats(true);
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentStudents(data.recentStudents || []);
        setRecentTransactions(data.recentTransactions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoadingStats(false);
    }
  }, []);

  useEffect(() => {
    if (unlocked) {
      fetchStats();
    }
  }, [unlocked, fetchStats]);

  if (!unlocked) {
    return (
      <AdminAuthScreen
        initialRole={initialRole}
        onUnlock={(detectedRole, verifiedEmail) => {
          setRole(detectedRole);
          if (verifiedEmail) {
            setAdminEmail(verifiedEmail);
          }
          setUnlocked(true);
          setActiveTab("overview");
        }}
      />
    );
  }

  const isSecretary = role === "secretary";

  // Sidebar navigation configuration with live badge counts
  const secretaryNavItems = [
    {
      id: "overview" as AdminTab,
      label: "Secretary Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "scholarships" as AdminTab,
      label: "Scholarships & Tokens",
      icon: GraduationCap,
      badge: null,
    },
    {
      id: "applications" as AdminTab,
      label: "Pending Applications",
      icon: FileText,
      badge: stats.pendingApplications > 0 ? String(stats.pendingApplications) : null,
      badgeColor: "amber",
    },
    {
      id: "sessions" as AdminTab,
      label: "Recorded Sessions",
      icon: Video,
      badge: null,
    },
    {
      id: "students" as AdminTab,
      label: "Students Directory",
      icon: Users,
      badge: stats.totalStudents > 0 ? String(stats.totalStudents) : null,
    },
    {
      id: "submissions" as AdminTab,
      label: "Form Requests",
      icon: ClipboardList,
      badge: null,
    },
    {
      id: "validation" as AdminTab,
      label: "Student Quick Lookup",
      icon: ShieldCheck,
      badge: null,
    },
  ];

  const superAdminNavItems = [
    {
      id: "overview" as AdminTab,
      label: "Platform Overview",
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: "audit" as AdminTab,
      label: "Audit Trail",
      icon: Sparkles,
      badge: null,
    },
    {
      id: "students" as AdminTab,
      label: "Students Directory",
      icon: Users,
      badge: stats.totalStudents > 0 ? String(stats.totalStudents) : null,
    },
    {
      id: "applications" as AdminTab,
      label: "Admissions Registry",
      icon: FileText,
      badge: stats.pendingApplications > 0 ? String(stats.pendingApplications) : null,
      badgeColor: "amber",
    },
    {
      id: "payments" as AdminTab,
      label: "Financial Ledger",
      icon: CreditCard,
      badge: null,
    },
    {
      id: "scholarships" as AdminTab,
      label: "Scholarships & Grants",
      icon: GraduationCap,
      badge: null,
    },
    {
      id: "sessions" as AdminTab,
      label: "Recorded Sessions",
      icon: Video,
      badge: null,
    },
    {
      id: "submissions" as AdminTab,
      label: "Form Submissions",
      icon: ClipboardList,
      badge: null,
    },
    {
      id: "validation" as AdminTab,
      label: "Validation Desk",
      icon: ShieldCheck,
      badge: null,
    },
  ];

  const navigationItems = isSecretary ? secretaryNavItems : superAdminNavItems;

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F8FAFC] text-slate-900 flex font-body antialiased relative selection:bg-amber-500 selection:text-slate-950">
      {/* ─────────────────────────────────────────────────────────
          FLOATING TOAST NOTIFICATION
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-3 sm:right-5 max-w-[calc(100vw-1.5rem)] sm:max-w-md z-[9999] bg-[#070D18] text-white border border-amber-500/30 px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Check className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm font-medium pr-2">{toastMessage}</p>
            <button
              onClick={() => setToastMessage(null)}
              className="text-slate-400 hover:text-white p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────
          LEFT EXCLUSIVE SIDEBAR (DESKTOP & MOBILE DRAWER)
      ────────────────────────────────────────────────────────── */}
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#070D18] text-white flex flex-col justify-between transition-all duration-300 border-r border-white/10 ${sidebarCollapsed ? "w-20" : "w-72"
          } ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
          }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-20 px-5 flex items-center justify-between border-b border-white/[0.08]">
            <Link
              href="/admin"
              className="flex items-center gap-3 overflow-hidden focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-white/10 p-1 border border-white/20 shrink-0 flex items-center justify-center">
                <Image
                  src="/images/logo.png"
                  alt="WMES Logo"
                  fill
                  className="object-contain p-0.5"
                />
              </div>
              {!sidebarCollapsed && (
                <div className="flex flex-col">
                  <span className="font-display font-black tracking-wider text-base uppercase leading-none text-white">
                    WMES
                  </span>
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400 font-bold mt-1">
                    {isSecretary ? "Secretary Desk" : "Super Admin"}
                  </span>
                </div>
              )}
            </Link>

            {/* Desktop Collapse Toggle */}
            <button
              type="button"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex w-7 h-7 rounded-lg bg-white/5 hover:bg-white/15 text-slate-400 hover:text-white items-center justify-center transition-colors cursor-pointer"
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>

            {/* Mobile Close Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1.5 mt-3">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer text-left group relative ${isActive
                      ? "bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/25 font-bold"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                    }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive
                          ? "text-slate-950"
                          : "text-slate-400 group-hover:text-amber-400 group-hover:scale-110"
                        }`}
                    />
                    {!sidebarCollapsed && (
                      <span className="truncate">{item.label}</span>
                    )}
                  </div>

                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full whitespace-nowrap ml-2 ${isActive
                          ? "bg-slate-950/20 text-slate-950"
                          : item.badgeColor === "amber"
                            ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                            : item.badgeColor === "emerald"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : "bg-white/10 text-slate-300"
                        }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Administrator Card */}
        <div className="p-3 border-t border-white/[0.08]">
          {!sidebarCollapsed ? (
            <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                  {isSecretary ? "SD" : "SA"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">
                    {isSecretary ? "Admissions Desk" : "Executive Admin"}
                  </p>
                  <p className="text-[10px] text-amber-400/90 font-mono truncate" title={adminEmail || (isSecretary ? "johnsunday0153@gmail.com" : "worldmobileedusystem@gmail.com")}>
                    {adminEmail || (isSecretary ? "johnsunday0153@gmail.com" : "worldmobileedusystem@gmail.com")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleLogout}
                title="Lock Portal"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 flex items-center justify-center font-bold text-xs shrink-0">
                {isSecretary ? "SD" : "SA"}
              </div>
              <button
                type="button"
                onClick={handleLogout}
                title="Lock Portal"
                className="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────
          MAIN PORTAL VIEWPORT AREA (EXCLUSIVE STANDALONE)
      ────────────────────────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-h-screen w-full max-w-full min-w-0 overflow-x-hidden transition-all duration-300 ${sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
          }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-20 bg-white/85 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          {/* Left: Mobile hamburger & Active Tab Title */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-semibold uppercase text-amber-600 tracking-wider">
                  {isSecretary ? "WMES Secretary Desk" : "WMES Executive Portal"}
                </span>
                <span className="text-slate-300">&bull;</span>
                <span className="text-xs text-slate-500 capitalize">
                  {activeTab}
                </span>
              </div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                {activeTab === "overview" && (isSecretary ? "Secretary Overview" : "Platform Overview")}
                {activeTab === "students" && "Student Directory"}
                {activeTab === "applications" && "Admissions & Applications"}
                {activeTab === "payments" && "Financial Ledger"}
                {activeTab === "scholarships" && (isSecretary ? "Scholarships & Token Generation" : "Scholarships & Grants")}
                {activeTab === "sessions" && "Recorded Video Sessions"}
                {activeTab === "submissions" && "Form Submissions"}
                {activeTab === "audit" && "Audit Trail & Logs"}
                {activeTab === "validation" && "Student Validation"}
              </h1>
            </div>
          </div>

          {/* Right: Live Sync Badge & Refresh Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isSecretary ? (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-mono font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-purple-500 shrink-0" />
                <span>Super Admin</span>
                {adminEmail && (
                  <span className="text-[11px] text-purple-600/80 font-normal pl-1.5 border-l border-purple-200 truncate max-w-[200px]">
                    {adminEmail}
                  </span>
                )}
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 text-xs font-mono font-semibold">
                <GraduationCap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                <span>Secretary Desk</span>
                {adminEmail && (
                  <span className="text-[11px] text-amber-700/80 font-normal pl-1.5 border-l border-amber-200 truncate max-w-[200px]">
                    {adminEmail}
                  </span>
                )}
              </div>
            )}

            <button
              onClick={() => {
                fetchStats();
                showToast("Refreshed platform statistics");
              }}
              disabled={loadingStats}
              title="Refresh Platform Data"
              className="p-2 sm:px-3 sm:py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 text-slate-500 ${loadingStats ? "animate-spin text-amber-500" : ""
                  }`}
              />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lock</span>
            </button>
          </div>
        </header>

        {/* Tab Body Viewports */}
        <main className="flex-1 p-3.5 sm:p-8 max-w-7xl w-full min-w-0 mx-auto">
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              recentStudents={recentStudents}
              recentTransactions={recentTransactions}
              loading={loadingStats}
              onNavigate={(t) => setActiveTab(t)}
              onToast={showToast}
              onRefreshStats={fetchStats}
              role={role}
            />
          )}

          {activeTab === "students" && (
            <StudentsTab
              onToast={showToast}
              onRefreshStats={fetchStats}
              onLookupStudent={(id) => {
                setLookupQuery(id);
                setActiveTab("validation");
              }}
            />
          )}

          {activeTab === "applications" && (
            <ApplicationsTab
              onToast={showToast}
              onRefreshStats={fetchStats}
              role={role}
              onLookupStudent={(id) => {
                setLookupQuery(id);
                setActiveTab("validation");
              }}
            />
          )}

          {activeTab === "payments" && <PaymentsTab />}

          {activeTab === "scholarships" && (
            <ScholarshipsTab
              onToast={showToast}
              actorRole={isSecretary ? "Secretary Desk" : "Super Admin"}
            />
          )}

          {activeTab === "sessions" && (
            <SessionsTab
              onToast={showToast}
              actorRole={isSecretary ? "Secretary Desk" : "Super Admin"}
            />
          )}

          {activeTab === "submissions" && <SubmissionsTab />}

          {activeTab === "audit" && <AuditTrailTab onToast={showToast} />}

          {activeTab === "validation" && (
            <ValidationTab
              initialQuery={lookupQuery}
              onToast={showToast}
            />
          )}
        </main>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   TAB 1: OVERVIEW COMPONENT (EXECUTIVE & SECRETARY INTELLIGENCE)
───────────────────────────────── */
function OverviewTab({
  stats,
  recentStudents,
  recentTransactions,
  loading,
  onNavigate,
  onToast,
  onRefreshStats,
  role = "super_admin",
}: {
  stats: StatsData;
  recentStudents: any[];
  recentTransactions: any[];
  loading: boolean;
  onNavigate: (t: AdminTab) => void;
  onToast: (msg: string) => void;
  onRefreshStats: () => void;
  role?: "super_admin" | "secretary";
}) {
  const [updatingUserId, setUpdatingUserId] = useState<string | null>(null);
  const isSecretary = role === "secretary";

  const quickVerify = async (id: string, name: string) => {
    setUpdatingUserId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verification_status: "Verified" }),
      });
      const data = await res.json();
      if (data.success) {
        onToast(`Student ${name} KYC verified successfully`);
        onRefreshStats();
      }
    } catch {
      onToast("Failed to verify student.");
    } finally {
      setUpdatingUserId(null);
    }
  };

  const copyExecutiveBrief = () => {
    const brief = isSecretary
      ? `WMES Secretariat Operational Intelligence Briefing
Generated: ${new Date().toLocaleString("en-GB")}
--------------------------------------------------
Total Students Enrolled: ${stats.totalStudents} (${stats.recentSignups} in past 7 days)
Admissions Queue: ${stats.totalApplications} Total (${stats.pendingApplications} Pending Review, ${stats.approvedApplications || 0} Approved)
KYC Compliance: ${stats.kycVerificationRate || 0}% Verified (${stats.verifiedProfiles}/${stats.totalStudents})
Official Dockets: ${stats.totalFormSubmissions || 0} Formal Submissions
Fee Settlements Cleared: ${fmtNGN(stats.totalRevenue)} (${stats.paidTransactions || 0} settled transactions)
Registry Hubs: Abuja Central Area & Enugu Centenary Estate
Operational Status: 100% Operational`
      : `WMES Executive Intelligence Briefing
Generated: ${new Date().toLocaleString("en-GB")}
--------------------------------------------------
Total Revenue: ${fmtNGN(stats.totalRevenue)} (${stats.paymentSuccessRate || 100}% Gateway Clearance)
Total Students: ${stats.totalStudents} (${stats.recentSignups} in past 7 days)
Admissions Queue: ${stats.totalApplications} Total (${stats.pendingApplications} Pending, ${stats.approvedApplications || 0} Approved)
KYC Compliance: ${stats.kycVerificationRate || 0}% Verified (${stats.verifiedProfiles}/${stats.totalStudents})
Average Ticket Value: ${fmtNGN(stats.avgTransactionValue || 0)}
Official Dockets: ${stats.totalFormSubmissions || 0} Formal Submissions
Registry Hubs: Abuja Central Area & Enugu Centenary Estate
Operational Status: 100% Healthy`;
    navigator.clipboard.writeText(brief);
    onToast(isSecretary ? "Secretariat operational briefing copied!" : "Executive metrics briefing copied to clipboard!");
  };

  // 6 Primary Scorecards tailored by Role
  const kpis = isSecretary
    ? [
      {
        title: "Admissions Pipeline",
        value: `${stats.totalApplications} Candidates`,
        sub: `${stats.pendingApplications} awaiting review`,
        icon: FileText,
        color: "bg-amber-50 text-amber-600 border-amber-200",
        tab: "applications" as AdminTab,
      },
      {
        title: "Registered Students",
        value: `${stats.totalStudents} Active`,
        sub: `${stats.recentSignups} enrolled in past 7 days`,
        icon: Users,
        color: "bg-blue-50 text-blue-600 border-blue-200",
        tab: "students" as AdminTab,
      },
      {
        title: "KYC Compliance",
        value: `${stats.kycVerificationRate || 0}%`,
        sub: `${stats.verifiedProfiles} verified of ${stats.totalStudents}`,
        icon: ShieldCheck,
        color: "bg-purple-50 text-purple-600 border-purple-200",
        tab: "students" as AdminTab,
      },
      {
        title: "Scholarship Grants",
        value: "Token Desk",
        sub: "Sponsors, tokens & waitlist",
        icon: GraduationCap,
        color: "bg-amber-50 text-amber-600 border-amber-200",
        tab: "scholarships" as AdminTab,
      },
      {
        title: "Form Submissions",
        value: `${stats.totalFormSubmissions || 0} Filed`,
        sub: "Academic & administrative forms",
        icon: ClipboardList,
        color: "bg-indigo-50 text-indigo-600 border-indigo-200",
        tab: "submissions" as AdminTab,
      },
      {
        title: "Student Lookup",
        value: "Clearance Desk",
        sub: "Single-student verification",
        icon: ShieldCheck,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
        tab: "validation" as AdminTab,
      },
    ]
    : [
      {
        title: "Total Revenue",
        value: fmtNGN(stats.totalRevenue),
        sub: `${stats.paidTransactions || 0} settled transactions`,
        icon: CreditCard,
        color: "bg-emerald-50 text-emerald-600 border-emerald-200",
        tab: "payments" as AdminTab,
      },
      {
        title: "Registered Students",
        value: `${stats.totalStudents} Active`,
        sub: `${stats.recentSignups} enrolled in past 7 days`,
        icon: Users,
        color: "bg-blue-50 text-blue-600 border-blue-200",
        tab: "students" as AdminTab,
      },
      {
        title: "Admissions Pipeline",
        value: `${stats.totalApplications} Candidates`,
        sub: `${stats.pendingApplications} awaiting review`,
        icon: FileText,
        color: "bg-amber-50 text-amber-600 border-amber-200",
        tab: "applications" as AdminTab,
      },
      {
        title: "KYC Compliance",
        value: `${stats.kycVerificationRate || 0}%`,
        sub: `${stats.verifiedProfiles} verified of ${stats.totalStudents}`,
        icon: ShieldCheck,
        color: "bg-purple-50 text-purple-600 border-purple-200",
        tab: "students" as AdminTab,
      },
      {
        title: "Average Ticket",
        value: fmtNGN(stats.avgTransactionValue || 0),
        sub: "Per completed checkout",
        icon: TrendingUp,
        color: "bg-sky-50 text-sky-600 border-sky-200",
        tab: "payments" as AdminTab,
      },
      {
        title: "Form Submissions",
        value: `${stats.totalFormSubmissions || 0} Filed`,
        sub: "Academic & administrative forms",
        icon: ClipboardList,
        color: "bg-indigo-50 text-indigo-600 border-indigo-200",
        tab: "submissions" as AdminTab,
      },
    ];

  const hasActionableAlerts =
    (stats.pendingProfiles && stats.pendingProfiles > 0) ||
    (stats.pendingApplications && stats.pendingApplications > 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* ─────────────────────────────────────────────────────────
          HERO BAR
      ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            {isSecretary ? "Secretary Overview" : "Admin Overview"}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
            {isSecretary
              ? "Review student admissions, identity verification, scholarship tokens, and form submissions."
              : "Overview of student registrations, admissions, fee settlements, and platform compliance."}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {isSecretary ? (
            <>
              <button
                onClick={() => onNavigate("applications")}
                className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>Admissions</span>
              </button>

              <button
                onClick={() => onNavigate("scholarships")}
                className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <GraduationCap className="w-4 h-4 text-amber-400" />
                <span>Scholarships</span>
              </button>

              <button
                onClick={() => onNavigate("sessions")}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
              >
                <Video className="w-4 h-4" />
                <span>Recorded Sessions</span>
              </button>

              <button
                onClick={() => onNavigate("validation")}
                className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-slate-400" />
                <span>Student Lookup</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate("validation")}
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-sm cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Validation Desk</span>
            </button>
          )}

          <button
            onClick={copyExecutiveBrief}
            className="px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs sm:text-sm flex items-center gap-2 transition-all cursor-pointer"
          >
            <Copy className="w-4 h-4 text-slate-400" />
            <span>Copy Summary</span>
          </button>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          ACTION REQUIRED ALERT STRIP (CONDITIONAL)
      ────────────────────────────────────────────────────────── */}
      {hasActionableAlerts && (
        <div className="bg-amber-50/90 border border-amber-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm animate-scale-in">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-700 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-amber-900">
                Action Required: Pending Clearances
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                {stats.pendingProfiles || 0} student KYC profile{(stats.pendingProfiles || 0) !== 1 ? "s" : ""} awaiting credential review &bull;{" "}
                {stats.pendingApplications || 0} admission application{(stats.pendingApplications || 0) !== 1 ? "s" : ""} pending approval.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {(stats.pendingProfiles || 0) > 0 && (
              <button
                onClick={() => onNavigate("students")}
                className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Review KYC ({stats.pendingProfiles})
              </button>
            )}
            {(stats.pendingApplications || 0) > 0 && (
              <button
                onClick={() => onNavigate("applications")}
                className="px-3 py-1.5 rounded-lg border border-amber-300 bg-white hover:bg-amber-100 text-amber-900 font-semibold text-xs transition-colors cursor-pointer"
              >
                Review Admissions ({stats.pendingApplications})
              </button>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          6 CORE SCORECARD KPI TILES
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.title}
              onClick={() => onNavigate(k.tab)}
              className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-transform group-hover:scale-105 ${k.color}`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>

                <span className="text-xs font-medium text-slate-500 block">
                  {k.title}
                </span>
                <div className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-1">
                  {loading ? "…" : k.value}
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-400">
                <span className="truncate block">{k.sub}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────
          INSIGHT PANELS (2x2 GRID)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Panel 1: Revenue Split & Fee Clearance */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Revenue & Fee Clearance
                  </h3>
                  <p className="text-xs text-slate-400">
                    Breakdown of student payments across dockets
                  </p>
                </div>
              </div>
            </div>

            {/* Split Bars */}
            <div className="space-y-4">
              {/* Form Access Fees */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    Form Access & Admissions
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {fmtNGN(stats.formFeesRevenue || 0)} (
                    {stats.totalRevenue > 0
                      ? Math.round(((stats.formFeesRevenue || 0) / stats.totalRevenue) * 100)
                      : 100}
                    %)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalRevenue > 0
                          ? Math.round(((stats.formFeesRevenue || 0) / stats.totalRevenue) * 100)
                          : 100
                        }%`,
                    }}
                  />
                </div>
              </div>

              {/* Tuition & Programme Fees */}
              <div>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="font-semibold text-slate-700 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Tuition & Specialization
                  </span>
                  <span className="font-mono font-bold text-slate-900">
                    {fmtNGN(stats.tuitionRevenue || 0)} (
                    {stats.totalRevenue > 0
                      ? Math.round(((stats.tuitionRevenue || 0) / stats.totalRevenue) * 100)
                      : 0}
                    %)
                  </span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{
                      width: `${stats.totalRevenue > 0
                          ? Math.round(((stats.tuitionRevenue || 0) / stats.totalRevenue) * 100)
                          : 0
                        }%`,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Quick Metrics Strip */}
            <div className="grid grid-cols-3 gap-3 mt-6 pt-5 border-t border-slate-100 text-center">
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Settled Paid
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {stats.paidTransactions || 0}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Pending Holds
                </span>
                <span className="text-sm font-bold text-amber-600">
                  {stats.pendingTransactions || 0}
                </span>
              </div>
              <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                <span className="text-[10px] font-mono uppercase text-slate-400 block">
                  Declined
                </span>
                <span className="text-sm font-bold text-slate-400">
                  {stats.failedTransactions || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel 2: Candidate Onboarding Funnel */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Candidate Onboarding Funnel
                  </h3>
                  <p className="text-xs text-slate-400">
                    Progression from registration to verified enrollment
                  </p>
                </div>
              </div>
            </div>

            {/* 4-Stage Funnel */}
            <div className="space-y-3.5">
              {[
                {
                  label: "1. Account Created",
                  count: stats.totalStudents,
                  pct: 100,
                  color: "bg-blue-600",
                },
                {
                  label: "2. Form Access Fee Cleared",
                  count: stats.paidTransactions || 0,
                  pct: 100,
                  color: "bg-indigo-600",
                },
                {
                  label: "3. Admission Form Submitted",
                  count: stats.totalApplications,
                  pct:
                    stats.totalStudents > 0
                      ? Math.round((stats.totalApplications / stats.totalStudents) * 100)
                      : 0,
                  color: "bg-amber-500",
                },
                {
                  label: "4. Admitted & Verified",
                  count: stats.verifiedProfiles,
                  pct:
                    stats.totalStudents > 0
                      ? Math.round((stats.verifiedProfiles / stats.totalStudents) * 100)
                      : 0,
                  color: "bg-emerald-600",
                },
              ].map((stage) => (
                <div key={stage.label}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-slate-700">
                      {stage.label}
                    </span>
                    <span className="font-mono text-slate-500">
                      <strong className="text-slate-900">{stage.count}</strong> ({stage.pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full ${stage.color} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(stage.pct, 4)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Panel 3: Identity & KYC Compliance */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    KYC & Identity Verification
                  </h3>
                  <p className="text-xs text-slate-400">
                    Student credential verification status
                  </p>
                </div>
              </div>

              <button
                onClick={() => onNavigate("students")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Directory</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Progress Bar */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-xs mb-2">
                <span className="text-slate-500 font-semibold text-xs">
                  Compliance Distribution
                </span>
                <span className="font-mono font-bold text-purple-700">
                  {stats.kycVerificationRate || 0}% Cleared
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 overflow-hidden flex">
                <div
                  className="h-full bg-emerald-500 transition-all duration-500"
                  style={{
                    width: `${stats.totalStudents > 0
                        ? (stats.verifiedProfiles / stats.totalStudents) * 100
                        : 0
                      }%`,
                  }}
                  title="Verified"
                />
                <div
                  className="h-full bg-amber-400 transition-all duration-500"
                  style={{
                    width: `${stats.totalStudents > 0
                        ? ((stats.pendingProfiles || 0) / stats.totalStudents) * 100
                        : 100
                      }%`,
                  }}
                  title="Pending Review"
                />
                <div
                  className="h-full bg-rose-500 transition-all duration-500"
                  style={{
                    width: `${stats.totalStudents > 0
                        ? ((stats.rejectedProfiles || 0) / stats.totalStudents) * 100
                        : 0
                      }%`,
                  }}
                  title="Rejected"
                />
              </div>
            </div>

            {/* 3 Status Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
              <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 text-center">
                <span className="text-xs font-semibold text-emerald-800 block mb-0.5">
                  Verified
                </span>
                <span className="text-xl font-bold text-emerald-900">
                  {stats.verifiedProfiles}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-center">
                <span className="text-xs font-semibold text-amber-800 block mb-0.5">
                  Pending Review
                </span>
                <span className="text-xl font-bold text-amber-900">
                  {stats.pendingProfiles || 0}
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-rose-50/70 border border-rose-200/80 text-center">
                <span className="text-xs font-semibold text-rose-800 block mb-0.5">
                  Flagged
                </span>
                <span className="text-xl font-bold text-rose-900">
                  {stats.rejectedProfiles || 0}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Pending review queue: {stats.pendingProfiles || 0} candidates
            </span>
            <button
              onClick={() => onNavigate("students")}
              className="text-xs font-bold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              Verify Queue &rarr;
            </button>
          </div>
        </div>

        {/* Panel 4: Regional Hubs & Learning Centres */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
                  <Building className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-slate-900">
                    Regional Hubs & Centres
                  </h3>
                  <p className="text-xs text-slate-400">
                    Physical studio footprints & active curricula
                  </p>
                </div>
              </div>
            </div>

            {/* Hub List */}
            <div className="space-y-3">
              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Abuja Executive Hub
                  </p>
                  <p className="text-[11px] text-slate-500">
                    National Centre for Women Development, Central Area, FCT
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Headquarters
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Enugu Creative Studio & Atelier
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Chika&apos;s Plaza, Centenary Estate, Enugu State
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Vocational Hub
                </span>
              </div>

              <div className="p-3 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">
                    Virtual Registry & Distance Pathway
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Cloud portal learning management and certification
                  </p>
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─────────────────────────────────────────────────────────
          OPERATIONAL ACTIVITY FEEDS (SIDE-BY-SIDE TABLES)
      ────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Recent Student Accounts with Instant Quick Verify */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Recent Student Registrations
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Real-time portal accounts with instant verification
                </p>
              </div>
              <button
                onClick={() => onNavigate("students")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>View All ({stats.totalStudents})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentStudents.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400 font-mono">
                  No student registrations recorded yet.
                </p>
              ) : (
                recentStudents.map((u: any) => (
                  <div
                    key={u.matric_no}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                        {(u.name || "U").charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                          {u.name}
                        </p>
                        <p className="text-[11px] text-slate-500 font-mono truncate">
                          {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0">
                      <div className="text-right hidden sm:block">
                        <span className="font-mono text-xs font-bold text-amber-600">
                          {u.matric_no}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {fmtDate(u.created_at)}
                        </p>
                      </div>

                      {u.verification_status !== "Verified" ? (
                        <button
                          disabled={updatingUserId === u.id}
                          onClick={() => quickVerify(u.id, u.name)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] flex items-center gap-1 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                        >
                          <Check className="w-3 h-3" />
                          <span>Verify</span>
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-right">
            <button
              onClick={() => onNavigate("validation")}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 cursor-pointer"
            >
              Look up specific student by ID &rarr;
            </button>
          </div>
        </div>

        {/* Right: Live Payment Ledger Stream */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-slate-900">
                  Real-Time Transactions Ledger
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Live stream of ALATPay checkout settlements
                </p>
              </div>
              <button
                onClick={() => onNavigate(isSecretary ? "validation" : "payments")}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
              >
                <span>{isSecretary ? "Lookup Tool" : "Full Ledger"} ({stats.totalTransactions || 0})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {recentTransactions.length === 0 ? (
                <p className="py-8 text-center text-xs text-slate-400 font-mono">
                  No payment transactions recorded yet.
                </p>
              ) : (
                recentTransactions.map((t: any) => (
                  <div
                    key={t.id}
                    className="py-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900 truncate">
                        {t.description || "General Fee Payment"}
                      </p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">
                        <span className="text-amber-600 font-semibold">
                          {t.matric_no}
                        </span>{" "}
                        &bull; {fmtDateTime(t.created_at)}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="text-xs sm:text-sm font-bold text-slate-900">
                        {fmtNGN(Number(t.amount || 0))}
                      </p>
                      <StatusBadge status={t.status} />
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] font-mono text-slate-500">
              Total cleared: <strong className="text-slate-900">{fmtNGN(stats.totalRevenue)}</strong>
            </span>
            <button
              onClick={() => onNavigate(isSecretary ? "validation" : "payments")}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 cursor-pointer"
            >
              {isSecretary ? "Verify Clearance Desk →" : "Export statements →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


/* ─────────────────────────────────
   TAB 2: STUDENTS COMPONENT
───────────────────────────────── */
function StudentsTab({
  onToast,
  onRefreshStats,
  onLookupStudent,
}: {
  onToast: (msg: string) => void;
  onRefreshStats: () => void;
  onLookupStudent?: (id: string) => void;
}) {
  const [users, setUsers] = useState<StudentUser[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const loadUsers = useCallback(async (q = "") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users?search=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadUsers(search);
  };

  const updateVerification = async (id: string, name: string, status: string) => {
    setUpdatingId(id);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verification_status: status }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) =>
          prev.map((u) => (u.id === id ? { ...u, verification_status: status } : u))
        );
        onToast(`Student ${name} updated to "${status}"`);
        onRefreshStats();
      }
    } catch {
      onToast("Failed to update status. Try again.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    return (u.verification_status || "Pending").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top search & Filter Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or Student ID…"
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 shadow-sm"
          />
          {search && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                loadUsers("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </form>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {["all", "Verified", "Pending", "Rejected"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${filter === f
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
                }`}
            >
              {f === "all" ? "All Profiles" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="px-5 py-3.5">Student Details</th>
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Enrolled Track</th>
                <th className="px-5 py-3.5">KYC Status</th>
                <th className="px-5 py-3.5">Registered</th>
                <th className="px-5 py-3.5 text-right">Verification Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading student records…</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    No matching student profiles found.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Name & Email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center shrink-0">
                          {(u.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{u.name}</p>
                          <p className="text-slate-500 text-xs font-mono">{u.email}</p>
                          {u.phone && (
                            <p className="text-slate-400 text-[11px]">{u.phone}</p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Matric No */}
                    <td className="px-5 py-4 font-mono font-bold text-amber-600 whitespace-nowrap">
                      {u.matric_no}
                    </td>

                    {/* Track */}
                    <td className="px-5 py-4 text-slate-600 whitespace-nowrap">
                      {u.track || "Pending"}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={u.verification_status || "Pending"} />
                    </td>

                    {/* Date */}
                    <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                      {fmtDate(u.created_at)}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {onLookupStudent && (
                          <button
                            onClick={() => onLookupStudent(u.matric_no)}
                            className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                            title="Quick Clearance & Funding Lookup"
                          >
                            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                            <span>Lookup</span>
                          </button>
                        )}
                        {u.verification_status !== "Verified" && (
                          <button
                            disabled={updatingId === u.id}
                            onClick={() =>
                              updateVerification(u.id, u.name, "Verified")
                            }
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-sm cursor-pointer disabled:opacity-50"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Verify KYC
                          </button>
                        )}
                        {u.verification_status !== "Rejected" && (
                          <button
                            disabled={updatingId === u.id}
                            onClick={() =>
                              updateVerification(u.id, u.name, "Rejected")
                            }
                            className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <XCircle className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 text-xs text-slate-500 font-mono flex items-center justify-between">
          <span>
            Showing {filteredUsers.length} of {users.length} enrolled student
            {users.length !== 1 ? "s" : ""}
          </span>
          <span className="text-[11px] text-slate-400">
            Real-time Supabase Profiles Registry
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   TAB 3: APPLICATIONS COMPONENT (SECRETARY & ADMISSIONS DESK)
───────────────────────────────── */
function ApplicationsTab({
  onToast,
  onRefreshStats,
  role = "super_admin",
  onLookupStudent,
}: {
  onToast: (msg: string) => void;
  onRefreshStats: () => void;
  role?: "super_admin" | "secretary";
  onLookupStudent?: (id: string) => void;
}) {
  const isSecretary = role === "secretary";
  const [apps, setApps] = useState<ApplicationItem[]>([]);
  const [filter, setFilter] = useState("Pending");
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [remarksMap, setRemarksMap] = useState<Record<string, string>>({});
  const [checklistMap, setChecklistMap] = useState<Record<string, string>>({});

  const loadApps = useCallback(async (s = "Pending") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications?status=${s}`);
      const data = await res.json();
      if (data.success) {
        setApps(data.applications || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadApps(filter);
  }, [loadApps, filter]);

  const updateStatus = async (
    id: string,
    name: string,
    status: "Approved" | "Rejected"
  ) => {
    setUpdatingId(id);
    const existingRaw = apps.find((a) => a.id === id)?.raw_data || {};
    const remarks =
      remarksMap[id] !== undefined
        ? remarksMap[id]
        : existingRaw.officialUse?.remarks || "";
    const completeness =
      checklistMap[id] || existingRaw.officialUse?.completeness || "Complete";

    try {
      const res = await fetch("/api/admin/applications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status,
          remarks,
          completeness,
          reviewerName: isSecretary
            ? "Secretary Desk (Registry Admissions)"
            : "Super Admin Desk",
        }),
      });
      const data = await res.json();
      if (data.success) {
        setApps((prev) =>
          prev.map((a) =>
            a.id === id
              ? {
                  ...a,
                  status,
                  raw_data: {
                    ...(a.raw_data || {}),
                    officialUse: {
                      ...(a.raw_data?.officialUse || {}),
                      remarks,
                      completeness,
                      reviewedBy: isSecretary
                        ? "Secretary Desk (Registry Admissions)"
                        : "Super Admin Desk",
                      reviewedAt: new Date().toISOString(),
                      decision: status,
                    },
                  },
                }
              : a
          )
        );
        onToast(`Application for ${name} marked as ${status}`);
        onRefreshStats();
      }
    } catch {
      onToast("Failed to update application status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const FILTERS = ["Pending", "Approved", "Rejected", "all"];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold capitalize transition-all cursor-pointer ${
                filter === f
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f === "all" ? "All Admissions" : f === "Pending" ? "Pending Review" : f}
            </button>
          ))}
        </div>

        <span className="text-xs font-mono text-slate-500">
          Viewing: <strong className="text-slate-800">{filter === "all" ? "All Records" : filter}</strong> ({apps.length})
        </span>
      </div>

      {/* Applications Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="px-5 py-3.5">Form No / Portal ID</th>
                <th className="px-5 py-3.5">Applicant Name</th>
                <th className="px-5 py-3.5">Contact Details</th>
                <th className="px-5 py-3.5">Centre</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading application forms…</span>
                  </td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-400">
                    No applications found in this category.
                  </td>
                </tr>
              ) : (
                apps.map((a) => {
                  const isExpanded = expandedId === a.id;
                  return (
                    <React.Fragment key={a.id}>
                      <tr className={`hover:bg-slate-50/70 transition-colors ${isExpanded ? "bg-amber-50/30" : ""}`}>
                        <td className="px-5 py-4 font-mono font-bold text-[#C0111F] whitespace-nowrap">
                          {a.form_no || a.matric_no}
                        </td>
                        <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                          <div>{a.full_name}</div>
                          {a.raw_data?.fashionTrack && (
                            <span className="inline-block mt-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-red-50 text-[#C0111F] border border-red-200">
                              {Array.isArray(a.raw_data.fashionTrack)
                                ? a.raw_data.fashionTrack.join(", ")
                                : a.raw_data.fashionTrack}
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-600">
                          <div>{a.email}</div>
                          <div className="text-slate-400 font-mono">{a.phone || "—"}</div>
                        </td>
                        <td className="px-5 py-4 text-slate-600 text-xs whitespace-nowrap">
                          {a.preferred_centre || "Enugu Head Centre"}
                        </td>
                        <td className="px-5 py-4 whitespace-nowrap">
                          <StatusBadge status={a.status} />
                        </td>
                        <td className="px-5 py-4 text-slate-500 text-xs whitespace-nowrap">
                          {fmtDate(a.created_at)}
                        </td>
                        <td className="px-5 py-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-2">
                            {onLookupStudent && (
                              <button
                                onClick={() => onLookupStudent(a.form_no || a.matric_no || "")}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer"
                                title="Open Student Clearance & Funding Dossier"
                              >
                                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                                <span>Lookup</span>
                              </button>
                            )}
                            <button
                              onClick={() => setExpandedId(isExpanded ? null : a.id)}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                                isExpanded
                                  ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                                  : "border-slate-200 bg-white hover:bg-slate-100 text-slate-700"
                              }`}
                            >
                              <span>{isExpanded ? "Close Docket" : "Review Form"}</span>
                              <ChevronDown
                                className={`w-3.5 h-3.5 transition-transform ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {a.status !== "Approved" && (
                              <button
                                disabled={updatingId === a.id}
                                onClick={() => updateStatus(a.id, a.full_name, "Approved")}
                                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Approve
                              </button>
                            )}

                            {a.status !== "Rejected" && (
                              <button
                                disabled={updatingId === a.id}
                                onClick={() => updateStatus(a.id, a.full_name, "Rejected")}
                                className="px-3 py-1.5 rounded-lg border border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs flex items-center gap-1 transition-all cursor-pointer disabled:opacity-50"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                                Reject
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>

                      {/* Expandable Candidate Form & Official Use Section */}
                      {isExpanded && (
                        <tr className="bg-slate-50/90 border-b border-slate-200">
                          <td colSpan={7} className="px-6 py-6">
                            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
                              {/* Header Bar */}
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
                                <div className="flex items-center gap-4">
                                  <div className="w-14 h-16 rounded-lg overflow-hidden bg-slate-100 border border-slate-300 shrink-0 shadow-xs relative">
                                    {a.passport_photo_url ? (
                                      // eslint-disable-next-line @next/next/no-img-element
                                      <img
                                        src={a.passport_photo_url}
                                        alt={a.full_name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <div className="w-full h-full flex items-center justify-center text-slate-400 font-bold text-xs bg-slate-50">
                                        No Photo
                                      </div>
                                    )}
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <h4 className="text-base font-bold text-slate-900 tracking-tight">
                                        {a.full_name}
                                      </h4>
                                      <StatusBadge status={a.status} />
                                    </div>
                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      <span className="font-mono text-xs font-bold text-[#C0111F] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                        {a.form_no || a.matric_no}
                                      </span>
                                      <span className="text-slate-400">•</span>
                                      <span className="text-xs text-slate-500 font-mono">
                                        Submitted on {fmtDate(a.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-xs text-slate-500 font-mono text-left sm:text-right">
                                  Registry Docket #{a.id.slice(0, 8)}
                                </div>
                              </div>

                              {/* Section A: Personal Information & Motivation */}
                              <div>
                                <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0111F]" />
                                  Section A — Personal Information & Motivation
                                </h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Gender</span>
                                    <span className="font-semibold text-slate-800">{a.gender || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Date of Birth & Age</span>
                                    <span className="font-semibold text-slate-800">{a.dob || "—"} {a.age ? `(Age ${a.age})` : ""}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Phone Number</span>
                                    <span className="font-semibold font-mono text-slate-800">{a.phone || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Account Email</span>
                                    <span className="font-semibold text-slate-800">{a.email || "—"}</span>
                                  </div>
                                  <div className="col-span-2">
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Residential Address</span>
                                    <span className="font-medium text-slate-800">{a.address || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Education Level</span>
                                    <span className="font-semibold text-slate-800">{a.education || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Current Status</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.currentStatus) ? a.raw_data.currentStatus.join(", ") : a.raw_data?.currentStatus || "—"}
                                      {a.raw_data?.currentStatusOther ? ` (${a.raw_data.currentStatusOther})` : ""}
                                    </span>
                                  </div>
                                  <div className="col-span-2 sm:col-span-3">
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Short Motivation</span>
                                    <p className="text-slate-700 italic mt-0.5">{a.raw_data?.motivation || "No motivation provided."}</p>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">6-Month Commitment</span>
                                    <span className="font-semibold text-emerald-700">
                                      {Array.isArray(a.raw_data?.commitSixMonths) ? a.raw_data.commitSixMonths.join(", ") : a.raw_data?.commitSixMonths || "Yes"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Section B: Additional Details & Emergency Contacts */}
                              <div>
                                <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0111F]" />
                                  Section B — Additional Background & Consent
                                </h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                                  <div className="col-span-2 sm:col-span-4 bg-white p-2.5 rounded-lg border border-red-100 flex items-center justify-between">
                                    <div>
                                      <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                                        Fashion Training Track / Specialization
                                      </span>
                                      <span className="font-bold text-sm text-[#C0111F]">
                                        {Array.isArray(a.raw_data?.fashionTrack)
                                          ? a.raw_data.fashionTrack.join(", ")
                                          : a.raw_data?.fashionTrack || "Not Specified"}
                                      </span>
                                    </div>
                                    <span className="text-[10px] font-mono font-bold uppercase text-red-700 bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                                      Candidate Choice
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Origin</span>
                                    <span className="font-semibold text-slate-800">
                                      {a.raw_data?.stateOfOrigin || "—"} {a.raw_data?.lgaOfOrigin ? `/ ${a.raw_data.lgaOfOrigin}` : ""}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Marital Status</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.maritalStatus) ? a.raw_data.maritalStatus.join(", ") : a.raw_data?.maritalStatus || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Sewing Machine</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.hasSewingMachine) ? a.raw_data.hasSewingMachine.join(", ") : a.raw_data?.hasSewingMachine || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Post-Training Plan</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.afterTraining) ? a.raw_data.afterTraining.join(", ") : a.raw_data?.afterTraining || "—"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Experience in Fashion</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.hasFashionExp) ? a.raw_data.hasFashionExp.join(", ") : a.raw_data?.hasFashionExp || "No"}
                                      {a.raw_data?.fashionExpDetails ? ` (${a.raw_data.fashionExpDetails})` : ""}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Emergency Contact</span>
                                    <span className="font-semibold text-slate-800">
                                      {a.raw_data?.emergencyName || "—"} ({a.raw_data?.emergencyPhone || "—"})
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Parent/Guardian Consent</span>
                                    <span className="font-semibold text-slate-800">
                                      {a.raw_data?.guardianConsent || "N/A"} {a.raw_data?.guardianPhone ? `(${a.raw_data.guardianPhone})` : ""}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Special Needs</span>
                                    <span className="font-semibold text-slate-800">{a.raw_data?.specialNeeds || "None"}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Section C: Location & Attached Documents */}
                              <div>
                                <h5 className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mb-2.5 flex items-center gap-2">
                                  <span className="w-1.5 h-1.5 rounded-full bg-[#C0111F]" />
                                  Section C — Documents & Training Location
                                </h5>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50/80 p-4 rounded-xl border border-slate-200">
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">NIN / ID Number</span>
                                    <span className="font-semibold font-mono text-slate-800">{a.nin_number || "—"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">ID Type</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.ninType) ? a.raw_data.ninType.join(", ") : a.raw_data?.ninType || "NIN"}
                                    </span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Preferred Centre</span>
                                    <span className="font-semibold text-slate-800">{a.preferred_centre || "Enugu Head Centre"}</span>
                                  </div>
                                  <div>
                                    <span className="text-slate-400 block font-mono text-[10px] uppercase">Attached Documents</span>
                                    <span className="font-semibold text-slate-800">
                                      {Array.isArray(a.raw_data?.docsAttached) ? a.raw_data.docsAttached.join(", ") : a.raw_data?.docsAttached || "Passport Photo"}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* ═══════════════════════════════════════════════════════
                                  FOR OFFICIAL USE ONLY (SECRETARY DESK DOCKET)
                              ════════════════════════════════════════════════════════ */}
                              <div className="mt-6 border-2 border-slate-300 rounded-xl p-6 bg-slate-50/90 shadow-xs relative overflow-hidden">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 mb-5">
                                  <div className="flex items-center gap-2.5">
                                    <span className="w-3 h-3 rounded-full bg-[#C0111F]" />
                                    <span className="text-sm font-extrabold text-slate-800 uppercase tracking-widest font-mono">
                                      For Official Use Only
                                    </span>
                                    <span className="px-2 py-0.5 rounded bg-red-100 text-[#C0111F] text-[10px] font-mono font-bold uppercase">
                                      Secretary Review Docket
                                    </span>
                                  </div>
                                  <span className="text-[11px] font-mono text-slate-500">
                                    WMES Eastern Regional HQ / Admissions Desk
                                  </span>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs mb-5">
                                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Received &amp; Vetted by</span>
                                    <span className="font-mono font-bold text-slate-800">
                                      {a.raw_data?.officialUse?.reviewedBy || (isSecretary ? "Secretary Desk (Registry Admissions)" : "Admissions Secretariat")}
                                    </span>
                                  </div>
                                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Date Received / Docketed</span>
                                    <span className="font-mono font-bold text-slate-800">{fmtDate(a.created_at)}</span>
                                  </div>
                                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                                    <span className="text-[10px] text-slate-400 uppercase font-semibold block mb-1">Form No. / Portal ID</span>
                                    <span className="font-mono font-bold text-[#C0111F] text-sm">{a.form_no || a.matric_no}</span>
                                  </div>
                                </div>

                                {/* Docket Verification Checklist */}
                                <div className="bg-white p-4 rounded-xl border border-slate-200 mb-5">
                                  <span className="text-[10px] text-slate-500 uppercase font-bold block mb-2 tracking-wider">
                                    Docket Completeness Check
                                  </span>
                                  <div className="flex flex-wrap gap-4">
                                    {["Complete", "Incomplete"].map((opt) => {
                                      const current = checklistMap[a.id] || a.raw_data?.officialUse?.completeness || "Complete";
                                      const isSelected = current === opt;
                                      return (
                                        <button
                                          key={opt}
                                          type="button"
                                          onClick={() => setChecklistMap((prev) => ({ ...prev, [a.id]: opt }))}
                                          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                                            isSelected
                                              ? "border-red-600 bg-red-50 text-red-700"
                                              : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                          }`}
                                        >
                                          <span className={`w-3.5 h-3.5 rounded-sm border flex items-center justify-center ${isSelected ? "border-red-600 bg-red-600 text-white" : "border-slate-400"}`}>
                                            {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                                          </span>
                                          <span>{opt}</span>
                                        </button>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Official Remarks Input */}
                                <div className="mb-6">
                                  <label className="text-[10px] text-slate-600 uppercase font-bold block mb-1.5 tracking-wider">
                                    Official Secretariat Remarks &amp; Observations
                                  </label>
                                  <textarea
                                    value={remarksMap[a.id] ?? a.raw_data?.officialUse?.remarks ?? ""}
                                    onChange={(e) => setRemarksMap((prev) => ({ ...prev, [a.id]: e.target.value }))}
                                    placeholder="Enter official admission notes, physical verification observations, or approval conditions..."
                                    rows={2}
                                    className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:border-red-600 outline-none bg-white text-slate-800 placeholder:text-slate-300 shadow-xs resize-none"
                                  />
                                </div>

                                {/* Decision Actions Bar */}
                                <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                  <div>
                                    {a.status === "Approved" ? (
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Application Approved by Registry</span>
                                        {a.raw_data?.officialUse?.reviewedAt && (
                                          <span className="text-[10px] text-emerald-700 font-mono ml-1">
                                            ({fmtDate(a.raw_data.officialUse.reviewedAt)})
                                          </span>
                                        )}
                                      </div>
                                    ) : a.status === "Rejected" ? (
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
                                        <XCircle className="w-3.5 h-3.5 text-rose-600" />
                                        <span>Application Rejected / Not Approved</span>
                                        {a.raw_data?.officialUse?.reviewedAt && (
                                          <span className="text-[10px] text-rose-700 font-mono ml-1">
                                            ({fmtDate(a.raw_data.officialUse.reviewedAt)})
                                          </span>
                                        )}
                                      </div>
                                    ) : (
                                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                        <Clock className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                                        <span>Status: Pending Official Decision</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex items-center gap-3">
                                    <button
                                      disabled={updatingId === a.id}
                                      onClick={() => updateStatus(a.id, a.full_name, "Approved")}
                                      className={`px-4 py-2 rounded-xl text-white font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
                                        a.status === "Approved"
                                          ? "bg-emerald-700 ring-2 ring-emerald-400"
                                          : "bg-emerald-600 hover:bg-emerald-700"
                                      } disabled:opacity-50`}
                                    >
                                      <CheckCircle2 className="w-4 h-4" />
                                      <span>{a.status === "Approved" ? "Re-Approve / Save Notes" : "Approve Application"}</span>
                                    </button>

                                    <button
                                      disabled={updatingId === a.id}
                                      onClick={() => updateStatus(a.id, a.full_name, "Rejected")}
                                      className={`px-4 py-2 rounded-xl border text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                                        a.status === "Rejected"
                                          ? "bg-rose-600 text-white border-rose-600"
                                          : "border-rose-200 bg-rose-50 hover:bg-rose-100 text-rose-700"
                                      } disabled:opacity-50`}
                                    >
                                      <XCircle className="w-4 h-4" />
                                      <span>{a.status === "Rejected" ? "Rejected (Update)" : "Reject Application"}</span>
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 text-xs text-slate-500 font-mono">
          {apps.length} admissions record{apps.length !== 1 ? "s" : ""}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   TAB 4: PAYMENTS / TRANSACTIONS
───────────────────────────────── */
function PaymentsTab() {
  const [txns, setTxns] = useState<TransactionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  const loadTxns = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/transactions");
      const data = await res.json();
      if (data.success) {
        setTxns(data.transactions || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTxns();
  }, [loadTxns]);

  const totalCollected = txns
    .filter((t) => t.status === "Paid")
    .reduce((sum, t) => sum + Number(t.amount || 0), 0);

  const filteredTxns = txns.filter((t) => {
    if (filter === "all") return true;
    return (t.status || "").toLowerCase() === filter.toLowerCase();
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Ledger Summary Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-500">
            Total Revenue Cleared
          </span>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
            {fmtNGN(totalCollected)}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Confirmed payments processed through ALATPay Gateway
          </p>
        </div>

        <div className="flex items-center gap-2">
          {["all", "Paid", "Pending", "Failed"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${filter === f
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
                <th className="px-5 py-3.5">Student ID</th>
                <th className="px-5 py-3.5">Description</th>
                <th className="px-5 py-3.5">Amount</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Gateway Reference</th>
                <th className="px-5 py-3.5">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                    <span>Loading payment transactions…</span>
                  </td>
                </tr>
              ) : filteredTxns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-400">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filteredTxns.map((t) => (
                  <tr
                    key={t.id}
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    <td className="px-5 py-4 font-mono font-bold text-amber-600 whitespace-nowrap">
                      {t.matric_no}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-800 max-w-[240px] truncate">
                      {t.description || "General Fee"}
                    </td>
                    <td className="px-5 py-4 font-bold text-slate-900 whitespace-nowrap">
                      {fmtNGN(Number(t.amount || 0))}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <StatusBadge status={t.status} />
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-500 max-w-[160px] truncate">
                      {t.reference || "—"}
                    </td>
                    <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                      {fmtDateTime(t.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 text-xs text-slate-500 font-mono">
          {filteredTxns.length} transaction{filteredTxns.length !== 1 ? "s" : ""} recorded
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   TAB 5: FORM SUBMISSIONS
───────────────────────────────── */
function SubmissionsTab() {
  const [subs, setSubs] = useState<SubmissionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/submissions");
        const data = await res.json();
        if (data.success) {
          setSubs(data.submissions || []);
        }
      } catch {
        // ignore
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden animate-fade-in">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-mono text-[11px] uppercase tracking-wider">
              <th className="px-5 py-3.5">Submission Ref</th>
              <th className="px-5 py-3.5">Student ID</th>
              <th className="px-5 py-3.5">Form Category / Type</th>
              <th className="px-5 py-3.5">Submitted By</th>
              <th className="px-5 py-3.5">Date</th>
              <th className="px-5 py-3.5 text-right">Data Payload</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-amber-500" />
                  <span>Loading official form submissions…</span>
                </td>
              </tr>
            ) : subs.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400">
                  No form submissions currently stored in database.
                </td>
              </tr>
            ) : (
              subs.map((s) => {
                const isExpanded = expandedId === s.id;
                return (
                  <React.Fragment key={s.id}>
                    <tr className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-slate-500">
                        {String(s.id).slice(0, 10)}…
                      </td>
                      <td className="px-5 py-4 font-mono font-bold text-amber-600">
                        {s.matric_no || "—"}
                      </td>
                      <td className="px-5 py-4 font-semibold text-slate-800">
                        {s.form_type || s.type || "General Submission"}
                      </td>
                      <td className="px-5 py-4 text-slate-600 text-xs">
                        {s.submitted_by || s.name || "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-500 whitespace-nowrap">
                        {fmtDateTime(s.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() =>
                            setExpandedId(isExpanded ? null : s.id)
                          }
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-blue-600 text-xs font-semibold cursor-pointer transition-colors"
                        >
                          {isExpanded ? "Hide JSON" : "Inspect Payload"}
                        </button>
                      </td>
                    </tr>

                    {isExpanded && (
                      <tr className="bg-slate-900 text-white">
                        <td colSpan={6} className="p-5 font-mono text-xs">
                          <pre className="overflow-x-auto whitespace-pre-wrap max-h-72 text-slate-300">
                            {JSON.stringify(s, null, 2)}
                          </pre>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="px-5 py-3 bg-slate-50/80 border-t border-slate-200/80 text-xs text-slate-500 font-mono">
        {subs.length} submission{subs.length !== 1 ? "s" : ""}
      </div>
    </div>
  );
}

/* ─────────────────────────────────
   TAB 6: STUDENT VALIDATION DESK
───────────────────────────────── */
function ValidationTab({
  initialQuery = "",
  onToast,
}: {
  initialQuery?: string;
  onToast?: (msg: string) => void;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [dossierSection, setDossierSection] = useState<"overview" | "application" | "ledger">("overview");

  // Keep in sync with initialQuery prop if clicked from student/admissions table
  useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
      handleLookup(undefined, initialQuery);
    }
  }, [initialQuery]);

  const handleLookup = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const q = (customQuery !== undefined ? customQuery : query).trim();
    if (!q) return;

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await fetch(
        `/api/portal?matricNo=${encodeURIComponent(q)}&email=${encodeURIComponent(q)}`
      );
      const data = await res.json();
      if (!data.success || !data.profile) {
        setError(
          `No student record was found matching "${q}". Please verify the Student Portal ID (e.g. WMES/FTP/27A/0001), Form Number, or Registered Email and try again.`
        );
      } else {
        setResult(data);
      }
    } catch {
      setError("Network or server communication error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResult(null);
    setError("");
  };

  const copySummary = () => {
    if (!result?.profile) return;
    const p = result.profile;
    const funding = result.fundingDocket;
    const app = result.application;
    const track =
      result.selectedTrack && result.selectedTrack !== "Not Selected Yet"
        ? result.selectedTrack
        : app?.raw_data?.fashionTrack
        ? Array.isArray(app.raw_data.fashionTrack)
          ? app.raw_data.fashionTrack.join(", ")
          : app.raw_data.fashionTrack
        : p.track || "Not Selected";

    const isScholarship = Boolean(funding?.isScholarship);
    const sch = funding?.scholarshipDetails;

    const text = `WMES Student Clearance Dossier
=========================================
STUDENT: ${p.name}
PORTAL ID: ${p.matric_no}
EMAIL: ${p.email}
PHONE: ${p.phone || "No phone recorded"}
KYC VERIFICATION: ${p.verification_status || "Pending"}
ADMISSIONS STATUS: ${app?.status || "None Submitted"}

ACADEMIC FOCUS:
Selected Fashion Track: ${track}
Training Centre: ${app?.preferred_centre || "Enugu Head Centre"}

FUNDING & ENTRY STATUS:
Entry Method: ${funding?.entryStatus || (isScholarship ? "Scholarship" : "Self-Paid")}
${
  isScholarship && sch
    ? `Scholarship: ${sch.scholarshipTitle}
Sponsor: ${sch.sponsorName} (${sch.sponsorCategory || "Endowment Partner"})
Token Code: ${sch.tokenCode}
Coverage: ${
        sch.coverage === "both"
          ? "Full Grant (Forms ₦10,000 + Tuition ₦100,000)"
          : sch.coverage === "tuition"
          ? "Tuition Only Grant (₦100,000)"
          : "Forms Access Grant (₦10,000)"
      }`
    : `Direct Payment: ₦${Number(funding?.totalPaidAmount || 0).toLocaleString()} settled via ALATPay`
}

DOCKET STATUS:
- Application / Form Fee: ${funding?.formFeeCleared ? "CLEARED" : "UNPAID"} (${funding?.formFeeSource || "N/A"})
- Tuition / Programme Fee: ${funding?.tuitionCleared ? "CLEARED" : "OUTSTANDING"} (${funding?.tuitionSource || "N/A"})

Verified via WMES Registry / Secretary Desk`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    if (onToast) onToast("Clearance dossier copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-4xl space-y-6 animate-fade-in pb-12">
      {/* Intro & Search Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight">
              Student Credential, Funding & Clearance Desk
            </h2>
            <p className="text-xs text-slate-500">
              Instant verification of academic admission, selected fashion track, payment dockets, and scholarship grant records.
            </p>
          </div>
        </div>

        <form onSubmit={handleLookup} className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-6">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Student ID, Form No, or Email (e.g. WMES/FTP/27A/0001)"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-slate-50/60 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none font-mono focus:bg-white focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer disabled:opacity-60 shrink-0"
            >
              {loading ? (
                <RefreshCw className="w-4 h-4 animate-spin text-amber-400" />
              ) : (
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              )}
              <span>Verify & Lookup</span>
            </button>

            {(result || error) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3.5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-500 text-xs font-semibold cursor-pointer transition-colors shrink-0"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 flex items-start gap-3 text-rose-700 animate-shake">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm font-medium">{error}</div>
        </div>
      )}

      {/* Result Dossier Card */}
      {result && (() => {
        const {
          profile,
          application,
          selectedTrack,
          fundingDocket,
          scholarshipToken,
          transactions = [],
        } = result;

        const isKycVerified = profile?.verification_status === "Verified";
        const isScholarship = Boolean(fundingDocket?.isScholarship);
        const isSelfPaid = Boolean(fundingDocket?.isSelfPaid);
        const entryStatus = fundingDocket?.entryStatus || (isScholarship ? "Scholarship" : isSelfPaid ? "Self-Paid" : "Unpaid");
        const sch = fundingDocket?.scholarshipDetails;
        const formFeeCleared = Boolean(fundingDocket?.formFeeCleared);
        const tuitionCleared = Boolean(fundingDocket?.tuitionCleared);
        const totalPaid = Number(fundingDocket?.totalPaidAmount || 0);
        const grantValue = Number(fundingDocket?.scholarshipGrantValue || 0);

        const trackDisplay =
          selectedTrack && selectedTrack !== "Not Selected Yet"
            ? selectedTrack
            : application?.raw_data?.fashionTrack
            ? Array.isArray(application.raw_data.fashionTrack)
              ? application.raw_data.fashionTrack.join(", ")
              : application.raw_data.fashionTrack
            : profile?.track && profile?.track !== "Pending"
            ? profile.track
            : "Not Selected Yet";

        const rawData = application?.raw_data || {};
        const txns: any[] = transactions || [];

        return (
          <div className="space-y-6 animate-scale-in">
            {/* 1. MAIN STUDENT IDENTITY CARD */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                <div className="flex items-center gap-4">
                  {/* Photo or Initials */}
                  <div className="w-16 h-20 rounded-xl bg-slate-100 border border-slate-300 overflow-hidden shrink-0 shadow-xs relative">
                    {profile?.avatar_url || application?.passport_photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profile?.avatar_url || application?.passport_photo_url}
                        alt={profile.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-amber-500/10 text-amber-700 font-black text-2xl flex items-center justify-center">
                        {(profile.name || "S").charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                        {profile.name}
                      </h3>
                      <StatusBadge status={profile.verification_status} />
                      {application?.status && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${
                          application.status === "Approved"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : application.status === "Rejected"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }`}>
                          Admission: {application.status}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 font-mono mt-1">
                      {profile.email} &bull; {profile.phone || application?.phone || "No phone recorded"}
                    </p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="font-mono font-bold text-xs text-[#C0111F] bg-red-50 border border-red-200 px-2 py-0.5 rounded">
                        Portal ID: {profile.matric_no}
                      </span>
                      {profile.enrolled_date && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Registered: {profile.enrolled_date}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 self-start sm:self-auto">
                  <button
                    onClick={copySummary}
                    className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-xs cursor-pointer"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>{copied ? "Copied!" : "Copy Clearance"}</span>
                  </button>
                </div>
              </div>

              {/* 3 Core Clearance Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-6">
                {/* Pillar 1: KYC Status */}
                <div
                  className={`rounded-2xl p-4 border text-center ${
                    isKycVerified
                      ? "bg-emerald-50/80 border-emerald-200 text-emerald-800"
                      : "bg-amber-50/80 border-amber-200 text-amber-800"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest block mb-1">
                    KYC Verification
                  </span>
                  <div className="text-base font-bold flex items-center justify-center gap-1.5">
                    {isKycVerified ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Verified</span>
                      </>
                    ) : (
                      <>
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Pending Review</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Pillar 2: Funding Entry Method */}
                <div
                  className={`rounded-2xl p-4 border text-center ${
                    isScholarship
                      ? "bg-amber-50/80 border-amber-200 text-amber-900"
                      : isSelfPaid
                      ? "bg-blue-50/80 border-blue-200 text-blue-900"
                      : "bg-rose-50/80 border-rose-200 text-rose-800"
                  }`}
                >
                  <span className="text-[10px] font-mono uppercase tracking-widest block mb-1">
                    Entry &amp; Funding Status
                  </span>
                  <div className="text-base font-black flex items-center justify-center gap-1.5">
                    {isScholarship ? (
                      <>
                        <GraduationCap className="w-4 h-4 text-amber-600" />
                        <span>Scholarship Grant</span>
                      </>
                    ) : isSelfPaid ? (
                      <>
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>Self-Paid (Direct)</span>
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-4 h-4 text-rose-600" />
                        <span>Unpaid</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Pillar 3: Admission Status */}
                <div className="rounded-2xl p-4 border border-slate-200 bg-slate-50 text-slate-800 text-center">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 block mb-1">
                    Admission Form Status
                  </span>
                  <div className="text-base font-bold">
                    {application?.status || "None Submitted"}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. SELECTED FASHION TRAINING TRACK (CRITICAL SPECIFICATION) */}
            <div className="bg-gradient-to-br from-red-50/80 via-white to-amber-50/40 rounded-3xl p-6 sm:p-7 border-2 border-red-200/90 shadow-sm relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#C0111F] text-white flex items-center justify-center font-black shadow-md shadow-red-600/20">
                    <Scissors className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C0111F] block">
                      Enrolled Academic Focus
                    </span>
                    <h3 className="text-base sm:text-lg font-black text-slate-900">
                      Selected Fashion Training Track
                    </h3>
                  </div>
                </div>

                <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-mono font-bold bg-white text-slate-700 border border-slate-200 shadow-xs">
                  6-Month Fashion Programme 2026/2027
                </span>
              </div>

              <div className="mt-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-red-100 shadow-xs">
                  <div>
                    <span className="text-[11px] text-slate-500 font-semibold uppercase font-mono block mb-1">
                      Applicant Selected Specialization:
                    </span>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#C0111F] text-white font-black text-base sm:text-lg tracking-wide shadow-md shadow-red-700/20">
                      {trackDisplay.toLowerCase().includes("male") && trackDisplay.toLowerCase().includes("female") ? (
                        <span>👔👗 Both (Male &amp; Female Fashion Making)</span>
                      ) : trackDisplay.toLowerCase().includes("both") ? (
                        <span>👔👗 Both (Male &amp; Female Fashion Making)</span>
                      ) : trackDisplay.toLowerCase().includes("male") ? (
                        <span>👔 Male Fashion Making</span>
                      ) : trackDisplay.toLowerCase().includes("female") ? (
                        <span>👗 Female Fashion Making</span>
                      ) : (
                        <span>{trackDisplay}</span>
                      )}
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 font-mono uppercase block font-semibold">
                      Training Centre
                    </span>
                    <span className="text-sm font-bold text-slate-900 block mt-0.5">
                      {application?.preferred_centre || "Enugu Head Centre"}
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      Location: {Array.isArray(rawData?.preferredLocation) ? rawData.preferredLocation.join(", ") : rawData?.preferredLocation || "Enugu"}
                    </span>
                  </div>
                </div>

                {/* Additional vocational details */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                      Previous Fashion Experience
                    </span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">
                      {Array.isArray(rawData?.hasFashionExp) ? rawData.hasFashionExp.join(", ") : rawData?.hasFashionExp || "None"}
                    </span>
                    {rawData?.fashionExpDetails && (
                      <p className="text-[11px] text-slate-600 mt-1 italic leading-snug">
                        &ldquo;{rawData.fashionExpDetails}&rdquo;
                      </p>
                    )}
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                      Sewing Machine Access
                    </span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">
                      {Array.isArray(rawData?.hasSewingMachine) ? rawData.hasSewingMachine.join(", ") : rawData?.hasSewingMachine || "No machine access"}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      WMES studio equipment available for practicals
                    </span>
                  </div>

                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200">
                    <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold">
                      Post-Training Goal
                    </span>
                    <span className="font-bold text-slate-800 text-sm block mt-0.5">
                      {Array.isArray(rawData?.afterTraining) ? rawData.afterTraining.join(", ") : rawData?.afterTraining || "Not specified"}
                      {rawData?.afterTrainingOther ? ` (${rawData.afterTrainingOther})` : ""}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Career trajectory following graduation
                    </span>
                  </div>
                </div>

                {rawData?.motivation && (
                  <div className="bg-white/90 p-3.5 rounded-xl border border-slate-200 text-xs">
                    <span className="text-slate-400 font-mono text-[10px] uppercase font-bold block mb-1">
                      Short Motivation from Applicant
                    </span>
                    <p className="text-slate-700 italic leading-relaxed">
                      &ldquo;{rawData.motivation}&rdquo;
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* 3. FUNDING & SCHOLARSHIP CLASSIFICATION (CRITICAL SPECIFICATION) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold flex items-center gap-1.5">
                  <GraduationCap className="w-4 h-4 text-slate-400" />
                  <span>Fee Payment &amp; Scholarship Classification</span>
                </h4>
                <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full border border-slate-200">
                  Classification: {entryStatus}
                </span>
              </div>

              {/* SCHOLARSHIP STUDENT VIEW */}
              {isScholarship ? (
                <div className="bg-gradient-to-br from-amber-500/10 via-amber-50/60 to-emerald-50/50 rounded-3xl p-6 sm:p-7 border-2 border-amber-300 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-amber-200/80">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shadow-md shadow-amber-500/20">
                        <GraduationCap className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500 text-white shadow-xs">
                            Scholarship Beneficiary
                          </span>
                          <span className="text-xs text-amber-900 font-bold">
                            Endowment Verified
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                          {sch?.scholarshipTitle || "WMES Educational Scholarship Grant"}
                        </h3>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
                        Total Grant Value
                      </span>
                      <span className="text-lg font-black text-emerald-700">
                        {fmtNGN(grantValue || (sch?.coverage === "forms" ? 10000 : sch?.coverage === "tuition" ? 100000 : 110000))}
                      </span>
                    </div>
                  </div>

                  {/* Scholarship Specific Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-5 text-xs">
                    <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Scholarship Sponsor
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm block mt-1">
                        {sch?.sponsorName || "Community Endowment Partner"}
                      </span>
                      <span className="text-[11px] text-amber-700 font-semibold mt-0.5 block">
                        Category: {sch?.sponsorCategory || "Philanthropic Endowment"}
                      </span>
                    </div>

                    <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Awarded Token Code
                      </span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono font-black text-xs text-amber-900 bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                          {sch?.tokenCode || "Registry Grant Award"}
                        </span>
                        {sch?.tokenCode && (
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(sch.tokenCode);
                              setTokenCopied(true);
                              if (onToast) onToast(`Copied token: ${sch.tokenCode}`);
                              setTimeout(() => setTokenCopied(false), 2000);
                            }}
                            className="p-1 text-slate-400 hover:text-slate-800 cursor-pointer"
                            title="Copy Token Code"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      {tokenCopied && (
                        <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                          Copied to clipboard!
                        </span>
                      )}
                      {sch?.batchCode && (
                        <span className="text-[10px] font-mono text-slate-400 block mt-1">
                          Batch: {sch.batchCode}
                        </span>
                      )}
                    </div>

                    <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Grant Coverage Scope
                      </span>
                      <span className="inline-block mt-1 font-bold text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {sch?.coverage === "both"
                          ? "Full Grant (Forms + Tuition)"
                          : sch?.coverage === "tuition"
                          ? "Tuition Only Grant"
                          : "Forms Access Grant"}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {sch?.coverage === "both"
                          ? "100% Covered (₦10,000 Form + ₦100,000 Tuition)"
                          : sch?.coverage === "tuition"
                          ? "Covers ₦100,000 Tuition Fee"
                          : "Covers ₦10,000 Form Access Fee"}
                      </span>
                    </div>

                    <div className="bg-white/95 p-3.5 rounded-2xl border border-amber-200 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Award / Verification Date
                      </span>
                      <span className="font-bold text-slate-900 block mt-1">
                        {sch?.redeemedAt ? fmtDate(sch.redeemedAt) : "Active on Registry"}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 mt-1 font-semibold">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Verified via Super Admin / Desk
                      </span>
                    </div>
                  </div>
                </div>
              ) : isSelfPaid ? (
                /* SELF PAID STUDENT VIEW */
                <div className="bg-gradient-to-br from-blue-50/80 via-white to-emerald-50/50 rounded-3xl p-6 sm:p-7 border-2 border-blue-200 shadow-sm relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-black shadow-md shadow-blue-600/20">
                        <CreditCard className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-blue-600 text-white shadow-xs">
                            Direct Payment (Self-Funded)
                          </span>
                          <span className="text-xs text-blue-900 font-bold">
                            Direct Student Settlement
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">
                          Settled via Online Payment Gateway (ALATPay)
                        </h3>
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block font-semibold">
                        Total Amount Paid
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {fmtNGN(totalPaid)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-5 text-xs">
                    <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Form Access Fee (₦10,000)
                      </span>
                      <span className={`font-bold text-sm block mt-1 ${formFeeCleared ? "text-emerald-700" : "text-rose-600"}`}>
                        {formFeeCleared ? "Cleared (₦10,000)" : "Unpaid"}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {formFeeCleared ? "Paid directly by student via ALATPay" : "Pending checkout"}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Tuition &amp; Studio Fee (₦100,000)
                      </span>
                      <span className={`font-bold text-sm block mt-1 ${tuitionCleared ? "text-emerald-700" : "text-amber-600"}`}>
                        {tuitionCleared ? "Cleared (₦100,000)" : "Outstanding (₦100,000 due)"}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {tuitionCleared ? "Full 6-month programme tuition settled" : "Due before studio practicals"}
                      </span>
                    </div>

                    <div className="bg-white p-3.5 rounded-2xl border border-blue-100 shadow-xs">
                      <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                        Payment Gateway Details
                      </span>
                      <span className="font-extrabold text-slate-900 text-sm block mt-1">
                        ALATPay Card &amp; Bank Settlement
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
                        {fundingDocket?.paidTransactionsCount || 0} transaction{(fundingDocket?.paidTransactionsCount || 0) !== 1 ? "s" : ""} on record
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                /* UNPAID STUDENT VIEW */
                <div className="bg-rose-50/70 rounded-3xl p-6 border-2 border-rose-200 shadow-sm flex items-start gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-rose-500 text-white flex items-center justify-center font-black shrink-0 shadow-md shadow-rose-500/20">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm sm:text-base font-extrabold text-rose-900">
                      No Fee Payment or Scholarship Token Recorded
                    </h4>
                    <p className="text-xs text-rose-700 mt-1 leading-relaxed">
                      This student has neither paid the mandatory Form Access fee (₦10,000) nor Tuition (₦100,000), and has not redeemed an active scholarship token. Both dockets remain outstanding.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 4. MANDATORY ACADEMIC DOCKETS SUMMARY */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md">
              <h4 className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold mb-4">
                Mandatory Academic Clearance Dockets
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Docket 1: Form Fee */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Application / Form Access Docket (₦10,000)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Funding Source: <span className="font-semibold text-slate-700">{fundingDocket?.formFeeSource}</span>
                    </p>
                  </div>
                  <div>
                    {formFeeCleared ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1.5 rounded-full border border-rose-200 shadow-xs">
                        <X className="w-3.5 h-3.5 text-rose-600" />
                        Unpaid
                      </span>
                    )}
                  </div>
                </div>

                {/* Docket 2: Tuition Fee */}
                <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 flex items-center justify-between">
                  <div>
                    <p className="text-xs font-bold text-slate-900">
                      Tuition &amp; Studio Practical Docket (₦100,000)
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Funding Source: <span className="font-semibold text-slate-700">{fundingDocket?.tuitionSource}</span>
                    </p>
                  </div>
                  <div>
                    {tuitionCleared ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 shadow-xs">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        Cleared
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200 shadow-xs">
                        <Clock className="w-3.5 h-3.5 text-amber-600" />
                        Outstanding
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. COMPLETE STUDENT APPLICATION & REGISTRY DOSSIER */}
            {application && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-md">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#C0111F]" />
                    <h4 className="text-sm font-bold text-slate-900">
                      Official Admission Form Details (Registry Form #{application.form_no || profile.matric_no})
                    </h4>
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Submitted: {fmtDate(application.created_at)}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
                  {/* Section A Details */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 text-xs">
                    <h5 className="font-mono font-bold text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-[#C0111F]" />
                      Section A — Personal Information
                    </h5>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Full Name</span>
                      <span className="font-semibold text-slate-900">{application.full_name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Gender &amp; Age</span>
                      <span className="font-semibold text-slate-900">
                        {application.gender || "—"}, {application.age ? `${application.age} yrs` : "—"} (DOB: {application.dob || "—"})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Highest Education</span>
                      <span className="font-semibold text-slate-900">{application.education || "—"}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Current Employment Status</span>
                      <span className="font-semibold text-slate-900">
                        {Array.isArray(application.current_status) ? application.current_status.join(", ") : application.current_status || "—"}
                        {rawData?.currentStatusOther ? ` (${rawData.currentStatusOther})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Residential Address</span>
                      <span className="font-semibold text-slate-900">{application.address || "—"}</span>
                    </div>
                  </div>

                  {/* Section B Details */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 text-xs">
                    <h5 className="font-mono font-bold text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#C0111F]" />
                      Section B — Origin &amp; Background
                    </h5>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">State &amp; LGA of Origin</span>
                      <span className="font-semibold text-slate-900">
                        {rawData?.stateOfOrigin || "—"} {rawData?.lgaOfOrigin ? `/ ${rawData.lgaOfOrigin}` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Marital Status</span>
                      <span className="font-semibold text-slate-900">
                        {Array.isArray(rawData?.maritalStatus) ? rawData.maritalStatus.join(", ") : rawData?.maritalStatus || "—"}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Emergency Contact</span>
                      <span className="font-semibold text-slate-900">
                        {rawData?.emergencyName || "—"} ({rawData?.emergencyPhone || "—"})
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Guardian Consent</span>
                      <span className="font-semibold text-slate-900">
                        {rawData?.guardianConsent || "N/A"} {rawData?.guardianPhone ? `(${rawData.guardianPhone})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Special Needs</span>
                      <span className="font-semibold text-slate-900">{rawData?.specialNeeds || "None"}</span>
                    </div>
                  </div>

                  {/* Section C & Secretary Review */}
                  <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-2.5 text-xs">
                    <h5 className="font-mono font-bold text-[10px] uppercase text-slate-400 flex items-center gap-1.5">
                      <BookOpen className="w-3 h-3 text-[#C0111F]" />
                      Section C — Registry &amp; Identity
                    </h5>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">NIN / National ID</span>
                      <span className="font-semibold text-slate-900">
                        {application.nin_number || "—"} {rawData?.ninType ? `(${Array.isArray(rawData.ninType) ? rawData.ninType.join(", ") : rawData.ninType})` : ""}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Attached Documents</span>
                      <span className="font-semibold text-slate-900">
                        {Array.isArray(rawData?.docsAttached) ? rawData.docsAttached.join(", ") : rawData?.docsAttached || "Passport Photograph"}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Secretary Desk Official Review</span>
                      <span className="font-bold text-slate-900 block mt-0.5">
                        Status: <span className="text-[#C0111F]">{application.status}</span>
                      </span>
                      {rawData?.officialUse?.reviewedBy && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Reviewed By: {rawData.officialUse.reviewedBy}
                        </p>
                      )}
                      {rawData?.officialUse?.remarks && (
                        <p className="text-[11px] text-slate-700 italic mt-0.5 bg-white p-2 rounded border border-slate-200">
                          &ldquo;{rawData.officialUse.remarks}&rdquo;
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 6. FINANCIAL TRANSACTION LEDGER */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-md">
              <h4 className="text-base font-bold text-slate-900 mb-4 flex items-center justify-between">
                <span>Student Transaction &amp; Payment History ({txns.length})</span>
                <span className="text-xs font-mono font-normal text-slate-500">
                  Total Recorded: {txns.length}
                </span>
              </h4>
              <div className="divide-y divide-slate-100">
                {txns.length === 0 ? (
                  <p className="text-xs text-slate-400 py-6 text-center font-mono">
                    No payment transactions registered for this student account.
                  </p>
                ) : (
                  txns.map((t: any) => (
                    <div
                      key={t.id}
                      className="py-3.5 flex items-center justify-between flex-wrap gap-2 hover:bg-slate-50/70 px-2 rounded-xl transition-colors"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs sm:text-sm font-bold text-slate-900">
                            {t.description || "Tuition / Fee Payment"}
                          </p>
                          {t.method === "Scholarship Grant" && (
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-50 text-amber-800 border border-amber-200">
                              Scholarship Voucher
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          Ref: {t.reference || t.id} &bull; Method: {t.method || "ALATPay"} &bull; {fmtDateTime(t.created_at)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="text-xs sm:text-sm font-bold text-slate-900">
                          {fmtNGN(Number(t.amount || 0))}
                        </p>
                        <StatusBadge status={t.status} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
