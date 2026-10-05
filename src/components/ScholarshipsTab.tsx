"use client";

import React, { useState, useEffect } from "react";
import {
  GraduationCap,
  Plus,
  Copy,
  Check,
  Search,
  Filter,
  RefreshCw,
  Award,
  Users,
  CheckCircle2,
  Clock,
  ChevronDown,
  Sparkles,
  ExternalLink,
  X,
  FileText,
  AlertCircle,
} from "lucide-react";

interface SponsorshipBatch {
  id: string;
  sponsor_name: string;
  coverage: "tuition" | "forms" | "both";
  total_slots: number;
  claimed_slots: number;
  unit_price: number;
  total_amount: number;
  created_by: string;
  notes?: string;
  status: string;
  created_at: string;
}

interface ScholarshipToken {
  id: string;
  batch_id: string;
  token_code: string;
  coverage: "tuition" | "forms" | "both";
  sponsor_name: string;
  student_matric_no?: string;
  student_name?: string;
  student_email?: string;
  status: "Available" | "Redeemed";
  redeemed_at?: string;
  created_at: string;
}

interface ScholarshipApplication {
  id: string;
  matric_no: string;
  full_name: string;
  email: string;
  phone?: string;
  state_of_origin?: string;
  lga?: string;
  reason: string;
  commitment?: string;
  guarantor_contact?: string;
  status: "Pending" | "Awarded" | "Rejected";
  awarded_token?: string;
  created_at: string;
}

interface ScholarshipsTabProps {
  onToast: (msg: string) => void;
  actorRole?: string;
}

