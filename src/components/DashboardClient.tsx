"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import WMESApplicationForm from "./WMESApplicationForm";
import { initiateAlatpayPayment } from "@/lib/alatpay";
import ShieldedVideoPlayer from "./ShieldedVideoPlayer";
import { compressImageFile } from "@/lib/imageCompression";
import {
  LayoutDashboard,
  BookOpen,
  Video,
  CreditCard,
  FileText,
  Award,
  Search,
  Bell,
  User,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Check,
  CheckCircle2,
  Clock,
  Download,
  ExternalLink,
  Eye,
  FileCheck,
  Filter,
  GraduationCap,
  HelpCircle,
  Lock,
  LogOut,
  Menu,
  Play,
  Plus,
  RefreshCw,
  Share2,
  UploadCloud,
  X,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  Send,
  Building,
  Briefcase,
  QrCode,
  SlidersHorizontal,
  FileBadge,
  Phone,
  Mail,
  MapPin,
  CheckCheck,
  Sparkles,
  Camera,
} from "lucide-react";

// Navigation tabs
export type TabType =
  | "overview"
  | "programme"
  | "recorded"
  | "payment"
  | "profile"
  | "forms"
  | "certificate"
  | "scholarship";

// Core Data Types

interface RecordedLecture {
  id: number | string;
  title: string;
  programme: string;
  category: string;
  duration: string;
  instructor: string;
  instructorRole: string;
  date: string;
  thumbnail: string;
  views: number;
  description: string;
  slideUrl: string;
  videoUrl?: string;
  youtubeVideoId?: string;
  targetTrack?: "male" | "female" | "both";
  notes?: string;
}

interface PaymentTransaction {
  id: string;
  date: string;
  description: string;
  type: string;
  amount: number;
  method: string;
  status: "Paid" | "Pending" | "Failed";
  receiptNo: string;
  paidBy?: string;
  reference?: string;
}

interface InstitutionalForm {
  id: string;
  title: string;
  category: "Academic" | "Administrative" | "Advisory" | "Financial";
  eta: string;
  desc: string;
  requirements: string[];
  pdfTemplateUrl: string;
}

interface FormSubmission {
  ticketId: string;
  formTitle: string;
  date: string;
  status: "Submitted" | "Dean Review" | "Approved";
  notes: string;
}

interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  type:
    | "payment_success"
    | "payment_failed"
    | "form_unlocked"
    | "programme_unlocked"
    | "video_uploaded"
    | "form_update"
    | "verification"
    | "system";
  category: "payment" | "forms" | "programme" | "video" | "system";
  linkTab?: TabType;
  createdAt: string;
  timeAgo: string;
  read: boolean;
  badgeColor?: string;
}

