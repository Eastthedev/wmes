"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  RefreshCw,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ShieldCheck,
  User,
  GraduationCap,
  CreditCard,
  FileText,
} from "lucide-react";

interface AuditLogItem {
  id: string;
  actor: string;
  action: string;
  details: string;
  metadata?: any;
  created_at: string;
}

export default function AuditTrailTab({
  onToast,
}: {
  onToast: (msg: string) => void;
}) {
  const [logs, setLogs] = useState<AuditLogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterActor, setFilterActor] = useState("all");

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/audit-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.logs || []);
      }
    } catch {
      onToast("Error loading audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.actor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActor =
      filterActor === "all"
        ? true
        : filterActor === "secretary"
        ? log.actor.toLowerCase().includes("secretary")
        : filterActor === "student"
        ? log.actor.toLowerCase().includes("student")
        : filterActor === "admin"
        ? log.actor.toLowerCase().includes("admin")
        : true;

    return matchesSearch && matchesActor;
  });

  const getActionBadgeColor = (action: string) => {
    if (action.includes("ISSUE")) return "bg-purple-100 text-purple-800 border-purple-200";
    if (action.includes("REDEEM")) return "bg-emerald-100 text-emerald-800 border-emerald-200";
    if (action.includes("AWARD")) return "bg-blue-100 text-blue-800 border-blue-200";
    if (action.includes("APPROVE")) return "bg-teal-100 text-teal-800 border-teal-200";
    return "bg-slate-100 text-slate-700 border-slate-200";
  };

  const getActorIcon = (actor: string) => {
    if (actor.toLowerCase().includes("secretary")) {
      return <User className="w-3.5 h-3.5 text-amber-600" />;
    }
    if (actor.toLowerCase().includes("student")) {
      return <GraduationCap className="w-3.5 h-3.5 text-blue-600" />;
    }
    return <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[10px] font-bold uppercase border border-emerald-200/60 mb-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
            <span>Super Admin &bull; Immutable Governance Stream</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Live Administrative Audit Trail
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time chronological activity feed recording token creations, student redemptions, and staff actions.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          disabled={loading}
          className="p-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer self-start sm:self-auto"
          title="Refresh audit feed"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-emerald-500" : ""}`} />
        </button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action or keyword..."
            className="w-full pl-9 pr-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2">
          {["all", "secretary", "student", "admin"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterActor(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-colors cursor-pointer ${
                filterActor === cat
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {cat === "all" ? "All Actors" : `${cat}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between font-mono text-xs text-slate-400">
          <span>{filteredLogs.length} Logged Events</span>
          <span>Automatic Tamper-Resistant Ledger</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No matching audit logs found</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Actions taken by the Secretary or students will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredLogs.map((log) => {
              const dateStr = new Date(log.created_at).toLocaleString("en-GB", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              });

              return (
                <div
                  key={log.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-3 hover:bg-slate-50/70 transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-bold">
                        {getActorIcon(log.actor)}
                        <span>{log.actor}</span>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase border ${getActionBadgeColor(
                          log.action
                        )}`}
                      >
                        {log.action.replace(/_/g, " ")}
                      </span>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {log.details}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center gap-1.5 text-[11px] font-mono text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{dateStr}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