export default function ScholarshipsTab({
  onToast,
  actorRole = "Secretary Desk",
}: ScholarshipsTabProps) {
  const [batches, setBatches] = useState<SponsorshipBatch[]>([]);
  const [tokens, setTokens] = useState<ScholarshipToken[]>([]);
  const [applications, setApplications] = useState<ScholarshipApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubTab, setActiveSubTab] = useState<"batches" | "waitlist">("batches");
  const [expandedBatchId, setExpandedBatchId] = useState<string | null>(null);

  // Modal 1: Create Batch (NO bank details needed!)
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [sponsorName, setSponsorName] = useState("");
  const [coverage, setCoverage] = useState<"tuition" | "forms" | "both">("tuition");
  const [totalSlots, setTotalSlots] = useState(5);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Modal 2: Newly Created Tokens Preview / Export
  const [newlyCreatedTokens, setNewlyCreatedTokens] = useState<ScholarshipToken[] | null>(null);
  const [copiedBatch, setCopiedBatch] = useState(false);

  // Modal 3: Award Token to Waitlist Applicant
  const [awardTarget, setAwardTarget] = useState<ScholarshipApplication | null>(null);
  const [selectedTokenToAward, setSelectedTokenToAward] = useState("");
  const [isAwarding, setIsAwarding] = useState(false);

  // Filter & Search
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/scholarships");
      const data = await res.json();
      if (data.success) {
        setBatches(data.batches || []);
        setTokens(data.tokens || []);
        setApplications(data.applications || []);
        if (data.batches?.length > 0 && !expandedBatchId) {
          setExpandedBatchId(data.batches[0].id);
        }
      }
    } catch {
      onToast("Error loading scholarship batches");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateBatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sponsorName.trim()) {
      onToast("Please enter the sponsor / donor name.");
      return;
    }
    if (totalSlots < 1) {
      onToast("Slots must be at least 1.");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/scholarships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sponsorName: sponsorName.trim(),
          coverage,
          totalSlots,
          notes: notes.trim(),
          actorRole,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);

      if (res.ok && data.success) {
        onToast(data.message || "Scholarship tokens generated!");
        setShowCreateModal(false);
        setNewlyCreatedTokens(data.tokens || []);
        setSponsorName("");
        setTotalSlots(5);
        setNotes("");
        fetchData();
      } else {
        onToast(data.error || "Failed to create batch.");
      }
    } catch {
      setIsSubmitting(false);
      onToast("Network error creating batch.");
    }
  };

  const handleAwardToken = async () => {
    if (!awardTarget || !selectedTokenToAward) {
      onToast("Please pick an available token.");
      return;
    }
    setIsAwarding(true);

    try {
      const res = await fetch("/api/admin/scholarships/award", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          applicationId: awardTarget.id,
          tokenCode: selectedTokenToAward,
          actorRole,
        }),
      });
      const data = await res.json();
      setIsAwarding(false);

      if (res.ok && data.success) {
        onToast(data.message || "Token awarded successfully!");
        setAwardTarget(null);
        setSelectedTokenToAward("");
        fetchData();
      } else {
        onToast(data.error || "Failed to award token.");
      }
    } catch {
      setIsAwarding(false);
      onToast("Network error awarding token.");
    }
  };

  const copyTokensList = (tokensList: ScholarshipToken[]) => {
    const text = tokensList.map((t) => t.token_code).join("\n");
    navigator.clipboard.writeText(text);
    setCopiedBatch(true);
    onToast(`Copied ${tokensList.length} token codes to clipboard!`);
    setTimeout(() => setCopiedBatch(false), 2500);
  };

  // Top summary metrics
  const totalSlotsCount = batches.reduce((sum, b) => sum + (b.total_slots || 0), 0);
  const claimedSlotsCount = batches.reduce((sum, b) => sum + (b.claimed_slots || 0), 0);
  const availableSlotsCount = Math.max(0, totalSlotsCount - claimedSlotsCount);
  const totalEndowedAmount = batches.reduce((sum, b) => sum + Number(b.total_amount || 0), 0);
  const pendingAidApps = applications.filter((a) => a.status === "Pending").length;

  const availableTokens = tokens.filter((t) => t.status === "Available");

  return (
    <div className="space-y-6">
      {/* Top Banner & KPI Cards */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-mono text-[10px] font-bold uppercase border border-amber-200/60 mb-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-amber-700" />
            <span>{actorRole} &bull; Institutional Sponsorship Hub</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Scholarship & Voucher Management
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Issue sponsorship tokens for donors, manage student voucher redemptions, and award aid to applicants.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchData}
            disabled={loading}
            className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-amber-500" : ""}`} />
          </button>

          <button
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center gap-2 shadow-sm cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ Issue New Scholarship Tokens</span>
          </button>
        </div>
      </div>

      {/* KPI Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
            Total Batches Issued
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {batches.length}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Endowed Value: ₦{totalEndowedAmount.toLocaleString()}
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
            Total Slots Sponsored
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-slate-900">
            {totalSlotsCount}
          </span>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Across {batches.length} Donor Groups
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
            Claimed / Active Scholars
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-emerald-600">
            {claimedSlotsCount}
          </span>
          <span className="text-[10px] text-emerald-700/80 block mt-0.5">
            {totalSlotsCount > 0 ? Math.round((claimedSlotsCount / totalSlotsCount) * 100) : 0}% Utilization Rate
          </span>
        </div>

        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-sm">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block mb-1">
            Available Unclaimed Tokens
          </span>
          <span className="text-xl sm:text-2xl font-extrabold text-amber-600">
            {availableSlotsCount}
          </span>
          <span className="text-[10px] text-amber-700/80 block mt-0.5">
            Ready for Assignment
          </span>
        </div>
      </div>

      {/* Sub Tabs Selector */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab("batches")}
          className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer ${
            activeSubTab === "batches"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Sponsorship Batches & Tokens ({batches.length})
        </button>

        <button
          onClick={() => setActiveSubTab("waitlist")}
          className={`pb-3 px-4 font-semibold text-xs sm:text-sm border-b-2 transition-colors cursor-pointer flex items-center gap-2 ${
            activeSubTab === "waitlist"
              ? "border-amber-600 text-amber-700"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <span>Scholarship Aid Waitlist</span>
          {pendingAidApps > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
              {pendingAidApps} Pending
            </span>
          )}
        </button>
      </div>

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 1: BATCHES & TOKENS
      ────────────────────────────────────────────────────────── */}
      {activeSubTab === "batches" && (
        <div className="space-y-4">
          {batches.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-slate-200 text-center">
              <GraduationCap className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">No Sponsorship Batches Yet</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                Click &ldquo;+ Issue New Scholarship Tokens&rdquo; to create a sponsor batch and generate student tokens.
              </p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-amber-400" />
                <span>Issue First Batch</span>
              </button>
            </div>
          ) : (
            batches.map((b) => {
              const isExpanded = expandedBatchId === b.id;
              const batchTokens = tokens.filter((t) => t.batch_id === b.id);
              const percent = b.total_slots > 0 ? Math.round((b.claimed_slots / b.total_slots) * 100) : 0;

              return (
                <div
                  key={b.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden"
                >
                  <div
                    onClick={() => setExpandedBatchId(isExpanded ? null : b.id)}
                    className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center font-bold text-xs font-mono shrink-0">
                        {b.id.split("-").pop()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] uppercase font-bold text-slate-400">
                            {b.id} &bull; Created by {b.created_by}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                              b.claimed_slots >= b.total_slots
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-amber-100 text-amber-800"
                            }`}
                          >
                            {b.claimed_slots >= b.total_slots ? "Fully Claimed" : "Active"}
                          </span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900">
                          {b.sponsor_name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                          Coverage: <strong className="capitalize">{b.coverage}</strong> (₦{b.unit_price.toLocaleString()} per student) &bull; Total Value: ₦{Number(b.total_amount).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-left md:text-right">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {b.claimed_slots} / {b.total_slots} Slots Claimed ({percent}%)
                        </span>
                        <div className="w-36 h-2 bg-slate-100 rounded-full mt-1.5 overflow-hidden">
                          <div
                            className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="p-1 rounded-lg bg-slate-100 text-slate-500">
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Token Roster */}
                  {isExpanded && (
                    <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <h4 className="text-xs font-mono uppercase font-bold text-slate-500 tracking-wider">
                          Issued Token Codes ({batchTokens.length})
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            copyTokensList(batchTokens);
                          }}
                          className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer shadow-sm"
                        >
                          <Copy className="w-3.5 h-3.5 text-slate-500" />
                          <span>{copiedBatch ? "Copied All!" : "Copy All Token Codes"}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {batchTokens.map((t) => {
                          const isClaimed = t.status === "Redeemed";
                          return (
                            <div
                              key={t.id}
                              className={`p-3.5 rounded-xl border transition-all ${
                                isClaimed
                                  ? "bg-slate-100 border-slate-200 opacity-90"
                                  : "bg-white border-amber-200/80 shadow-sm"
                              }`}
                            >
                              <div className="flex items-center justify-between mb-2">
                                <span className="font-mono font-bold text-xs text-slate-900 tracking-wider">
                                  {t.token_code}
                                </span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                                    isClaimed
                                      ? "bg-slate-200 text-slate-700"
                                      : "bg-emerald-100 text-emerald-800"
                                  }`}
                                >
                                  {t.status}
                                </span>
                              </div>

                              {isClaimed ? (
                                <div className="text-[11px] text-slate-600 space-y-0.5 pt-1 border-t border-slate-200">
                                  <p className="font-semibold text-slate-800 truncate">
                                    {t.student_name || "Scholarship Student"}
                                  </p>
                                  <p className="font-mono text-slate-500 text-[10px]">
                                    ID: {t.student_matric_no}
                                  </p>
                                  <p className="text-[10px] text-slate-400">
                                    Redeemed {t.redeemed_at ? new Date(t.redeemed_at).toLocaleDateString("en-GB") : "Recently"}
                                  </p>
                                </div>
                              ) : (
                                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-amber-100">
                                  <span className="text-slate-400 font-mono">Available</span>
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(t.token_code);
                                      onToast(`Copied ${t.token_code}`);
                                    }}
                                    className="text-amber-700 hover:text-amber-800 font-semibold cursor-pointer flex items-center gap-1"
                                  >
                                    <Copy className="w-3 h-3" />
                                    <span>Copy</span>
                                  </button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          SUB-TAB 2: SCHOLARSHIP AID WAITLIST
      ────────────────────────────────────────────────────────── */}
      {activeSubTab === "waitlist" && (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">
                Student Financial Aid Requests ({applications.length})
              </h3>
              <p className="text-xs text-slate-500">
                Applicants who submitted aid requests on their student dashboard.
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">
              Available Tokens in System: <strong className="text-amber-600">{availableTokens.length}</strong>
            </span>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center text-slate-400">
              <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No Aid Requests Pending</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Students can apply via the Scholarship tab on their dashboard.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {applications.map((app) => (
                <div key={app.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">{app.full_name}</span>
                      <span className="font-mono text-xs text-slate-500 font-semibold">({app.matric_no})</span>
                      <span
                        className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase ${
                          app.status === "Awarded"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {app.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 max-w-xl line-clamp-2">
                      &ldquo;{app.reason}&rdquo;
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                      <span>Origin: {app.state_of_origin || "N/A"} {app.lga ? `(${app.lga})` : ""}</span>
                      <span>&bull;</span>
                      <span>Email: {app.email}</span>
                      {app.phone && (
                        <>
                          <span>&bull;</span>
                          <span>Tel: {app.phone}</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2">
                    {app.status === "Awarded" ? (
                      <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                        Awarded Token: <strong>{app.awarded_token}</strong>
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setAwardTarget(app);
                          if (availableTokens.length > 0) {
                            setSelectedTokenToAward(availableTokens[0].token_code);
                          }
                        }}
                        disabled={availableTokens.length === 0}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>Award Token ({availableTokens.length} Left)</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODAL 1: CREATE NEW SCHOLARSHIP BATCH (NO BANK DETAILS!)
      ────────────────────────────────────────────────────────── */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-5 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Issue Scholarship Tokens</h3>
                  <p className="text-[11px] text-slate-400">Generate voucher codes for offline donors</p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateBatch} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Sponsor / Donor Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={sponsorName}
                  onChange={(e) => setSponsorName(e.target.value)}
                  placeholder="e.g. Rotary Club of Enugu / Hon. Chukwuma / St. Jude Parish"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm font-medium"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Scholarship Coverage <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: "tuition", label: "Full Tuition", price: "₦100,000" },
                    { id: "forms", label: "Forms Fee", price: "₦10,000" },
                    { id: "both", label: "Both (Full)", price: "₦110,000" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setCoverage(opt.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        coverage === opt.id
                          ? "border-amber-600 bg-amber-50/60 text-amber-900 font-bold"
                          : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <span className="block text-xs">{opt.label}</span>
                      <span className="block text-[10px] font-mono text-slate-500 mt-0.5">{opt.price}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Number of Students (Tokens to Generate) <span className="text-red-500">*</span>
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    required
                    value={totalSlots}
                    onChange={(e) => setTotalSlots(parseInt(e.target.value, 10) || 1)}
                    className="w-28 px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white text-xs sm:text-sm font-mono font-bold"
                  />
                  <span className="text-xs text-slate-500">
                    Total Grant Value:{" "}
                    <strong className="text-slate-900">
                      ₦{(totalSlots * (coverage === "tuition" ? 100000 : coverage === "forms" ? 10000 : 110000)).toLocaleString()}
                    </strong>
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Optional Notes (for Registry Records)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Approved by Director / Batch 2026 Constituency Project"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 focus:outline-none focus:border-amber-600 focus:bg-white"
                />
              </div>

              <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                💡 <strong>Secretary Note:</strong> No bank teller or transaction session required. Tokens are generated instantly and logged to the Super Admin audit trail.
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold flex items-center gap-2 cursor-pointer transition-colors shadow-md disabled:opacity-50"
                >
                  {isSubmitting ? "Generating Tokens..." : "✨ Generate Scholarship Tokens"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODAL 2: NEWLY CREATED TOKENS EXPORT / DELIVERY
      ────────────────────────────────────────────────────────── */}
      {newlyCreatedTokens && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-lg bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">
                    {newlyCreatedTokens.length} Tokens Successfully Generated!
                  </h3>
                  <p className="text-[11px] text-slate-400">Ready to deliver to the sponsor</p>
                </div>
              </div>
              <button
                onClick={() => setNewlyCreatedTokens(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Copy these codes to forward to the sponsor via WhatsApp or email. Candidates can redeem them directly in their student dashboard.
            </p>

            <div className="max-h-60 overflow-y-auto p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 font-mono text-xs">
              {newlyCreatedTokens.map((t) => (
                <div key={t.id} className="flex items-center justify-between py-1 px-2 hover:bg-white rounded transition-colors">
                  <span className="font-bold text-slate-900">{t.token_code}</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded font-sans font-bold">
                    Available
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex items-center justify-between gap-3">
              <button
                onClick={() => copyTokensList(newlyCreatedTokens)}
                className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <Copy className="w-4 h-4 text-amber-400" />
                <span>{copiedBatch ? "Copied All!" : "Copy All Tokens"}</span>
              </button>

              <button
                onClick={() => setNewlyCreatedTokens(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODAL 3: AWARD TOKEN TO WAITLIST STUDENT
      ────────────────────────────────────────────────────────── */}
      {awardTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 space-y-4 animate-scale-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Award Scholarship Token</h3>
              <button
                onClick={() => setAwardTarget(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-1">
              <p className="font-bold text-slate-900">{awardTarget.full_name}</p>
              <p className="font-mono text-slate-500">Portal ID: {awardTarget.matric_no}</p>
              <p className="text-slate-600 italic mt-1">&ldquo;{awardTarget.reason}&rdquo;</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Select Available Token
              </label>
              <select
                value={selectedTokenToAward}
                onChange={(e) => setSelectedTokenToAward(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 font-mono text-xs font-bold focus:outline-none focus:border-emerald-600 focus:bg-white"
              >
                {availableTokens.map((t) => (
                  <option key={t.id} value={t.token_code}>
                    {t.token_code} &mdash; Sponsored by {t.sponsor_name} ({t.coverage})
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3 text-xs">
              <button
                type="button"
                onClick={() => setAwardTarget(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAwardToken}
                disabled={isAwarding || !selectedTokenToAward}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                {isAwarding ? "Awarding..." : "Confirm & Unlock Student Portal"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