export default function DashboardClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Active Tab State
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Search & Filters
  const [globalSearch, setGlobalSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(true);

  // Live Notifications State from Database
  const [notifications, setNotifications] = useState<DashboardNotification[]>([]);
  const [readNotifIds, setReadNotifIds] = useState<string[]>([]);
  const notificationsRef = useRef<HTMLDivElement>(null);

  // Load read notification IDs from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("wmes_read_notifications");
      if (stored) {
        setReadNotifIds(JSON.parse(stored));
      }
    } catch (_e) {}
  }, []);

  // Click outside to close notifications dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        notificationsRef.current &&
        !notificationsRef.current.contains(event.target as Node)
      ) {
        setNotificationsOpen(false);
      }
    }
    if (notificationsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [notificationsOpen]);

  const handleMarkNotificationRead = (id: string) => {
    setReadNotifIds((prev) => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      try {
        localStorage.setItem("wmes_read_notifications", JSON.stringify(next));
      } catch (_e) {}
      return next;
    });
  };

  const handleMarkAllNotificationsRead = () => {
    const allIds = notifications.map((n) => n.id);
    setReadNotifIds(allIds);
    try {
      localStorage.setItem("wmes_read_notifications", JSON.stringify(allIds));
    } catch (_e) {}
  };

  const handleNotificationClick = (n: DashboardNotification) => {
    handleMarkNotificationRead(n.id);
    if (n.linkTab) {
      setActiveTab(n.linkTab);
      setNotificationsOpen(false);
    }
  };

  const unreadCount = notifications.filter(
    (n) => !n.read && !readNotifIds.includes(n.id)
  ).length;

  // Helper: compute elegant student initials for avatar fallback
  const getUserInitials = (name?: string) => {
    if (!name?.trim()) return "ST";
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // User Profile State
  const [userData, setUserData] = useState({
    name: "",
    matricNo: "",
    email: "",
    phone: "",
    role: "",
    track: "Pending",
    registryHub: "",
    verificationStatus: "Pending",
    accreditationStatus: "",
    enrolledDate: "",
    twoFactorEnabled: false,
    profilePhoto: null as string | null,
  });

  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // Enrolled Programme State from DB
  const [programme, setProgramme] = useState<{
    id: string;
    title: string;
    track: string;
    description: string;
    director?: string;
    accreditation?: string;
  } | null>(null);

  // Student Application Record from DB
  const [application, setApplication] = useState<any>(null);

  // Modals & Interactive Viewers
  const [activeRecording, setActiveRecording] = useState<RecordedLecture | null>(null);
  const [studentSelectedTrack, setStudentSelectedTrack] = useState<string>("");
  const [recordingFilter, setRecordingFilter] = useState<"all" | "male" | "female">("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showFormModal, setShowFormModal] = useState<InstitutionalForm | null>(null);

  // Dynamic toast banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Check query param for new welcome
  useEffect(() => {
    if (searchParams.get("new") === "true" || searchParams.get("welcome") === "new") {
      triggerToast("Welcome to WMES! Your student account is active.");
    }
  }, [searchParams]);

  // Hydrate user profile from active session in localStorage (created on signup/login)
  useEffect(() => {
    try {
      const sessionStr = localStorage.getItem("wmes_session");
      if (sessionStr) {
        const session = JSON.parse(sessionStr);
        const matric =
          session.matricNo && session.matricNo.startsWith("WMES/FTP/27A/")
            ? session.matricNo
            : "";
        const email = session.email || "";
        const savedPhoto =
          session.avatarUrl ||
          session.avatar_url ||
          session.profilePhoto ||
          localStorage.getItem(`wmes_profile_photo_${matric}`) ||
          localStorage.getItem(`wmes_profile_photo_${email}`);

        setUserData((prev) => ({
          ...prev,
          name: session.name || prev.name,
          matricNo: matric || prev.matricNo,
          email: email || prev.email,
          phone: session.phone || prev.phone,
          role: session.tier || session.role || prev.role,
          profilePhoto: savedPhoto || prev.profilePhoto,
        }));
      }
    } catch (_e) {}
  }, []);

  // Dynamic Time Greeting
  const [greeting, setGreeting] = useState("Welcome");
  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 17) setGreeting("Good afternoon");
    else setGreeting("Good evening");
  }, []);

  // ─────────────────────────────────────────────────────────────
  // LIVE DATA FROM SUPABASE
  // ─────────────────────────────────────────────────────────────

  // Recorded Sessions — populated from Supabase via /api/portal
  const [recordings, setRecordings] = useState<RecordedLecture[]>([]);

  // Payment Transactions — populated exclusively from Supabase via /api/portal
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);

  // Derived Access & Balance States for the 2 Dockets
  const hasPaidForms = transactions.some(
    (t) =>
      (t.description.toLowerCase().includes("forms") || Number(t.amount) === 10000 || Number(t.amount) === 100) &&
      t.status === "Paid"
  );
  const hasPaidProgramme = transactions.some(
    (t) =>
      (t.description.toLowerCase().includes("programme") ||
        t.description.toLowerCase().includes("tailoring") ||
        t.description.toLowerCase().includes("fashion") ||
        Number(t.amount) >= 100000) &&
      t.status === "Paid"
  );
  const hasPaidBoth = hasPaidForms && hasPaidProgramme;

  // Scholarship & Endowment States
  const [scholarshipApp, setScholarshipApp] = useState<any>(null);
  const [scholarshipToken, setScholarshipToken] = useState<any>(null);

  const scholarshipTxn = transactions.find(
    (t) =>
      t.method === "Scholarship Grant" ||
      t.description?.toLowerCase().includes("scholarship")
  );
  const isScholarshipRecipient =
    Boolean(scholarshipTxn) ||
    Boolean(scholarshipToken) ||
    userData.role === "Scholarship Scholar";
  const scholarshipSponsor =
    scholarshipTxn?.paidBy ||
    scholarshipToken?.sponsor_name ||
    (userData as any).sponsor_name ||
    "Institutional Endowment";

  const [tokenInput, setTokenInput] = useState("");
  const [isRedeemingToken, setIsRedeemingToken] = useState(false);
  const [redeemError, setRedeemError] = useState("");
  const [redeemSuccess, setRedeemSuccess] = useState<any>(null);

  // Financial Aid Application States (Waitlist)
  const [aidState, setAidState] = useState("");
  const [aidLga, setAidLga] = useState("");
  const [aidReason, setAidReason] = useState("");
  const [aidGuarantor, setAidGuarantor] = useState("");
  const [isSubmittingAid, setIsSubmittingAid] = useState(false);
  const [aidSubmitted, setAidSubmitted] = useState(false);

  // Guard flags: Token can only be activated once; Aid can only be applied for once
  const hasActivatedScholarship = Boolean(
    isScholarshipRecipient || scholarshipToken || redeemSuccess
  );
  const hasAppliedForScholarship = Boolean(scholarshipApp || aidSubmitted);

  const handleRedeemScholarshipToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasActivatedScholarship) {
      setRedeemError("You have already activated your scholarship token.");
      return;
    }
    if (!tokenInput.trim()) {
      setRedeemError("Please enter your scholarship token.");
      return;
    }
    setIsRedeemingToken(true);
    setRedeemError("");

    try {
      const res = await fetch("/api/scholarships/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tokenCode: tokenInput.trim(),
          matricNo: userData.matricNo,
          name: userData.name,
          email: userData.email,
        }),
      });
      const data = await res.json();
      setIsRedeemingToken(false);

      if (res.ok && data.success) {
        setRedeemSuccess(data);
        setScholarshipToken(data);
        triggerToast(`🎉 Scholarship Activated! Sponsored by ${data.sponsorName}.`);

        setUserData((prev) => ({
          ...prev,
          role: "Scholarship Scholar",
          track: "Tailoring",
        }));

        const newTuitionTxn: PaymentTransaction = {
          id: `TXN-SCH-${Date.now()}`,
          date: "Today, Just Now",
          description: `Payment for Fashion Training Programme (Scholarship Grant - ${data.sponsorName})`,
          type: "Programme Tuition (Scholarship)",
          amount: 100000,
          method: "Scholarship Grant",
          status: "Paid",
          receiptNo: `REC-SCH-${Math.floor(1000 + Math.random() * 9000)}`,
          reference: data.tokenCode,
          paidBy: `${data.sponsorName} (Endowment)`,
        };

        const newFormsTxn: PaymentTransaction = {
          id: `TXN-SCH-F-${Date.now()}`,
          date: "Today, Just Now",
          description: `Payment to Access the Forms Page (Scholarship Grant - ${data.sponsorName})`,
          type: "Forms Access Fee (Scholarship)",
          amount: 100,
          method: "Scholarship Grant",
          status: "Paid",
          receiptNo: `REC-SCH-F-${Math.floor(1000 + Math.random() * 9000)}`,
          reference: data.tokenCode,
          paidBy: `${data.sponsorName} (Endowment)`,
        };

        setTransactions((prev) => [newTuitionTxn, newFormsTxn, ...prev]);
        setTokenInput("");
        loadPortalData();
      } else {
        if (data.alreadyRedeemed) {
          setRedeemSuccess({
            tokenCode: data.tokenCode || tokenInput.trim(),
            message: data.error,
          });
          loadPortalData();
        }
        setRedeemError(data.error || "Failed to redeem token. Please check the code.");
      }
    } catch (_e) {
      setIsRedeemingToken(false);
      setRedeemError("Network connection error. Please try again.");
    }
  };

  const handleSubmitAidApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (hasAppliedForScholarship) {
      triggerToast("You have already submitted an aid request to the Secretary Desk.");
      return;
    }
    if (!aidReason.trim()) {
      triggerToast("Please provide a reason for your scholarship aid request.");
      return;
    }
    setIsSubmittingAid(true);

    try {
      const res = await fetch("/api/scholarships/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricNo: userData.matricNo,
          fullName: userData.name,
          email: userData.email,
          phone: userData.phone,
          stateOfOrigin: aidState,
          lga: aidLga,
          reason: aidReason,
          commitment: "Full 6-Month Vocational Training Commitment",
          guarantorContact: aidGuarantor,
        }),
      });
      const data = await res.json();
      setIsSubmittingAid(false);

      if (res.ok && data.success) {
        setAidSubmitted(true);
        if (data.application) {
          setScholarshipApp(data.application);
        }
        triggerToast("Aid request submitted to Secretary Desk waitlist!");
        loadPortalData();
      } else {
        if (data.alreadyApplied) {
          setAidSubmitted(true);
          if (data.application) {
            setScholarshipApp(data.application);
          }
        }
        triggerToast(data.error || "Failed to submit request.");
      }
    } catch (_e) {
      setIsSubmittingAid(false);
      triggerToast("Network error submitting request.");
    }
  };

  // Profile Photo Upload & Synchronization Handler (with client-side compression to prevent DB egress bloat)
  const handleProfilePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      triggerToast("Please select a valid image file (JPG, PNG, WebP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      triggerToast("Image file size must be under 10MB.");
      return;
    }

    setUploadingPhoto(true);
    try {
      // Compress image client-side to ~25-40KB before storing, avoiding multi-megabyte DB egress
      const dataUrl = await compressImageFile(file, 360, 360, 0.82);

      // 1. Immediately update local state
      setUserData((prev) => ({ ...prev, profilePhoto: dataUrl }));

      // 2. Persist locally to localStorage
      try {
        if (userData.matricNo) {
          localStorage.setItem(`wmes_profile_photo_${userData.matricNo}`, dataUrl);
        }
        if (userData.email) {
          localStorage.setItem(`wmes_profile_photo_${userData.email}`, dataUrl);
        }
        const sessionStr = localStorage.getItem("wmes_session");
        if (sessionStr) {
          const parsed = JSON.parse(sessionStr);
          parsed.avatarUrl = dataUrl;
          localStorage.setItem("wmes_session", JSON.stringify(parsed));
        }
      } catch (_e) {}

      // 3. Persist to DB and sync to applications table
      try {
        await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            matricNo: userData.matricNo,
            email: userData.email,
            avatarUrl: dataUrl,
          }),
        });
        triggerToast("Profile picture uploaded & synced to your official form!");
      } catch (_e) {
        triggerToast("Photo saved locally. Network sync will resume automatically.");
      }
    } catch (_err) {
      triggerToast("Failed to process image. Please try another file.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const totalPaid = transactions
    .filter((t) => t.status === "Paid")
    .reduce((sum, t) => sum + t.amount, 0);

  // Calculate total recorded hours dynamically from recordings duration in database
  const totalRecordedHours = recordings.reduce((acc, r) => {
    const durStr = (r.duration || "").toLowerCase();
    let mins = 0;
    const hourMatch = durStr.match(/(\d+)\s*(?:hr|hour)/);
    const minMatch = durStr.match(/(\d+)\s*(?:min|m)/);
    if (hourMatch) mins += parseInt(hourMatch[1], 10) * 60;
    if (minMatch) mins += parseInt(minMatch[1], 10);
    if (!hourMatch && !minMatch) mins += 45;
    return acc + mins / 60;
  }, 0);

  // Programme Modules — populated from Supabase programme_modules table
  const [modules, setModules] = useState<any[]>([]);

  // Resolve Student Fashion Focus (Male / Female / Both)
  const rawFashionChoice =
    (Array.isArray(application?.raw_data?.fashionTrack)
      ? application.raw_data.fashionTrack.join(", ")
      : application?.raw_data?.fashionTrack) ||
    application?.fashion_track ||
    (studentSelectedTrack &&
    studentSelectedTrack !== "Professional Fashion Design & Garment Technology" &&
    studentSelectedTrack !== "Tailoring" &&
    studentSelectedTrack !== "Not Selected Yet"
      ? studentSelectedTrack
      : "") ||
    "";

  const fashionChoiceLower = String(rawFashionChoice || "").toLowerCase().trim();
  const fashionFocus = (() => {
    if (
      !fashionChoiceLower ||
      fashionChoiceLower === "not selected yet" ||
      fashionChoiceLower === "pending"
    ) {
      return null;
    }
    if (
      fashionChoiceLower.includes("both") ||
      (fashionChoiceLower.includes("male") && fashionChoiceLower.includes("female"))
    ) {
      return {
        key: "both",
        label: "Both (Male & Female Fashion Making)",
        badge: "👔👗 Both (Male & Female)",
        short: "Male & Female (Both)",
      };
    }
    if (fashionChoiceLower.includes("female")) {
      return {
        key: "female",
        label: "Female Fashion Making",
        badge: "👗 Female Fashion Making",
        short: "Female Fashion Making",
      };
    }
    if (fashionChoiceLower.includes("male")) {
      return {
        key: "male",
        label: "Male Fashion Making",
        badge: "👔 Male Fashion Making",
        short: "Male Fashion Making",
      };
    }
    return {
      key: "custom",
      label: rawFashionChoice,
      badge: rawFashionChoice,
      short: rawFashionChoice,
    };
  })();

  // Derived Access & Source-of-Truth States from DB
  const courseTitle = programme?.title || "Tailoring";
  const isEnrolled = hasPaidProgramme;
  const enrolledTrack = isEnrolled
    ? fashionFocus
      ? `${courseTitle} — ${fashionFocus.short}`
      : courseTitle
    : "Pending";
  const isProfileVerified = userData.verificationStatus === "Verified";

  // Resolve KYC Identity Document from Form Section C
  const resolveKycDoc = () => {
    const rawType = application?.raw_data?.ninType;
    let selectedType = "";
    if (Array.isArray(rawType) && rawType.length > 0) {
      selectedType = rawType.filter(Boolean).join(", ");
    } else if (typeof rawType === "string" && rawType.trim()) {
      selectedType = rawType.trim();
    }

    const idNumber =
      application?.nin_number ||
      application?.raw_data?.ninNumber ||
      application?.raw_data?.nin_number ||
      "";

    let label = "National Identity (NIN)";
    const lower = selectedType.toLowerCase();
    if (lower.includes("voter")) {
      label = "Voter's Card (VIN)";
    } else if (lower.includes("driver")) {
      label = "Driver's Licence";
    } else if (lower.includes("passport")) {
      label = "International Passport";
    } else if (lower.includes("nin")) {
      label = "National Identity Number (NIN)";
    } else if (selectedType) {
      label = selectedType;
    }

    return {
      selectedType,
      typeLabel: label,
      idNumber,
      hasSubmitted: Boolean(idNumber || selectedType),
    };
  };

  const kycDoc = resolveKycDoc();

  // Institutional Forms — populated from Supabase institutional_forms table
  const [institutionalForms, setInstitutionalForms] = useState<InstitutionalForm[]>([]);

  // Form Submissions — populated from Supabase form_submissions table
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);

  // Hydrate all portal entities from Supabase database
  const loadPortalData = useCallback(() => {
    let sessionMatric = "";
    let sessionEmail = "";
    try {
      const sessionStr = localStorage.getItem("wmes_session");
      if (sessionStr) {
        const parsed = JSON.parse(sessionStr);
        if (parsed.matricNo) sessionMatric = parsed.matricNo;
        if (parsed.email) sessionEmail = parsed.email;
      }
    } catch (_e) {}

    const params = new URLSearchParams();
    if (sessionEmail) params.set("email", sessionEmail);
    if (sessionMatric) params.set("matricNo", sessionMatric);
    const query = params.toString() ? `?${params.toString()}` : "";

    fetch(`/api/portal${query}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          if (data.profile) {
            setUserData((prev) => ({
              ...prev,
              name: data.profile.name || prev.name,
              matricNo: data.profile.matric_no || prev.matricNo,
              email: data.profile.email || prev.email,
              phone: data.profile.phone || prev.phone,
              role: data.profile.role || prev.role,
              track: data.profile.track || prev.track,
              registryHub: data.profile.registry_hub || prev.registryHub,
              verificationStatus:
                data.profile.verification_status || prev.verificationStatus || "Pending",
              accreditationStatus:
                data.profile.accreditation_status || prev.accreditationStatus,
              profilePhoto:
                data.profile.avatar_url ||
                data.application?.passport_photo_url ||
                prev.profilePhoto,
            }));

            try {
              const sessionStr = localStorage.getItem("wmes_session");
              if (sessionStr) {
                const parsed = JSON.parse(sessionStr);
                parsed.matricNo = data.profile.matric_no;
                parsed.name = data.profile.name || parsed.name;
                parsed.email = data.profile.email || parsed.email;
                localStorage.setItem("wmes_session", JSON.stringify(parsed));
              } else if (data.profile.matric_no) {
                localStorage.setItem(
                  "wmes_session",
                  JSON.stringify({
                    matricNo: data.profile.matric_no,
                    name: data.profile.name,
                    email: data.profile.email,
                    tier: data.profile.role,
                  })
                );
              }
            } catch (_e) {}
          }

          if (data.programme) {
            setProgramme(data.programme);
          }

          if (data.selectedTrack) {
            setStudentSelectedTrack(data.selectedTrack);
          }

          if (data.application) {
            setApplication(data.application);
          }

          if (data.scholarshipApp) {
            setScholarshipApp(data.scholarshipApp);
            setAidSubmitted(true);
          }

          if (data.scholarshipToken) {
            setScholarshipToken(data.scholarshipToken);
          }

          if (Array.isArray(data.modules)) {
            setModules(data.modules);
          }

          // Always set transactions from DB (source of truth)
          if (Array.isArray(data.transactions)) {
            const formatted = data.transactions.map((t: any) => ({
              id: t.id,
              date: t.created_at
                ? new Date(t.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "Recent",
              description: t.description,
              type: t.type,
              amount: Number(t.amount),
              method: t.method || "ALATPay Checkout",
              status: t.status || "Paid",
              receiptNo: t.receipt_no,
            }));
            setTransactions(formatted);
          }

          if (Array.isArray(data.institutionalForms) && data.institutionalForms.length > 0) {
            const mappedForms: InstitutionalForm[] = data.institutionalForms.map((f: any) => ({
              id: f.id,
              title: f.title,
              category: (f.category || "Administrative") as InstitutionalForm["category"],
              eta: f.processing_time || f.eta || "5–7 working days",
              desc: f.description || f.desc || "",
              requirements: Array.isArray(f.requirements)
                ? f.requirements
                : [
                    "Valid WMES Student ID",
                    "Completed request form",
                    "Administrative clearance",
                  ],
              pdfTemplateUrl: f.pdf_url || f.pdf_template_url || "",
            }));
            setInstitutionalForms(mappedForms);
          }

          if (Array.isArray(data.submissions)) {
            const formattedSubs = data.submissions.map((s: any) => ({
              ticketId: s.ticket_id,
              formTitle: s.form_title,
              date: s.created_at
                ? new Date(s.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : "Today",
              status: (s.status === "Approved"
                ? "Approved"
                : s.status === "Dean Review"
                ? "Dean Review"
                : "Submitted") as "Submitted" | "Dean Review" | "Approved",
              notes: s.notes || "",
            }));
            setSubmissions(formattedSubs);
          }

          if (Array.isArray(data.recordings)) {
            setRecordings(data.recordings);
          }

          if (Array.isArray(data.notifications)) {
            setNotifications(data.notifications);
          }
        }
      })
      .catch((err) => {
        console.error("Portal Supabase hydration error:", err);
      });
  }, []);

  // Hydrate all portal entities from Supabase database on mount & on searchParams change
  useEffect(() => {
    loadPortalData();
  }, [loadPortalData, searchParams]);

  // Payment Form Input States (Exactly 2 items: Forms Page ₦10,000, Programme ₦100k)
  const [payFeeType, setPayFeeType] = useState("Payment to Access the Forms Page");
  const [payAmount, setPayAmount] = useState<number>(10000);
  const [payMethod, setPayMethod] = useState("Debit/Credit Card");
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Online Form Fill States
  const [formReason, setFormReason] = useState("");
  const [formNotes, setFormNotes] = useState("");
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  // Secure ALATPay Payment Trigger
  const handleLaunchAlatpay = (feeTypeInput?: string, amountInput?: number) => {
    const fee = (feeTypeInput || payFeeType) as
      | "Payment to Access the Forms Page"
      | "Payment for Tailoring Programme"
      | "Payment for Fashion Training Programme";
    const amt = amountInput || (fee.includes("Forms") ? 10000 : 100000);

    setIsProcessingPayment(true);
    initiateAlatpayPayment({
      feeType: fee,
      amount: amt,
      user: {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        matricNo: userData.matricNo,
      },
      onSuccess: (verifiedTxn) => {
        setIsProcessingPayment(false);
        setShowPaymentModal(false);

        // Update transactions list with the server-verified transaction
        setTransactions((prev) => {
          const updated = [
            verifiedTxn,
            ...prev.filter((t) => t.description !== verifiedTxn.description),
          ];
          try {
            localStorage.setItem(
              `wmes_transactions_${userData.matricNo}`,
              JSON.stringify(updated)
            );
          } catch (_e) {}
          return updated;
        });

        // Prepend immediate live payment & unlock notifications to state
        const isForms = amt === 10000 || amt === 100;
        const newTxNotif: DashboardNotification = {
          id: `tx-success-${verifiedTxn.id || Date.now()}`,
          title: isForms ? "Forms Fee Payment Confirmed" : "Tuition Payment Confirmed",
          message: `Payment of ₦${amt.toLocaleString()} verified via ALATPay. Receipt #${verifiedTxn.receiptNo || "CONFIRMED"}.`,
          type: "payment_success",
          category: "payment",
          linkTab: isForms ? "forms" : "payment",
          createdAt: new Date().toISOString(),
          timeAgo: "Just now",
          read: false,
          badgeColor: "bg-emerald-500",
        };
        const newUnlockNotif: DashboardNotification = {
          id: `unlock-${isForms ? "forms" : "prog"}-${Date.now()}`,
          title: isForms ? "Institutional Forms Unlocked" : "Tailoring Programme Unlocked",
          message: isForms
            ? "Official WMES academic request forms and transcript dockets are unlocked."
            : "Full access to your Vocational Tailoring curriculum and studio practicals is active.",
          type: isForms ? "form_unlocked" : "programme_unlocked",
          category: isForms ? "forms" : "programme",
          linkTab: isForms ? "forms" : "programme",
          createdAt: new Date().toISOString(),
          timeAgo: "Just now",
          read: false,
          badgeColor: isForms ? "bg-blue-500" : "bg-purple-500",
        };
        setNotifications((prev) => [newUnlockNotif, newTxNotif, ...prev]);

        triggerToast(
          `Payment of ₦${amt.toLocaleString()} verified via ALATPay! ${
            isForms ? "Forms access unlocked." : "Programme tuition settled."
          }`
        );

        if (isForms) {
          setActiveTab("forms");
        } else if (amt === 100000) {
          setActiveTab("programme");
        }
      },
      onClose: () => {
        setIsProcessingPayment(false);
      },
      onError: (errorMsg) => {
        setIsProcessingPayment(false);
        const newFailedNotif: DashboardNotification = {
          id: `tx-failed-${Date.now()}`,
          title: "Payment Not Successful",
          message: `Payment attempt of ₦${amt.toLocaleString()} was not completed (${errorMsg}).`,
          type: "payment_failed",
          category: "payment",
          linkTab: "payment",
          createdAt: new Date().toISOString(),
          timeAgo: "Just now",
          read: false,
          badgeColor: "bg-rose-500",
        };
        setNotifications((prev) => [newFailedNotif, ...prev]);
        triggerToast(`Payment Error: ${errorMsg}`);
      },
    });
  };

  // Submit payment handler from modal
  const handleProcessPayment = (e: React.FormEvent) => {
    e.preventDefault();
    handleLaunchAlatpay(payFeeType, payAmount);
  };

  // Submit online form handler persisting to Supabase
  const handleSubmitOnlineForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!showFormModal) return;
    setIsSubmittingForm(true);

    try {
      const res = await fetch("/api/forms/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          matricNo: userData.matricNo,
          formTitle: showFormModal.title,
          reason: formReason,
          notes: formNotes || "Under primary administrative review.",
        }),
      });

      const data = await res.json();
      setIsSubmittingForm(false);

      if (res.ok && data.success) {
        const newSub: FormSubmission = {
          ticketId: data.ticketId,
          formTitle: showFormModal.title,
          date: "Today",
          status: "Submitted",
          notes: formNotes || "Under primary administrative review.",
        };
        setSubmissions([newSub, ...submissions]);
        setShowFormModal(null);
        setFormReason("");
        setFormNotes("");
        const newFormNotif: DashboardNotification = {
          id: `sub-${newSub.ticketId || Date.now()}`,
          title: `Form Request Submitted: ${showFormModal.title}`,
          message: `Ticket #${newSub.ticketId} has been lodged with the Academic Dean Review docket.`,
          type: "form_update",
          category: "forms",
          linkTab: "forms",
          createdAt: new Date().toISOString(),
          timeAgo: "Just now",
          read: false,
          badgeColor: "bg-amber-500",
        };
        setNotifications((prev) => [newFormNotif, ...prev]);
        triggerToast(`Form submitted! Ticket ID: ${newSub.ticketId}. Saved to Supabase.`);
      } else {
        triggerToast(data.error || "Failed to submit request.");
      }
    } catch (_e) {
      setIsSubmittingForm(false);
      triggerToast("Network error submitting request.");
    }
  };

  // ─────────────────────────────────────────────────────────────
  // NAVIGATION ITEMS (7 Standalone Items per User Direction)
  // ─────────────────────────────────────────────────────────────
  const navigationItems = [
    {
      id: "overview" as TabType,
      label: "Overview",
      icon: LayoutDashboard,
      badge: undefined,
    },
    {
      id: "programme" as TabType,
      label: "My Programme",
      icon: BookOpen,
      badge: hasPaidProgramme ? "Active" : undefined,
    },
    {
      id: "recorded" as TabType,
      label: "Recorded Session",
      icon: Video,
      badge: undefined,
    },
    {
      id: "payment" as TabType,
      label: "Payment",
      icon: CreditCard,
      badge: undefined,
    },
    {
      id: "profile" as TabType,
      label: "Profile",
      icon: User,
      badge: undefined,
    },
    {
      id: "forms" as TabType,
      label: "Forms",
      icon: FileText,
      badge: undefined,
    },
    {
      id: "scholarship" as TabType,
      label: "Scholarship",
      icon: GraduationCap,
      badge: isScholarshipRecipient ? "Active" : undefined,
    },
    {
      id: "certificate" as TabType,
      label: "Certificate",
      icon: Award,
      badge: isEnrolled && isProfileVerified ? "Active" : undefined,
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex font-body antialiased relative selection:bg-blue-600 selection:text-white">
      
      {/* ─────────────────────────────────────────────────────────
          TOAST NOTIFICATION FLOATER
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-5 right-5 z-50 bg-[#070D18] text-white border border-blue-500/30 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3"
          >
            <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
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
          LEFT SIDEBAR (DESKTOP & MOBILE DRAWER)
      ────────────────────────────────────────────────────────── */}
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 bg-[#070D18] text-white flex flex-col justify-between transition-all duration-300 border-r border-white/10 ${
          sidebarCollapsed ? "w-20" : "w-72"
        } ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="h-20 px-5 flex items-center justify-between border-b border-white/[0.08]">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 overflow-hidden focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-lg overflow-hidden bg-white/10 p-1 border border-white/20 shrink-0">
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
                  <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-blue-400 font-semibold mt-1">
                    Student Portal
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

          {/* Navigation Links (The 7 requested items) */}
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
                  className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer text-left group relative ${
                    isActive
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-semibold"
                      : "text-slate-400 hover:text-white hover:bg-white/[0.06]"
                  }`}
                  title={sidebarCollapsed ? item.label : undefined}
                >
                  <Icon
                    className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-slate-400 group-hover:text-blue-400 group-hover:scale-110"
                    }`}
                  />
                  {!sidebarCollapsed && (
                    <span className="truncate flex-1 tracking-tight">
                      {item.label}
                    </span>
                  )}
                  {!sidebarCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-semibold shrink-0 ${
                        isActive
                          ? "bg-white/20 text-white"
                          : "bg-white/10 text-slate-300"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full lg:hidden" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User Card & Portal Info */}
        <div className="p-3 border-t border-white/[0.08]">
          {!sidebarCollapsed ? (
            <div className="p-3 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-blue-400/30 flex items-center justify-center">
                  {userData.profilePhoto ? (
                    <Image
                      src={userData.profilePhoto}
                      alt={userData.name || "Student"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs uppercase select-none">
                      {getUserInitials(userData.name)}
                    </div>
                  )}
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#070D18]" />
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-white truncate">
                    {userData.name || "Student"}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 truncate">
                    {userData.matricNo || "Candidate"}
                  </span>
                </div>
              </div>

              <Link
                href="/login"
                title="Sign out"
                onClick={() => {
                  try {
                    localStorage.removeItem("wmes_session");
                  } catch (_e) {}
                }}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-800 shrink-0 border border-blue-400/30 flex items-center justify-center">
                {userData.profilePhoto ? (
                  <Image
                    src={userData.profilePhoto}
                    alt={userData.name || "Student"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex items-center justify-center text-white font-bold text-xs uppercase select-none">
                    {getUserInitials(userData.name)}
                  </div>
                )}
              </div>
              <Link
                href="/login"
                title="Sign out"
                onClick={() => {
                  try {
                    localStorage.removeItem("wmes_session");
                  } catch (_e) {}
                }}
                className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-white/10 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ─────────────────────────────────────────────────────────
          MAIN PORTAL VIEWPORT AREA
      ────────────────────────────────────────────────────────── */}
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ${
          sidebarCollapsed ? "lg:pl-20" : "lg:pl-72"
        }`}
      >
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 flex items-center justify-between">
          {/* Left: Mobile hamburger & Greeting */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 cursor-pointer"
              aria-label="Open mobile navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h1 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                {greeting}, {userData.name ? userData.name.trim().split(" ")[0] : "Student"}
              </h1>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Portal ID: <span className="font-semibold text-slate-700">{userData.matricNo || "WMES Institutional Member"}</span>
              </p>
            </div>
          </div>

          {/* Right: Quick Search, Notifications & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Search */}
            <div className="relative hidden md:block w-56 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search sessions, forms, payments..."
                className="w-full pl-9 pr-3.5 py-2 bg-slate-100 hover:bg-slate-200/60 focus:bg-white rounded-xl border border-transparent focus:border-blue-500 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none transition-all"
              />
              {globalSearch && (
                <button
                  onClick={() => setGlobalSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Notifications Dropdown */}
            <div className="relative" ref={notificationsRef}>
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {notificationsOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-4 z-50"
                  >
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs sm:text-sm text-slate-900">
                          System Notifications
                        </span>
                        {unreadCount > 0 ? (
                          <span className="text-[10px] font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full font-bold">
                            {unreadCount} New
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full font-medium">
                            All read
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAllNotificationsRead();
                          }}
                          className="text-[10px] font-mono text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-medium"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center px-4">
                          <Bell className="w-7 h-7 text-slate-300 mx-auto mb-2" />
                          <p className="text-xs font-semibold text-slate-700">No Notifications Yet</p>
                          <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto leading-relaxed">
                            Updates on payments, unlocked forms, programme access, and newly uploaded lecture videos will appear here.
                          </p>
                        </div>
                      ) : (
                        notifications.map((n) => {
                          const isRead = n.read || readNotifIds.includes(n.id);
                          return (
                            <div
                              key={n.id}
                              onClick={() => handleNotificationClick(n)}
                              className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                                isRead
                                  ? "bg-white border-slate-100 hover:bg-slate-50/80 opacity-75"
                                  : "bg-slate-50 border-slate-200/60 hover:bg-blue-50/40 shadow-xs"
                              }`}
                            >
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={`w-2 h-2 rounded-full shrink-0 ${
                                    n.badgeColor ||
                                    (n.type === "payment_success"
                                      ? "bg-emerald-500"
                                      : n.type === "payment_failed"
                                      ? "bg-rose-500"
                                      : n.type === "video_uploaded"
                                      ? "bg-indigo-500"
                                      : n.type === "programme_unlocked"
                                      ? "bg-purple-500"
                                      : n.type === "form_unlocked"
                                      ? "bg-blue-500"
                                      : "bg-amber-500")
                                  }`}
                                />
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {n.title}
                                </span>
                                <span className="text-[9px] font-mono text-slate-400 ml-auto shrink-0">
                                  {n.timeAgo}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-600 leading-relaxed">
                                {n.message}
                              </p>
                              {n.linkTab && (
                                <div className="mt-1.5 flex items-center gap-1 text-[9px] font-mono font-semibold text-blue-600 hover:underline">
                                  <span className="capitalize">Go to {n.linkTab}</span>
                                  <span>→</span>
                                </div>
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Quick Action: Make Payment Button */}
            <button
              onClick={() => {
                if (hasPaidBoth) return;
                if (hasPaidForms && !hasPaidProgramme) {
                  setPayFeeType("Payment for Tailoring Programme");
                  setPayAmount(100000);
                } else {
                  setPayFeeType("Payment to Access the Forms Page");
                  setPayAmount(10000);
                }
                setShowPaymentModal(true);
              }}
              disabled={hasPaidBoth}
              title={
                hasPaidBoth
                  ? "All required payments (Forms & Tuition) have been completed"
                  : "Make Payment"
              }
              className={`px-3 sm:px-4 py-2 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-all ${
                hasPaidBoth
                  ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none"
                  : "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 cursor-pointer active:scale-[0.98]"
              }`}
            >
              {hasPaidBoth ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : (
                <Plus className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">
                {hasPaidBoth ? "Payments Completed" : "Make Payment"}
              </span>
              <span className="sm:hidden">
                {hasPaidBoth ? "Paid" : "Pay"}
              </span>
            </button>
          </div>
        </header>

        {/* ─────────────────────────────────────────────────────────
            MAIN VIEWPORT CONTENT BY ACTIVE TAB
        ────────────────────────────────────────────────────────── */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* ═══════════════════════════════════════════════════════
              TAB 1: OVERVIEW
          ════════════════════════════════════════════════════════ */}
          {activeTab === "overview" && (
            <div className="space-y-6">
              
              {/* Onboarding Banner for New Signups */}
              {showOnboarding && (
                <div className="relative rounded-2xl bg-gradient-to-r from-[#070D18] via-[#0D1F3D] to-[#070D18] text-white p-6 sm:p-8 border border-white/10 overflow-hidden shadow-xl">
                  <div className="relative z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2 text-xs font-mono text-blue-300 font-bold uppercase tracking-widest mb-2">
                        <GraduationCap className="w-4 h-4 text-blue-400" />
                        <span>Welcome to WMES Academic Portal</span>
                      </div>
                      <button
                        onClick={() => setShowOnboarding(false)}
                        className="text-slate-400 hover:text-white p-1"
                        title="Dismiss onboarding banner"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <h2 className="text-xl sm:text-2xl font-bold tracking-tight mb-2">
                      Get Started with Your Training Curriculum
                    </h2>
                    <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed mb-6">
                      Welcome to your institutional registry dashboard. Complete the setup milestones below to unlock your full training schedule and track your academic progress.
                    </p>

                    {/* 4-Step Checklist */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      <div
                        onClick={() => setActiveTab("profile")}
                        className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-white/20 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isProfileVerified
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {isProfileVerified ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">1. Verify Profile</p>
                          <p
                            className={`text-[10px] font-mono ${
                              isProfileVerified ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {isProfileVerified ? "Completed" : "Pending"}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab("programme")}
                        className={`p-3.5 rounded-xl bg-white/[0.06] border flex items-center gap-3 cursor-pointer transition-colors ${
                          isEnrolled
                            ? "border-emerald-500/30 hover:border-emerald-500/50"
                            : "border-amber-500/30 hover:border-amber-500/50"
                        }`}
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isEnrolled
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {isEnrolled ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">2. Enrolled Track</p>
                          <p
                            className={`text-[10px] font-mono ${
                              isEnrolled ? "text-emerald-400" : "text-amber-400"
                            }`}
                          >
                            {enrolledTrack}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab("recorded")}
                        className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-amber-400/40 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            recordings.length > 0
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-500/20 text-slate-400"
                          }`}
                        >
                          {recordings.length > 0 ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <Video className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">3. Recorded Sessions</p>
                          <p
                            className={`text-[10px] font-mono ${
                              recordings.length > 0 ? "text-emerald-400" : "text-slate-400"
                            }`}
                          >
                            {recordings.length > 0
                              ? `${recordings.length} Available`
                              : "0 Uploaded"}
                          </p>
                        </div>
                      </div>

                      <div
                        onClick={() => setActiveTab("certificate")}
                        className="p-3.5 rounded-xl bg-white/[0.06] border border-white/10 hover:border-blue-400/40 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                            isEnrolled && isProfileVerified
                              ? "bg-purple-500/20 text-purple-400"
                              : "bg-amber-500/20 text-amber-400"
                          }`}
                        >
                          {isEnrolled && isProfileVerified ? (
                            <Award className="w-4 h-4" />
                          ) : (
                            <Clock className="w-4 h-4" />
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">4. Certificate Status</p>
                          <p
                            className={`text-[10px] font-mono ${
                              isEnrolled && isProfileVerified
                                ? "text-purple-300"
                                : "text-amber-400"
                            }`}
                          >
                            {isEnrolled
                              ? (isProfileVerified ? "In Progress" : "Pending KYC")
                              : "Pending Enrollment"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 4 Metric KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Current Programme
                    </span>
                    <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                      <BookOpen className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight leading-snug">
                      {isEnrolled ? courseTitle : "Pending"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {isEnrolled ? "Enrolled & Active" : "No active enrollment"}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("programme")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-4 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>{isEnrolled ? "View course details" : "Enroll in a course"}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Recorded Hours
                    </span>
                    <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                      <Video className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      {recordings.length > 0 ? `${totalRecordedHours.toFixed(1)} hrs` : "0.0 hrs"}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" /> {recordings.length} session{recordings.length !== 1 ? "s" : ""} available
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("recorded")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-4 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>Browse session hub</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Tuition & Fees
                    </span>
                    <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                      <CreditCard className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                      ₦{totalPaid.toLocaleString()}
                    </h3>
                    <p className="text-xs text-emerald-600 font-medium mt-0.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />{" "}
                      {hasPaidProgramme && hasPaidForms
                        ? "Tuition (100k) + Forms (₦10,000) Paid"
                        : hasPaidProgramme
                        ? "Tuition (100k) Paid"
                        : hasPaidForms
                        ? "Forms Access (₦10,000) Paid"
                        : "No payments recorded"}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("payment")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-4 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>View payment portal</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Certificate Status
                    </span>
                    <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">
                      {isEnrolled ? (isProfileVerified ? "In Progress" : "Pending KYC") : "Pending"}
                    </h3>
                    <p className={`text-xs font-medium mt-0.5 flex items-center gap-1 ${isEnrolled ? "text-purple-600" : "text-amber-600"}`}>
                      <Clock className="w-3.5 h-3.5" />{" "}
                      {isEnrolled
                        ? (isProfileVerified ? "Curriculum active · US CEU" : "Profile verification required")
                        : "Enrollment pending"}
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveTab("certificate")}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 mt-4 text-left flex items-center gap-1 cursor-pointer"
                  >
                    <span>View certificate status</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Enrolled Programme Summary Card */}
              <div className="rounded-2xl bg-white border border-slate-200/80 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div
                    className={`inline-flex items-center gap-2 px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase ${
                      isEnrolled
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-amber-50 text-amber-700"
                    }`}
                  >
                    <span
                      className={`w-2 h-2 rounded-full ${
                        isEnrolled ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                      }`}
                    />
                    <span>
                      {isEnrolled ? "Enrolled Specialization" : "Available Course · Enrollment Pending"}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                      {courseTitle}
                    </h3>
                    {fashionFocus && (
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border shadow-xs ${
                          fashionFocus.key === "female"
                            ? "bg-rose-50 text-rose-700 border-rose-200"
                            : fashionFocus.key === "male"
                            ? "bg-sky-50 text-sky-700 border-sky-200"
                            : "bg-purple-50 text-purple-700 border-purple-200"
                        }`}
                      >
                        <span className="text-xs">
                          {fashionFocus.key === "female"
                            ? "👗"
                            : fashionFocus.key === "male"
                            ? "👔"
                            : "👔👗"}
                        </span>
                        <span>{fashionFocus.label}</span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    onClick={() => setActiveTab("recorded")}
                    className="px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <Video className="w-4 h-4" />
                    <span>Watch Recorded Sessions →</span>
                  </button>
                </div>
              </div>

              {/* Quick Links Section */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div
                  onClick={() => setActiveTab("recorded")}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Video className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {recordings.length > 0 ? `${recordings.length} Uploaded` : "0 Uploads"}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    Recorded Sessions Library
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Watch replays of masterclass sewing sessions, pattern drafting demonstrations, and African textile fusion techniques.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("forms")}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${hasPaidForms ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                      {hasPaidForms ? "Unlocked" : "₦10,000 Access"} · {institutionalForms.length} Forms
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    Official Forms & Requests
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Submit transcript requests, industrial placement, studio equipment allocation, or advisory sessions with instant ticket tracking.
                  </p>
                </div>

                <div
                  onClick={() => setActiveTab("certificate")}
                  className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-blue-500/50 hover:shadow-md transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                      <Award className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                      {isEnrolled ? "In Progress" : "Pending"}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1 group-hover:text-blue-600 transition-colors">
                    Certificate Status
                  </h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Track your graduation credential issuance, view curriculum completion requirements, and monitor academic clearance.
                  </p>
                </div>
              </div>

              {/* Recent Database Ledger & Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Transactions from DB */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Payment Transactions</h4>
                          <p className="text-[11px] text-slate-500">Live ledger from transactions table</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("payment")}
                        className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View all ({transactions.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {transactions.length === 0 ? (
                      <div className="py-8 text-center px-4">
                        <CreditCard className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No Transactions Found</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-[240px] mx-auto">
                          Official fee payments processed via ALATPay will appear in this ledger.
                        </p>
                        <button
                          onClick={() => {
                            setPayFeeType("Payment to Access the Forms Page");
                            setPayAmount(10000);
                            setShowPaymentModal(true);
                          }}
                          className="mt-3.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Pay ₦10,000 Form Fee</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {transactions.slice(0, 3).map((t) => (
                          <div
                            key={t.id}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {t.description}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                    t.status === "Paid"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : "bg-amber-100 text-amber-800"
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-slate-400">
                                {t.receiptNo} · {t.date} · {t.method}
                              </p>
                            </div>
                            <span className="font-mono font-bold text-xs text-slate-900 shrink-0">
                              ₦{t.amount.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Recent Form Submissions from DB */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm">Official Form Requests</h4>
                          <p className="text-[11px] text-slate-500">Live docket tickets from form_submissions</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveTab("forms")}
                        className="text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-0.5 cursor-pointer"
                      >
                        <span>View all ({submissions.length})</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {submissions.length === 0 ? (
                      <div className="py-8 text-center px-4">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        <p className="text-xs font-semibold text-slate-700">No Submitted Forms Yet</p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-[260px] mx-auto">
                          You can submit transcript requests, apprenticeship machine allocation, and advisory dockets.
                        </p>
                        <button
                          onClick={() => setActiveTab("forms")}
                          className="mt-3.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <span>Browse Forms Catalog →</span>
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {submissions.slice(0, 3).map((s) => (
                          <div
                            key={s.ticketId}
                            className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-3"
                          >
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className="font-bold text-xs text-slate-900 truncate">
                                  {s.formTitle}
                                </span>
                                <span
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                    s.status === "Approved"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : s.status === "Dean Review"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {s.status}
                                </span>
                              </div>
                              <p className="text-[10px] font-mono text-slate-400">
                                Ticket #{s.ticketId} · Submitted {s.date}
                              </p>
                            </div>
                            <button
                              onClick={() => setActiveTab("forms")}
                              className="text-[10px] font-mono font-bold text-blue-600 hover:underline shrink-0 cursor-pointer"
                            >
                              Track →
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 2: MY PROGRAMME (Courses Catalog - Tailoring Only)
          ════════════════════════════════════════════════════════ */}
          {activeTab === "programme" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    My Programme
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1">
                    Enrolled vocational training courses and studio tracks.
                  </p>
                </div>
              </div>

              {/* Single Course Card: Tailoring */}
              <div className="max-w-2xl">
                <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden flex flex-col">
                  {/* Card Cover Image & Badge */}
                  <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src="/images/service_training_capacity.jpg"
                      alt="Tailoring Course"
                      fill
                      className={`object-cover transition-all duration-300 ${
                        !hasPaidProgramme ? "filter grayscale contrast-125 opacity-40" : "opacity-90"
                      }`}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

                    {/* Top Status Badge */}
                    <div className="absolute top-4 left-4 z-10">
                      {hasPaidProgramme ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/95 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-md">
                          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span>Enrolled & Active</span>
                        </div>
                      ) : !hasPaidForms ? (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/95 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-md">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked · Form Payment Required First</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-600/95 backdrop-blur-md text-white font-mono text-[11px] font-bold shadow-md">
                          <Lock className="w-3.5 h-3.5" />
                          <span>Locked · Tuition Payment Required</span>
                        </div>
                      )}
                    </div>

                    <div className="absolute top-4 right-4 z-10">
                      <span className="px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white/90 font-mono text-[10px] font-bold uppercase tracking-wider">
                        Vocational Track
                      </span>
                    </div>

                    {/* Overlay Icon if Locked */}
                    {!hasPaidProgramme && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-16 h-16 rounded-full bg-black/70 backdrop-blur-md border border-white/20 flex items-center justify-center text-white/90 shadow-2xl">
                          <Lock className="w-8 h-8" />
                        </div>
                      </div>
                    )}

                    {/* Image Title Overlay */}
                    <div className="absolute bottom-4 left-4 right-4 text-white z-10">
                      <span className="font-mono text-[11px] text-blue-300 font-bold uppercase tracking-wider block mb-0.5">
                        Course
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                        Tailoring
                      </h3>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 sm:p-7 space-y-5">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-900 text-base">
                          {courseTitle}
                        </h4>
                        <span className="font-mono text-sm font-black text-slate-900">
                          ₦100,000
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {programme?.description || "Comprehensive vocational course covering pattern drafting, basic sloper blocks, high-speed industrial sewing machines, French seams, bespoke tailored suits, and contemporary African couture."}
                      </p>
                    </div>

                    {/* Course Specs Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Timetable
                        </span>
                        <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                          Mon – Thu (9 AM – 3 PM)
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Creative Ateliers
                        </span>
                        <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                          Abuja & Enugu Centers
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 col-span-2 sm:col-span-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                          Credential
                        </span>
                        <span className="font-semibold text-slate-800 text-xs mt-0.5 block">
                          Professional Diploma
                        </span>
                      </div>
                    </div>

                    {/* Dynamic Lock/Unlock Action Section */}
                    <div className="pt-4 border-t border-slate-100">
                      {hasPaidProgramme ? (
                        /* Unlocked State */
                        <div className="space-y-4">
                          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs">
                            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                            <div>
                              <p className="font-bold">Full Course Access Active</p>
                              <p className="text-[11px] text-emerald-700 mt-0.5">
                                Your enrollment is verified. You have full clearance for all studio practicals, industrial machines, and atelier equipment.
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => triggerToast("Downloading Tailoring Studio Guide & Handbook...")}
                              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-2 cursor-pointer transition-all shadow-md shadow-blue-600/20"
                            >
                              <Download className="w-4 h-4" />
                              <span>Download Studio Guide</span>
                            </button>
                            <button
                              onClick={() => setActiveTab("recorded")}
                              className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                            >
                              <Video className="w-4 h-4" />
                              <span>Watch Recorded Sessions →</span>
                            </button>
                          </div>
                        </div>
                      ) : !hasPaidForms ? (
                        /* Locked State 1: Form Fee Required First */
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-bold text-amber-900">Step 1: Form Access Fee Required (₦10,000)</p>
                              <p className="text-amber-800 mt-1 leading-relaxed">
                                To unlock this Tailoring course, new students must first pay the official ₦10,000 application form fee before paying the ₦100,000 tuition fee.
                              </p>
                            </div>
                          </div>
                          <div className="flex flex-wrap items-center gap-3">
                            <button
                              onClick={() => handleLaunchAlatpay("Payment to Access the Forms Page", 10000)}
                              disabled={isProcessingPayment}
                              className="px-5 py-3 rounded-xl bg-[#961526] hover:bg-[#80101f] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-red-900/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75"
                            >
                              <CreditCard className="w-4 h-4" />
                              <span>Pay ₦10,000 Form Fee via ALATPay</span>
                            </button>
                            <button
                              onClick={() => setActiveTab("forms")}
                              className="px-4 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs cursor-pointer transition-colors"
                            >
                              <span>Go to Forms Page →</span>
                            </button>
                          </div>
                        </div>
                      ) : (
                        /* Locked State 2: Form Paid, Tuition Fee Required */
                        <div className="space-y-3">
                          <div className="p-4 rounded-xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
                            <CreditCard className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                            <div className="text-xs">
                              <p className="font-bold text-blue-950">Step 2: Programme Tuition Payment (₦100,000)</p>
                              <p className="text-blue-800 mt-1 leading-relaxed">
                                Form payment verified. Complete your ₦100,000 tuition payment to unlock your active enrollment in Tailoring, studio attendance, and masterclasses.
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleLaunchAlatpay("Payment for Tailoring Programme", 100000)}
                            disabled={isProcessingPayment}
                            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#961526] hover:bg-[#80101f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-red-900/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75"
                          >
                            <CreditCard className="w-4 h-4" />
                            <span>Pay ₦100,000 via ALATPay to Unlock Tailoring</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 3: RECORDED SESSION
          ════════════════════════════════════════════════════════ */}
          {activeTab === "recorded" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Recorded Sessions & Masterclasses
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Review atelier sewing masterclasses, pattern drafting demonstrations, and runway collection replays.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400 font-medium">
                    {recordings.length} Recordings Available
                  </span>
                </div>
              </div>

              {/* Specialization Track Indicator & Filter */}
              {hasPaidProgramme && recordings.length > 0 && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                      <Video className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] uppercase font-bold text-blue-400 tracking-wider">
                          Curated Stream
                        </span>
                        <span className="text-slate-400 text-xs">•</span>
                        <span className="text-xs font-semibold text-slate-200">
                          {studentSelectedTrack.toLowerCase().includes("male") && !studentSelectedTrack.toLowerCase().includes("female") && !studentSelectedTrack.toLowerCase().includes("both")
                            ? "👔 Male Fashion Focus"
                            : studentSelectedTrack.toLowerCase().includes("female") && !studentSelectedTrack.toLowerCase().includes("male") && !studentSelectedTrack.toLowerCase().includes("both")
                            ? "👗 Female Fashion Focus"
                            : "👔👗 Dual-Track (Male & Female Specialization)"}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        Stream exclusive video replays tailored to your registered training track.
                      </p>
                    </div>
                  </div>

                  {/* Sub-filter if Dual Track */}
                  {studentSelectedTrack.toLowerCase().includes("both") && (
                    <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60 self-start sm:self-center">
                      {(["all", "male", "female"] as const).map((filterKey) => (
                        <button
                          key={filterKey}
                          onClick={() => setRecordingFilter(filterKey)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            recordingFilter === filterKey
                              ? "bg-blue-600 text-white shadow-sm"
                              : "text-slate-400 hover:text-white"
                          }`}
                        >
                          {filterKey === "all"
                            ? "All Replays"
                            : filterKey === "male"
                            ? "👔 Menswear"
                            : "👗 Womenswear"}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Gated Access for Unenrolled Students / Empty State / Video Grid */}
              {!hasPaidProgramme ? (
                <div className="p-10 sm:p-14 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center max-w-xl mx-auto my-8">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-center justify-center text-amber-600 mb-5 shadow-sm">
                    <Lock className="w-8 h-8 stroke-[1.8]" />
                  </div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-800 font-mono text-[11px] font-bold uppercase mb-3">
                    <Lock className="w-3 h-3 text-amber-700" />
                    <span>Enrollment Required</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mb-2">
                    Enroll for a course to access the course materials
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mb-6">
                    Recorded sewing masterclasses, pattern drafting demonstrations, and digital curriculum materials are reserved exclusively for enrolled students.
                  </p>
                  <button
                    onClick={() => setActiveTab("programme")}
                    className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-blue-600/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <BookOpen className="w-4 h-4" />
                    <span>View Courses & Enroll →</span>
                  </button>
                </div>
              ) : recordings.length === 0 ? (
                <div className="p-12 sm:p-16 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center flex flex-col items-center justify-center max-w-2xl mx-auto my-6">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-4 shadow-sm">
                    <Video className="w-8 h-8 stroke-[1.5]" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight mb-2">
                    No Recorded Sessions Yet
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 max-w-md leading-relaxed mb-6">
                    New uploads will appear here once atelier training demonstrations, masterclasses, and practical sessions are recorded and published for your track.
                  </p>
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-slate-600 text-xs font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                    <span>Awaiting new session uploads</span>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {recordings
                    .filter((rec) => {
                      if (recordingFilter === "all") return true;
                      if (recordingFilter === "male")
                        return rec.targetTrack === "male" || rec.targetTrack === "both";
                      if (recordingFilter === "female")
                        return rec.targetTrack === "female" || rec.targetTrack === "both";
                      return true;
                    })
                    .map((rec) => (
                    <div
                      key={rec.id}
                      onClick={() => setActiveRecording(rec)}
                      className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div>
                        {/* Video Thumbnail */}
                        <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                          <Image
                            src={rec.thumbnail}
                            alt={rec.title}
                            fill
                            unoptimized
                            className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                          
                          {/* Play overlay button */}
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                              <Play className="w-5 h-5 fill-current ml-0.5" />
                            </div>
                          </div>

                          {/* Duration Pill */}
                          <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                            {rec.duration}
                          </div>

                          {/* Category and Track badges */}
                          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
                            <div className="px-2.5 py-0.5 rounded-full bg-blue-600/90 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
                              {rec.category}
                            </div>
                            {rec.targetTrack === "male" && (
                              <div className="px-2 py-0.5 rounded-full bg-blue-500/95 text-white font-mono text-[9px] font-bold">
                                👔 Male
                              </div>
                            )}
                            {rec.targetTrack === "female" && (
                              <div className="px-2 py-0.5 rounded-full bg-purple-500/95 text-white font-mono text-[9px] font-bold">
                                👗 Female
                              </div>
                            )}
                            {(rec.targetTrack === "both" || !rec.targetTrack) && (
                              <div className="px-2 py-0.5 rounded-full bg-emerald-500/95 text-white font-mono text-[9px] font-bold">
                                👔👗 Both
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-5">
                          <span className="font-mono text-[10px] text-blue-600 font-bold uppercase tracking-wider block mb-1">
                            {rec.category || "Vocational Demonstration"}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                            {rec.title}
                          </h4>
                          <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                            {rec.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-5 pb-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                        <div className="flex flex-col">
                          <span className="font-semibold text-slate-800 text-[11px]">
                            {rec.instructor}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rec.instructorRole ? `${rec.instructorRole} • ` : ""}{rec.date}
                          </span>
                        </div>
                        <span className="font-mono text-[11px] text-blue-600 font-bold group-hover:underline flex items-center gap-1">
                          <span>Play Video</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 4: PAYMENT
          ════════════════════════════════════════════════════════ */}
          {activeTab === "payment" && (
            <div className="space-y-6">
              {/* Tuition Overview Header */}
              <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-[#070D18] via-[#0A1A33] to-[#070D18] text-white border border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <span className="font-mono text-[10px] text-blue-400 font-bold uppercase tracking-widest block mb-1">
                    Student Financial Account
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    Tuition & Official Fees Ledger
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-lg leading-relaxed">
                    Official fees are restricted to two dockets: Access to the Forms Page (₦10,000) and Tailoring Programme Tuition (₦100,000).
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 text-right">
                    <span className="text-[10px] font-mono text-slate-300 uppercase block">
                      Total Paid to Date
                    </span>
                    <span className="text-xl font-bold text-emerald-400 font-mono">
                      ₦{totalPaid.toLocaleString()}.00
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      if (hasPaidBoth) return;
                      if (hasPaidForms && !hasPaidProgramme) {
                        setPayFeeType("Payment for Tailoring Programme");
                        setPayAmount(100000);
                      } else {
                        setPayFeeType("Payment to Access the Forms Page");
                        setPayAmount(10000);
                      }
                      setShowPaymentModal(true);
                    }}
                    disabled={hasPaidBoth}
                    title={
                      hasPaidBoth
                        ? "All official docket obligations are fully settled"
                        : "Make a Payment"
                    }
                    className={`px-5 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-2 transition-all ${
                      hasPaidBoth
                        ? "bg-white/10 text-slate-400 border border-white/10 cursor-not-allowed shadow-none"
                        : "bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 cursor-pointer active:scale-[0.98]"
                    }`}
                  >
                    {hasPaidBoth ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Plus className="w-4 h-4" />
                    )}
                    <span>{hasPaidBoth ? "All Payments Completed" : "Make a Payment"}</span>
                  </button>
                </div>
              </div>

              {/* 2 Official Payment Dockets */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Docket 1: Payment to access the forms page */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          hasPaidForms
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {hasPaidForms ? (
                          <>
                            <Check className="w-3 h-3" /> Access Unlocked
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" /> Payment Required
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Official Docket 1
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                        Payment to Access Forms Page
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Required fee to access, download printable PDF templates, and submit all official WMES institutional request forms.
                      </p>
                    </div>

                    <div className="py-3 border-y border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Fixed Access Fee</span>
                      <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                        ₦10,000
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Instant unlock of the standalone Forms catalog</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Apprenticeship placement & machine allocation forms</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Official ticket tracking with Dean & Registry review</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    {hasPaidForms ? (
                      <button
                        onClick={() => setActiveTab("forms")}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Access Active — Open Forms Page →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLaunchAlatpay("Payment to Access the Forms Page", 10000)}
                        disabled={isProcessingPayment}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#961526] hover:bg-[#80101f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-900/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₦10,000 via ALATPay to Access Forms</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Docket 2: Payment for the programme */}
                <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between relative overflow-hidden">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                        <BookOpen className="w-5 h-5" />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                          hasPaidProgramme
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}
                      >
                        {hasPaidProgramme ? (
                          <>
                            <Check className="w-3 h-3" /> Enrolled & Active
                          </>
                        ) : (
                          <>
                            <AlertCircle className="w-3 h-3" /> Tuition Pending
                          </>
                        )}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider block">
                        Official Docket 2
                      </span>
                      <h3 className="text-lg font-bold text-slate-900 tracking-tight mt-0.5">
                        Payment for Tailoring Programme
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Full programme tuition fee covering practical atelier sessions, industrial machine access, and graduation credentials.
                      </p>
                    </div>

                    <div className="py-3 border-y border-slate-100 flex items-baseline justify-between">
                      <span className="text-xs text-slate-500 font-medium">Programme Tuition Fee</span>
                      <span className="text-2xl font-black text-slate-900 font-mono tracking-tight">
                        ₦100,000
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-[11px] text-slate-600">
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Practical studio attendance (Mon – Thu, 9 AM – 3 PM WAT)</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Abuja & Enugu creative atelier equipment access</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>Institutional Diploma and final runway showcase</span>
                      </li>
                    </ul>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-100">
                    {hasPaidProgramme ? (
                      <button
                        onClick={() => setActiveTab("programme")}
                        className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 cursor-pointer transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Tuition Paid — View Studio Docket →</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleLaunchAlatpay("Payment for Tailoring Programme", 100000)}
                        disabled={isProcessingPayment}
                        className="w-full py-2.5 px-4 rounded-xl bg-[#961526] hover:bg-[#80101f] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-red-900/20 cursor-pointer transition-all active:scale-[0.98] disabled:opacity-75"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₦100,000 via ALATPay for Programme</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-base">
                    Transaction & Receipt History
                  </h3>
                  <span className="text-xs font-mono text-slate-400">
                    {transactions.length} Verified Entries
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="bg-slate-50 text-slate-500 font-mono text-[10px] uppercase border-b border-slate-100">
                      <tr>
                        <th className="px-5 py-3.5 font-bold">Date</th>
                        <th className="px-5 py-3.5 font-bold">Transaction ID</th>
                        <th className="px-5 py-3.5 font-bold">Description</th>
                        <th className="px-5 py-3.5 font-bold">Amount</th>
                        <th className="px-5 py-3.5 font-bold">Payment Method</th>
                        <th className="px-5 py-3.5 font-bold">Status</th>
                        <th className="px-5 py-3.5 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-5 py-12 text-center text-slate-400 font-mono text-xs">
                            No transactions recorded yet. Complete a payment docket above to generate your verified receipt.
                          </td>
                        </tr>
                      ) : (
                        transactions.map((t) => (
                          <tr key={t.id} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-5 py-4 font-mono text-slate-600 text-xs whitespace-nowrap">
                              {t.date}
                            </td>
                            <td className="px-5 py-4 font-mono font-bold text-slate-800 text-xs whitespace-nowrap">
                              {t.id}
                            </td>
                            <td className="px-5 py-4 text-slate-800 font-medium max-w-xs truncate">
                              {t.description}
                            </td>
                            <td className="px-5 py-4 font-bold text-slate-900 font-mono whitespace-nowrap">
                              ₦{t.amount.toLocaleString()}
                            </td>
                            <td className="px-5 py-4 text-slate-600 text-xs">
                              {t.method}
                            </td>
                            <td className="px-5 py-4 whitespace-nowrap">
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold">
                                <Check className="w-3 h-3" /> {t.status}
                              </span>
                            </td>
                            <td className="px-5 py-4 text-right whitespace-nowrap">
                              <button
                                onClick={() =>
                                  triggerToast(`Downloading PDF Receipt ${t.receiptNo}...`)
                                }
                                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>{t.receiptNo}</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 5: PROFILE
          ════════════════════════════════════════════════════════ */}
          {activeTab === "profile" && (
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                  Profile
                </h2>
                <p className="text-xs sm:text-sm text-slate-500">
                  Manage your personal credentials, contact info, and institutional details.
                </p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left Col: Identity Card */}
                <div className="lg:col-span-1 space-y-6">
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm text-center">
                    <div className="relative w-28 h-28 mx-auto mb-4 group">
                      <div className="w-full h-full rounded-full overflow-hidden bg-slate-100 border-4 border-blue-100 shadow-inner flex items-center justify-center relative">
                        {userData.profilePhoto ? (
                          <Image
                            src={userData.profilePhoto}
                            alt={userData.name || "Student"}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-600 via-indigo-600 to-amber-500 flex flex-col items-center justify-center text-white select-none">
                            <span className="font-extrabold text-2xl tracking-wider">
                              {getUserInitials(userData.name)}
                            </span>
                            <span className="text-[9px] uppercase font-mono tracking-widest opacity-80 mt-0.5">
                              No Photo
                            </span>
                          </div>
                        )}
                        {uploadingPhoto && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          </div>
                        )}
                      </div>

                      {/* Camera / Upload Overlay Trigger */}
                      <label
                        htmlFor="profile-avatar-upload"
                        className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white cursor-pointer transition-opacity backdrop-blur-[1px]"
                        title="Upload or change profile picture"
                      >
                        <Camera className="w-6 h-6 mb-1" />
                        <span className="text-[10px] font-bold">
                          {userData.profilePhoto ? "Change" : "Upload"}
                        </span>
                      </label>
                      <input
                        id="profile-avatar-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfilePhotoUpload}
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="profile-avatar-upload"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold cursor-pointer transition-colors border border-blue-200 shadow-xs"
                      >
                        <Camera className="w-3.5 h-3.5 text-blue-600" />
                        <span>{userData.profilePhoto ? "Change Photo" : "Upload Picture"}</span>
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1 font-mono">
                        Auto-synchronizes with your official application form
                      </p>
                    </div>

                    <h3 className="font-bold text-slate-900 text-lg">
                      {userData.name || "Student"}
                    </h3>
                    <p className="text-xs font-mono text-blue-600 font-semibold mt-0.5">
                      {userData.matricNo || "Pending Portal ID"}
                    </p>
                    <div
                      className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
                        isProfileVerified
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {isProfileVerified ? (
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      ) : (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>{isProfileVerified ? "Registry Verified" : "Verification Pending"}</span>
                    </div>

                    <div className="mt-6 pt-6 border-t border-slate-100 text-left space-y-3.5 text-xs">
                      <div>
                        <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold tracking-wider">
                          Academic Track
                        </span>
                        <div className="mt-1 space-y-1.5">
                          <span className="font-bold text-slate-800 text-xs block leading-snug">
                            {courseTitle}
                          </span>
                          {fashionFocus ? (
                            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border shadow-xs bg-slate-50 border-slate-200">
                              <span className="text-xs">
                                {fashionFocus.key === "both"
                                  ? "👔👗"
                                  : fashionFocus.key === "female"
                                  ? "👗"
                                  : "👔"}
                              </span>
                              <span className="text-slate-800">
                                {fashionFocus.label}
                              </span>
                            </div>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                              Focus: Pending Form Section B
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold tracking-wider">
                          Administrative Hub
                        </span>
                        <span className="font-semibold text-slate-800">
                          {userData.registryHub || "Abuja / Enugu Creative Hub"}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-400 block font-mono text-[10px] uppercase font-bold tracking-wider">
                          Enrolled Since
                        </span>
                        <span className="font-semibold text-slate-800">
                          {userData.enrolledDate || "Recently Enrolled"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* KYC Documents */}
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <h4 className="font-bold text-slate-900 text-sm mb-3">
                      KYC Identity Documents
                    </h4>
                    <div className="space-y-2.5 text-xs">
                      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                        <span className="font-medium text-slate-700">Passport Photo</span>
                        {userData.profilePhoto ? (
                          <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold">
                            Attached & Synced
                          </span>
                        ) : (
                          <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold">
                            Upload Required
                          </span>
                        )}
                      </div>
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-medium text-slate-700">
                            {kycDoc.typeLabel}
                          </span>
                          {isProfileVerified ? (
                            <span className="text-[10px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-bold shrink-0">
                              Verified
                            </span>
                          ) : kycDoc.idNumber ? (
                            <span className="text-[10px] font-mono text-amber-700 bg-amber-100 px-2 py-0.5 rounded font-bold shrink-0">
                              Submitted
                            </span>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-500 bg-slate-100 px-2 py-0.5 rounded font-medium shrink-0">
                              Pending Section C
                            </span>
                          )}
                        </div>
                        {kycDoc.idNumber ? (
                          <div className="pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[11px] font-mono">
                            <span className="text-slate-400">ID Number:</span>
                            <span className="font-bold text-slate-800 tracking-wider">
                              {kycDoc.idNumber}
                            </span>
                          </div>
                        ) : (
                          <div className="pt-1 border-t border-slate-200/60 text-[10px] text-slate-400 font-mono">
                            {kycDoc.selectedType
                              ? `Selected: ${kycDoc.selectedType} · ID Number Pending`
                              : "No ID selected yet in Section C"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Col: Personal Information */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Personal Information Form */}
                  <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
                    <h3 className="font-bold text-slate-900 text-base mb-4 pb-3 border-b border-slate-100">
                      Personal & Contact Information
                    </h3>

                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        try {
                          await fetch("/api/profile", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              matricNo: userData.matricNo,
                              email: userData.email,
                              name: userData.name,
                              phone: userData.phone,
                            }),
                          });
                          const sessionStr = localStorage.getItem("wmes_session");
                          if (sessionStr) {
                            const parsed = JSON.parse(sessionStr);
                            parsed.name = userData.name;
                            parsed.phone = userData.phone;
                            localStorage.setItem("wmes_session", JSON.stringify(parsed));
                          }
                          triggerToast("Profile information updated successfully!");
                        } catch {
                          triggerToast("Profile information saved locally.");
                        }
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs"
                    >
                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          value={userData.name}
                          onChange={(e) =>
                            setUserData({ ...userData, name: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-blue-600 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Matriculation ID
                        </label>
                        <input
                          type="text"
                          disabled
                          value={userData.matricNo}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-mono cursor-not-allowed"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Primary Email
                        </label>
                        <input
                          type="email"
                          value={userData.email}
                          onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-blue-600 text-slate-900"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 mb-1">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          value={userData.phone}
                          onChange={(e) =>
                            setUserData({ ...userData, phone: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 focus:bg-white focus:outline-none focus:border-blue-600 text-slate-900"
                        />
                      </div>

                      <div className="sm:col-span-2 pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs cursor-pointer shadow-md shadow-blue-600/20 transition-all"
                        >
                          Save Profile Changes
                        </button>
                      </div>
                    </form>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 6: FORMS (Standalone Dedicated Page)
          ════════════════════════════════════════════════════════ */}
          {activeTab === "forms" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold uppercase">
                      <FileText className="w-3.5 h-3.5" />
                      <span>Official Institutional Forms Hub</span>
                    </div>
                    {hasPaidForms ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Forms Access Fee Paid (₦10,000)</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 font-mono text-[10px] font-bold uppercase">
                        <Lock className="w-3 h-3 text-amber-700" />
                        <span>Access Fee Required (₦10,000)</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Official Forms & Requests
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                    Submit official studio requests, fashion apprentice placement forms, equipment allocations, and transcript orders directly to the Registry.
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shadow-sm">
                    <span className="text-slate-400">Tracking / Portal ID:</span>
                    <span className="text-amber-400 font-extrabold">{userData.matricNo || "WMES/FTP/27A/..."}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Form No. is synchronized with your Portal ID
                  </span>
                </div>
              </div>

              {/* Gated Access Check / Empty State */}
              {!hasPaidForms ? (
                <div className="p-8 sm:p-12 rounded-2xl bg-white border border-amber-200 shadow-sm text-center flex flex-col items-center justify-center max-w-xl mx-auto my-6">
                  <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600 mb-4 shadow-sm">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                    Payment Required to Access Forms Page
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-6">
                    Access to download official PDF templates, apply for apprenticeship placement, and submit institutional request forms requires the official ₦10,000 Forms Access payment.
                  </p>
                  <button
                    onClick={() => handleLaunchAlatpay("Payment to Access the Forms Page", 10000)}
                    disabled={isProcessingPayment}
                    className="px-6 py-3 rounded-xl bg-[#961526] hover:bg-[#80101f] text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-75"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₦10,000 via ALATPay to Unlock Forms</span>
                  </button>

                  <div className="flex items-center gap-3 my-4 w-full max-w-xs">
                    <div className="flex-1 h-px bg-slate-200" />
                    <span className="text-[10px] font-mono text-slate-400 uppercase font-semibold">or</span>
                    <div className="flex-1 h-px bg-slate-200" />
                  </div>

                  <button
                    onClick={() => setActiveTab("scholarship")}
                    className="px-5 py-2.5 rounded-xl border border-amber-200 hover:border-amber-300 bg-amber-50/50 hover:bg-amber-50 text-amber-900 font-semibold text-xs flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <GraduationCap className="w-4 h-4 text-amber-700" />
                    <span>Have an Endowment or Scholarship Token? Redeem Here →</span>
                  </button>
                </div>
              ) : (
                /* WMES Application Form — Full Interactive Form */
                <WMESApplicationForm
                  onToast={triggerToast}
                  portalId={userData.matricNo}
                  defaultFullName={userData.name}
                  defaultEmail={userData.email}
                  defaultPhone=""
                  profilePhoto={userData.profilePhoto}
                  onSuccess={loadPortalData}
                />
              )}
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 7: CERTIFICATE (Official Certificate Only)
          ════════════════════════════════════════════════════════ */}
          {activeTab === "certificate" && (
            <div className="py-2">
              {/* Official Certificate Section */}
              <div className="relative w-full max-w-3xl mx-auto bg-[#FFFDF9] text-slate-900 rounded-2xl p-8 sm:p-14 shadow-xl border-8 border-[#D4AF37] text-center overflow-hidden">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-0">
                  <span className="text-4xl sm:text-6xl font-black text-amber-900/10 -rotate-25 uppercase tracking-widest font-mono">
                    PENDING COMPLETION
                  </span>
                </div>

                <div className="relative z-10">
                  <div className="mb-5 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 font-mono text-[11px] font-bold uppercase">
                    <Clock className="w-3.5 h-3.5 text-amber-700" />
                    <span>Pending — Course In Progress</span>
                  </div>

                  <div className="relative w-16 h-16 mx-auto mb-3">
                    <Image
                      src="/images/logo.png"
                      alt="WMES Seal"
                      fill
                      className="object-contain"
                    />
                  </div>

                  <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 font-bold block mb-1">
                    World Mobile Educational System
                  </span>
                  <h4 className="font-display font-black text-xs uppercase tracking-widest text-[#B8860B] mb-5">
                    Institutional Registry Hub
                  </h4>

                  <p className="text-xs font-serif italic text-slate-600 mb-2">
                    This official credential certifies that
                  </p>
                  <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-serif mb-2 underline decoration-[#D4AF37] decoration-2 underline-offset-8">
                    {userData.name || "Enrolled Candidate"}
                  </h2>
                  <p className="text-xs font-serif italic text-slate-600 mb-5 max-w-lg mx-auto leading-relaxed">
                    is enrolled and fulfilling all practical tailoring, pattern drafting, garment construction, and capstone requirements for the conferral of
                  </p>

                  <div className="p-4 sm:p-5 rounded-xl bg-amber-50/60 border border-amber-200/80 mb-6 max-w-xl mx-auto">
                    <h3 className="text-base sm:text-lg font-bold text-slate-900">
                      {courseTitle}
                    </h3>
                    <p className="text-[11px] font-mono text-slate-600 mt-1">
                      Matriculation No: {userData.matricNo || "Pending Allocation"} · Track: {enrolledTrack}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-6 border-t border-slate-200 max-w-lg mx-auto">
                    <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#D4AF37] p-1 flex items-center justify-center shrink-0">
                      <div className="w-full h-full rounded-full bg-[#D4AF37]/10 border border-[#D4AF37] flex items-center justify-center text-[8px] font-mono font-bold text-amber-900 text-center uppercase leading-none">
                        SEAL PENDING
                      </div>
                    </div>

                    <div className="text-center sm:text-right">
                      <div className="font-serif italic font-bold text-slate-900 text-base sm:text-lg border-b border-slate-300 pb-1 px-4 inline-block">
                        Prof John Nwaokike
                      </div>
                      <span className="text-xs text-slate-600 block mt-1 font-semibold">
                        Founder of WMES
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center">
                    <div className="inline-flex items-center gap-2 text-xs text-amber-800 bg-amber-50 py-2.5 px-4 rounded-xl border border-amber-200">
                      <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                      <span>Official certificate will be issued upon 100% course completion and administrative clearance.</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════════════════
              TAB 8: SCHOLARSHIP (Institutional Grants & Vouchers)
          ════════════════════════════════════════════════════════ */}
          {activeTab === "scholarship" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 font-mono text-[10px] font-bold uppercase border border-amber-200/60">
                      <GraduationCap className="w-3.5 h-3.5" />
                      <span>Official Institutional Scholarship Hub</span>
                    </div>
                    {isScholarshipRecipient ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold uppercase">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>100% Scholarship Active</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase">
                        <span>Self-Funded / Unclaimed</span>
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    Scholarships & Tuition Grants
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl leading-relaxed">
                    Activate sponsor scholarship tokens, view official grant award letters, or apply to the Secretary Desk for donor scholarship matching.
                  </p>
                </div>

                <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono text-xs font-bold shadow-sm">
                    <span className="text-slate-400">Portal ID:</span>
                    <span className="text-amber-400 font-extrabold">{userData.matricNo || "WMES/FTP/27A/..."}</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    Scholarships are locked to your Portal ID
                  </span>
                </div>
              </div>

              {/* ACTIVE SCHOLARSHIP CARD (If Already Redeemed) */}
              {isScholarshipRecipient && (
                <div className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-emerald-50/40 border border-amber-200/80 shadow-md">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-amber-200/60">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center shadow-md">
                        <Award className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold text-amber-800">
                          <span>Institutional Endowment Award</span>
                          <span>·</span>
                          <span className="text-emerald-700">Verified</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">
                          100% Tuition & Training Scholarship Scholar
                        </h3>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-mono font-bold">
                      Full Tuition Waived (₦100,000)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6 text-xs">
                    <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-sm">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Endowed By / Sponsor
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {scholarshipSponsor}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-sm">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Beneficiary Student
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        {userData.name}
                      </span>
                      <span className="block text-[11px] font-mono text-slate-500 mt-0.5">
                        {userData.matricNo}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-white border border-amber-100 shadow-sm">
                      <span className="text-[10px] uppercase font-mono font-bold text-slate-400 block mb-1">
                        Enrolled Programme
                      </span>
                      <span className="font-bold text-slate-900 text-sm">
                        Vocational Tailoring & Fashion
                      </span>
                      <span className="block text-[11px] font-mono text-emerald-600 font-semibold mt-0.5">
                        Forms Hub & Classes Active
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-emerald-900">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Your scholarship is on permanent academic record with the Academic Dean and Registry Hub.
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab("programme")}
                      className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer transition-colors shrink-0"
                    >
                      Go to Classes →
                    </button>
                  </div>
                </div>
              )}

              {/* REDEEM TOKEN & APPLY SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. Redeem Token Card (Single-Use Guarded) */}
                {hasActivatedScholarship ? (
                  <div className="p-6 sm:p-7 rounded-2xl bg-white border border-emerald-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-mono font-bold uppercase">
                          Validated · Single-Use Complete
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Scholarship Token Activated
                      </h3>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Your scholarship token has already been validated and activated on this account. Each student can only input and redeem a scholarship token once.
                      </p>

                      <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-mono text-[10px] uppercase">Token Code</span>
                          <span className="font-mono font-bold text-slate-900 tracking-wider">
                            {scholarshipToken?.token_code || scholarshipTxn?.reference || redeemSuccess?.tokenCode || "VERIFIED"}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-mono text-[10px] uppercase">Sponsor / Endowment</span>
                          <span className="font-bold text-slate-900">
                            {scholarshipSponsor || scholarshipToken?.sponsor_name || redeemSuccess?.sponsorName}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400 font-mono text-[10px] uppercase">Tuition Benefit</span>
                          <span className="font-bold text-emerald-700">
                            100% Tuition Covered (₦100,000)
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-[11px] font-mono">
                      <span className="text-slate-500 flex items-center gap-1.5">
                        <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                        Locked to Portal ID
                      </span>
                      <button
                        onClick={() => setActiveTab("programme")}
                        className="text-xs font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
                      >
                        Go to Classes →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Activate a Scholarship Token
                      </h3>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Have you been granted a scholarship by an NGO, politician, church, company, or individual donor? Enter your token below to unlock your forms and programme with ₦0 fee.
                      </p>

                      <form onSubmit={handleRedeemScholarshipToken} className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Official Scholarship Token Code
                          </label>
                          <input
                            type="text"
                            required
                            value={tokenInput}
                            onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
                            placeholder="e.g. WMES-SCH-B01-001"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono font-bold tracking-wider placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-400 focus:outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm"
                          />
                        </div>

                        {redeemError && (
                          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{redeemError}</span>
                          </div>
                        )}

                        {redeemSuccess && (
                          <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                            <span>{redeemSuccess.message}</span>
                          </div>
                        )}

                        <button
                          type="submit"
                          disabled={isRedeemingToken}
                          className="w-full py-3 rounded-xl bg-[#961526] hover:bg-[#80101f] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-900/20 cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.98] disabled:opacity-75"
                        >
                          {isRedeemingToken ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>Validating Token with Registry...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Validate & Activate Scholarship</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Single-use token · Instant fee waiver upon validation</span>
                    </div>
                  </div>
                )}

                {/* 2. Apply for Financial Aid Matching (Single-Submission Guarded) */}
                {hasAppliedForScholarship ? (
                  <div className="p-6 sm:p-7 rounded-2xl bg-white border border-blue-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                          <FileText className="w-5 h-5" />
                        </div>
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase ${
                            scholarshipApp?.status === "Awarded"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-amber-100 text-amber-800"
                          }`}
                        >
                          {scholarshipApp?.status === "Awarded"
                            ? "Awarded & Token Issued"
                            : "Application Submitted · Under Review"}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Secretary Desk Aid Request on File
                      </h3>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Your scholarship aid application has already been received and lodged with the Secretary Desk. Multiple applications are not permitted to ensure equal consideration for all applicants.
                      </p>

                      <div className="space-y-3 p-4 rounded-xl bg-slate-50 border border-slate-200/70 text-xs">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-mono text-[10px] uppercase">Applicant Portal ID</span>
                          <span className="font-mono font-bold text-slate-900">
                            {userData.matricNo}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-mono text-[10px] uppercase">State / LGA</span>
                          <span className="font-bold text-slate-900">
                            {scholarshipApp?.state_of_origin || aidState || "Recorded"}
                            {(scholarshipApp?.lga || aidLga) ? ` (${scholarshipApp?.lga || aidLga})` : ""}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                          <span className="text-slate-400 font-mono text-[10px] uppercase">Review Status</span>
                          <span className="font-bold text-amber-700">
                            {scholarshipApp?.status || "Pending Secretary Matching"}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 font-mono text-[10px] uppercase block mb-1">
                            Statement of Need
                          </span>
                          <p className="text-slate-700 italic line-clamp-2 text-[11px]">
                            &ldquo;{scholarshipApp?.reason || aidReason || "Submitted indigent student financial aid request."}&rdquo;
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2 text-[11px] font-mono text-slate-400">
                      <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                      <span>Active on Admissions &amp; Philanthropy Quota Desk</span>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-7 rounded-2xl bg-white border border-slate-200/80 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                        <FileText className="w-5 h-5" />
                      </div>
                      <h3 className="text-lg font-bold text-slate-900 mb-1">
                        Need Aid? Apply to Secretary Desk
                      </h3>
                      <p className="text-xs text-slate-500 mb-5 leading-relaxed">
                        Don&apos;t have a sponsor yet? Submit an application to our indigent student waitlist. When philanthropic donors provide sponsorship quotas, the Secretary matches vetted applicants.
                      </p>

                      <form onSubmit={handleSubmitAidApplication} className="space-y-3.5 text-xs">
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              State of Origin
                            </label>
                            <input
                              type="text"
                              required
                              value={aidState}
                              onChange={(e) => setAidState(e.target.value)}
                              placeholder="e.g. Enugu State"
                              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-slate-700 mb-1">
                              LGA
                            </label>
                            <input
                              type="text"
                              value={aidLga}
                              onChange={(e) => setAidLga(e.target.value)}
                              placeholder="e.g. Nsukka"
                              className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Statement of Need & Vocational Commitment
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={aidReason}
                            onChange={(e) => setAidReason(e.target.value)}
                            placeholder="Explain why you require scholarship aid and your readiness to complete the 6-month programme..."
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white resize-none"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-slate-700 mb-1">
                            Community / Pastor / Guarantor Contact (optional)
                          </label>
                          <input
                            type="text"
                            value={aidGuarantor}
                            onChange={(e) => setAidGuarantor(e.target.value)}
                            placeholder="e.g. Rev. Fr. Okonkwo / 0803 123 4567"
                            className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-blue-600 focus:bg-white"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingAid}
                          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
                        >
                          {isSubmittingAid ? "Submitting Request..." : "Submit Scholarship Aid Request"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

              </div>
            </div>
          )}

        </main>
      </div>

      {/* ─────────────────────────────────────────────────────────
          MODAL 2: VIDEO PLAYER MODAL FOR RECORDED SESSIONS
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {activeRecording && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-md"
              onClick={() => setActiveRecording(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl bg-[#070D18] text-white rounded-2xl overflow-hidden shadow-2xl border border-white/15 z-10"
            >
              <button
                onClick={() => setActiveRecording(null)}
                className="absolute top-4 right-4 z-20 text-white/70 hover:text-white p-2 bg-black/40 rounded-full cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video Player Canvas (Shielded Player with Custom Controls) */}
              <div className="relative w-full bg-black">
                <ShieldedVideoPlayer
                  youtubeId={
                    activeRecording.youtubeVideoId ||
                    (activeRecording.videoUrl
                      ? (activeRecording.videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) || [])[1] || ""
                      : (activeRecording.slideUrl
                      ? (activeRecording.slideUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/) || [])[1] || ""
                      : ""))
                  }
                  title={activeRecording.title}
                  category={activeRecording.category}
                  duration={activeRecording.duration}
                  instructor={activeRecording.instructor}
                  studentMatric={userData.matricNo || "WMES-STUDENT"}
                  onClose={() => setActiveRecording(null)}
                />
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-2 mb-2 font-mono text-[10px] text-blue-400 font-bold uppercase">
                  <span>{activeRecording.category || "Vocational Demonstration"}</span>
                  <span>·</span>
                  <span>{activeRecording.date}</span>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  {activeRecording.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
                  {activeRecording.description}
                </p>

                {activeRecording.notes && (
                  <div className="mb-5 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300">
                    <span className="font-bold text-blue-400 block mb-1">
                      Studio Assignment & Practical Requirements:
                    </span>
                    <span>{activeRecording.notes}</span>
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10 text-xs">
                  <div className="flex items-center gap-3">
                    <div className="relative w-9 h-9 rounded-full overflow-hidden bg-slate-700 flex items-center justify-center shrink-0">
                      {activeRecording.thumbnail ? (
                        <Image
                          src={activeRecording.thumbnail}
                          alt={activeRecording.instructor}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      ) : (
                        <User className="w-4 h-4 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <span className="font-bold text-white block leading-none">
                        {activeRecording.instructor}
                      </span>
                      {activeRecording.instructorRole && (
                        <span className="text-[10px] text-slate-400">
                          {activeRecording.instructorRole}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      Verified Curriculum Session
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────
          MODAL 3: MAKE PAYMENT MODAL
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowPaymentModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-md bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10"
            >
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-3">
                <CreditCard className="w-5 h-5" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-1">
                Make Portal Payment
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Secure transaction processed via the WMES Merchant Payment Gateway.
              </p>

              <form onSubmit={handleProcessPayment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Select Fee Item (2 Official Options)
                  </label>
                  <select
                    value={payFeeType}
                    onChange={(e) => {
                      const selected = e.target.value;
                      setPayFeeType(selected);
                      if (selected === "Payment to Access the Forms Page") {
                        setPayAmount(10000);
                      } else {
                        setPayAmount(100000);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 font-semibold text-slate-900 focus:outline-none focus:border-blue-600 cursor-pointer"
                  >
                    <option
                      value="Payment to Access the Forms Page"
                      disabled={hasPaidForms}
                    >
                      1. Payment to Access the Forms Page — ₦10,000 {hasPaidForms ? "✓ (Paid)" : ""}
                    </option>
                    <option
                      value="Payment for Tailoring Programme"
                      disabled={hasPaidProgramme}
                    >
                      2. Payment for Tailoring Programme — ₦100,000 {hasPaidProgramme ? "✓ (Paid)" : ""}
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Amount (Fixed Docket Fee)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      readOnly
                      value={`₦${payAmount.toLocaleString()}`}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-300 font-mono font-bold text-slate-900 text-sm cursor-not-allowed"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-mono text-slate-500 uppercase font-bold">
                      Fixed Docket Fee
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Official Payment Gateway
                  </label>
                  <div className="p-3.5 rounded-xl border border-red-200 bg-red-50/40 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-[#961526] text-white font-bold flex items-center justify-center text-xs shadow-sm">
                        ALAT
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-bold text-slate-900 text-xs">ALATPay Checkout</span>
                          <span className="text-[9px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                            Official
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-500">
                          Card · Bank Transfer · Wema USSD · Static Wallet
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-[#961526] font-bold">256-bit SSL</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isProcessingPayment || hasPaidBoth}
                    className={`w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                      hasPaidBoth
                        ? "bg-slate-200 text-slate-400 border border-slate-300 cursor-not-allowed shadow-none"
                        : "bg-[#961526] hover:bg-[#80101f] text-white cursor-pointer shadow-red-900/25 active:scale-[0.99] disabled:opacity-75"
                    }`}
                  >
                    {hasPaidBoth ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>All Required Payments Completed</span>
                      </>
                    ) : isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Launching ALATPay Gateway...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₦{payAmount.toLocaleString()} with ALATPay →</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────────────────────────────────
          MODAL 4: ONLINE FORM SUBMISSION MODAL
      ────────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {showFormModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFormModal(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              className="relative w-full max-w-lg bg-white rounded-2xl p-6 sm:p-8 shadow-2xl border border-slate-100 z-10 max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setShowFormModal(null)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-3">
                <FileText className="w-5 h-5" />
              </div>

              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-700 font-bold uppercase mb-1">
                <span>{showFormModal.category} Request</span>
                <span>·</span>
                <span>ETA: {showFormModal.eta}</span>
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {showFormModal.title}
              </h3>
              <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                {showFormModal.desc}
              </p>

              <form onSubmit={handleSubmitOnlineForm} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Student Matriculation Record
                  </label>
                  <input
                    type="text"
                    disabled
                    value={`${userData.name} (${userData.matricNo})`}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 font-medium cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Purpose / Justification of Request
                  </label>
                  <input
                    type="text"
                    required
                    value={formReason}
                    onChange={(e) => setFormReason(e.target.value)}
                    placeholder="e.g. Applying for graduate admissions abroad"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Specific Delivery Notes / Destination Address
                  </label>
                  <textarea
                    rows={3}
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Provide any institutional mailing address, courier details, or specific advisor time slots..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white resize-none"
                  />
                </div>

                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <UploadCloud className="w-4 h-4 text-slate-500" />
                    <span className="text-[11px] text-slate-600 font-medium">
                      Attach Supporting PDF (optional)
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 font-bold">
                    Select File
                  </span>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmittingForm}
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-600/25 transition-all"
                  >
                    {isSubmittingForm ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Submitting to Registry...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Submit Form & Generate Tracking Ticket</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

