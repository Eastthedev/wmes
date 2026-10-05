"use client";

import React, { useState, useEffect } from "react";
import {
  Video,
  Plus,
  Play,
  Trash2,
  Eye,
  CheckCircle2,
  Clock,
  Sparkles,
  Search,
  Filter,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  Lock,
  X,
  Layers,
  FileText,
  UserCheck,
  AlertCircle,
} from "lucide-react";
import Image from "next/image";
import ShieldedVideoPlayer from "./ShieldedVideoPlayer";

interface RecordedSessionItem {
  id: string;
  title: string;
  instructor: string;
  instructor_role?: string;
  duration: string;
  category: string;
  date: string;
  thumbnail_url?: string;
  video_url?: string;
  youtube_video_id?: string;
  target_track: "male" | "female" | "both";
  description?: string;
  notes?: string;
  views?: number;
  created_by?: string;
  created_at: string;
}

interface SessionsTabProps {
  actorRole?: "Super Admin" | "Secretary Desk";
  onToast: (msg: string) => void;
}

// Helper to extract clean 11-char YouTube ID on client for instant preview
function extractClientYouTubeId(urlOrId: string): string | null {
  if (!urlOrId) return null;
  const trimmed = urlOrId.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const regExp =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export default function SessionsTab({
  actorRole = "Secretary Desk",
  onToast,
}: SessionsTabProps) {
  const [sessions, setSessions] = useState<RecordedSessionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTrackFilter, setSelectedTrackFilter] = useState<
    "all" | "male" | "female" | "both"
  >("all");

  // Upload Modal State
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Fields (Set entirely by Secretary / Admin)
  const [targetTrack, setTargetTrack] = useState<"male" | "female" | "both">("both");
  const [videoUrlInput, setVideoUrlInput] = useState("");
  const [title, setTitle] = useState("");
  const [uploadedBy, setUploadedBy] = useState<string>(actorRole || "Secretary Desk");
  const [instructor, setInstructor] = useState("");
  const [instructorRole, setInstructorRole] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("Pattern Drafting & Construction");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  // Preview Modal State
  const [previewSession, setPreviewSession] = useState<RecordedSessionItem | null>(null);

  // Delete State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Live parsed YouTube ID for upload modal preview
  const liveParsedYtId = extractClientYouTubeId(videoUrlInput);

  const fetchSessions = async (showToastMsg = false) => {
    try {
      setRefreshing(true);
      const res = await fetch("/api/admin/sessions");
      const data = await res.json();
      if (data.success) {
        setSessions(data.sessions || []);
        if (showToastMsg) onToast("Recorded sessions list refreshed!");
      } else {
        onToast(data.error || "Failed to load recorded sessions");
      }
    } catch (_err) {
      onToast("Network error fetching sessions");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, []);

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      onToast("Please provide a session title");
      return;
    }

    if (!liveParsedYtId) {
      onToast("Please provide a valid YouTube watch link, youtu.be link, or 11-char ID");
      return;
    }

    if (!instructor.trim()) {
      onToast("Please specify the instructor or master tailor name");
      return;
    }

    if (!duration.trim()) {
      onToast("Please specify the session duration (e.g. 45 mins)");
      return;
    }

    if (!description.trim()) {
      onToast("Please provide the video lesson description");
      return;
    }

    if (!uploadedBy.trim()) {
      onToast("Please specify the person uploading (Secretary / Staff Name)");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/admin/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          videoUrl: videoUrlInput.trim(),
          targetTrack,
          instructor: instructor.trim(),
          instructorRole: instructorRole.trim(),
          duration: duration.trim(),
          category: category.trim(),
          description: description.trim(),
          notes: notes.trim(),
          uploadedBy: uploadedBy.trim(),
          actorRole: uploadedBy.trim(),
        }),
      });

      const data = await res.json();
      if (data.success) {
        onToast(`Session successfully uploaded for ${targetTrack.toUpperCase()} audience!`);
        setIsUploadOpen(false);
        // Reset form to clean empty state
        setTitle("");
        setVideoUrlInput("");
        setInstructor("");
        setInstructorRole("");
        setDuration("");
        setDescription("");
        setNotes("");
        setTargetTrack("both");
        fetchSessions();
      } else {
        onToast(data.error || "Failed to upload session");
      }
    } catch (_err) {
      onToast("Network error during session upload");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSession = async (id: string, sessionTitle: string) => {
    if (!confirm(`Are you sure you want to delete session "${sessionTitle}"? Students will no longer see this replay.`)) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/sessions?id=${encodeURIComponent(id)}&actorRole=${encodeURIComponent(actorRole)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        onToast("Session deleted from library");
        setSessions((prev) => prev.filter((s) => s.id !== id));
      } else {
        onToast(data.error || "Failed to delete session");
      }
    } catch (_err) {
      onToast("Error deleting session");
    } finally {
      setDeletingId(null);
    }
  };

  // Filtered Sessions
  const filteredSessions = sessions.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.description || "").toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTrack =
      selectedTrackFilter === "all" || s.target_track === selectedTrackFilter;

    return matchesSearch && matchesTrack;
  });

  const countMale = sessions.filter((s) => s.target_track === "male").length;
  const countFemale = sessions.filter((s) => s.target_track === "female").length;
  const countBoth = sessions.filter((s) => s.target_track === "both").length;

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 font-mono text-[11px] font-semibold uppercase tracking-wider mb-3">
            <Video className="w-3.5 h-3.5 text-blue-400" />
            <span>Curriculum Replays & Atelier Demonstrations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Recorded Video Sessions
          </h2>
          <p className="text-slate-400 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
            Upload unlisted YouTube class recordings, select which fashion track audience (Male, Female, or Both) can watch, and let students stream them through our secure shielded player without exposing the YouTube link.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap items-center gap-3">
          <button
            onClick={() => fetchSessions(true)}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 font-medium text-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>

          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-blue-600/25 transition-all cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Upload Recorded Session</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics & Audience Breakdown Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div
          onClick={() => setSelectedTrackFilter("all")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTrackFilter === "all"
              ? "bg-blue-50 border-blue-300 ring-2 ring-blue-500/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-slate-500 uppercase font-bold">
              Total Sessions
            </span>
            <Video className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{sessions.length}</p>
          <p className="text-[11px] text-slate-500 mt-1">All catalogued replays</p>
        </div>

        <div
          onClick={() => setSelectedTrackFilter("male")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTrackFilter === "male"
              ? "bg-blue-50 border-blue-400 ring-2 ring-blue-500/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-blue-600 uppercase font-bold">
              👔 Male Track Only
            </span>
            <span className="w-2 h-2 rounded-full bg-blue-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{countMale}</p>
          <p className="text-[11px] text-slate-500 mt-1">Exclusive to Menswear</p>
        </div>

        <div
          onClick={() => setSelectedTrackFilter("female")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTrackFilter === "female"
              ? "bg-purple-50 border-purple-400 ring-2 ring-purple-500/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-purple-600 uppercase font-bold">
              👗 Female Track Only
            </span>
            <span className="w-2 h-2 rounded-full bg-purple-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{countFemale}</p>
          <p className="text-[11px] text-slate-500 mt-1">Exclusive to Womenswear</p>
        </div>

        <div
          onClick={() => setSelectedTrackFilter("both")}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            selectedTrackFilter === "both"
              ? "bg-emerald-50 border-emerald-400 ring-2 ring-emerald-500/20 shadow-sm"
              : "bg-white border-slate-200/80 hover:border-slate-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-mono text-emerald-600 uppercase font-bold">
              👔👗 Dual / Both Tracks
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          </div>
          <p className="text-2xl font-black text-slate-900">{countBoth}</p>
          <p className="text-[11px] text-slate-500 mt-1">Visible to all students</p>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search session title, instructor, or notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
          <span className="text-[11px] font-mono text-slate-400 uppercase font-bold shrink-0">
            Target Audience:
          </span>
          {(["all", "male", "female", "both"] as const).map((trackKey) => (
            <button
              key={trackKey}
              onClick={() => setSelectedTrackFilter(trackKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap cursor-pointer transition-all ${
                selectedTrackFilter === trackKey
                  ? "bg-slate-900 text-white shadow-sm"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-600"
              }`}
            >
              {trackKey === "all"
                ? "All Tracks"
                : trackKey === "male"
                ? "👔 Male"
                : trackKey === "female"
                ? "👗 Female"
                : "👔👗 Both"}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Sessions Grid */}
      {loading ? (
        <div className="p-16 bg-white rounded-2xl border border-slate-200 text-center flex flex-col items-center justify-center">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mb-3" />
          <p className="text-xs text-slate-500 font-mono">Loading recorded sessions...</p>
        </div>
      ) : filteredSessions.length === 0 ? (
        <div className="p-16 bg-white rounded-2xl border border-dashed border-slate-200 text-center flex flex-col items-center justify-center max-w-xl mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-3">
            <Video className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Recorded Sessions Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
            {searchTerm || selectedTrackFilter !== "all"
              ? "No recorded sessions match the current search or track audience filter."
              : "No recorded lectures have been uploaded yet. Click '+ Upload Recorded Session' above to publish the first demonstration."}
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="mt-4 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
          >
            Upload New Session
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSessions.map((session) => {
            const isMale = session.target_track === "male";
            const isFemale = session.target_track === "female";
            const isBoth = session.target_track === "both";

            const ytId =
              session.youtube_video_id ||
              extractClientYouTubeId(session.video_url || "");

            const thumb =
              session.thumbnail_url ||
              (ytId
                ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
                : "/images/service_training_capacity.jpg");

            return (
              <div
                key={session.id}
                className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Thumbnail Banner with Track Tag */}
                  <div className="relative aspect-video w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={thumb}
                      alt={session.title}
                      fill
                      unoptimized
                      className="object-cover group-hover:scale-105 transition-transform duration-300 opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                    {/* Centered Play Button (Opens Preview) */}
                    <button
                      onClick={() => setPreviewSession(session)}
                      className="absolute inset-0 flex items-center justify-center cursor-pointer group/play"
                      title="Preview in Shielded Player"
                    >
                      <div className="w-12 h-12 rounded-full bg-blue-600/90 text-white flex items-center justify-center shadow-xl group-hover/play:scale-110 group-hover/play:bg-blue-600 transition-all">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </button>

                    {/* Target Track Badge (Top-Left) */}
                    <div className="absolute top-3 left-3">
                      {isMale && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-600/95 text-white font-mono text-[10px] font-bold shadow-md">
                          👔 Male Fashion Making
                        </span>
                      )}
                      {isFemale && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-600/95 text-white font-mono text-[10px] font-bold shadow-md">
                          👗 Female Fashion Making
                        </span>
                      )}
                      {isBoth && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-600/95 text-white font-mono text-[10px] font-bold shadow-md">
                          👔👗 Both Tracks (General)
                        </span>
                      )}
                    </div>

                    {/* Duration Pill (Bottom-Right) */}
                    <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-black/75 backdrop-blur-md text-white font-mono text-[10px] font-bold">
                      {session.duration}
                    </div>

                    {/* Shield Icon Badge */}
                    <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-sm text-emerald-400 font-mono text-[9px] flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Shielded</span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-blue-600 font-bold uppercase">
                      <span>{session.category}</span>
                      <span>•</span>
                      <span>{session.date}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-blue-600 transition-colors line-clamp-2">
                      {session.title}
                    </h3>

                    {session.description && (
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {session.description}
                      </p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                      <div>
                        <span className="font-bold text-slate-900 block leading-tight">
                          {session.instructor}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {session.instructor_role || "Fashion Faculty"}
                        </span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        By {session.created_by || "Secretary Desk"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => setPreviewSession(session)}
                    className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Test Player</span>
                  </button>

                  <button
                    onClick={() => handleDeleteSession(session.id, session.title)}
                    disabled={deletingId === session.id}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Delete session"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODAL 1: UPLOAD RECORDED SESSION (SECRETARY DESK)
      ────────────────────────────────────────────────────────── */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            onClick={() => !isSubmitting && setIsUploadOpen(false)}
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-white">
                    Upload Recorded Session
                  </h3>
                  <p className="text-[11px] text-slate-300">
                    Host on unlisted YouTube · Stream securely on student dashboard
                  </p>
                </div>
              </div>

              <button
                onClick={() => !isSubmitting && setIsUploadOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/70 hover:text-white cursor-pointer transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body (Scrollable) */}
            <form onSubmit={handleUploadSubmit} className="p-6 overflow-y-auto space-y-5">
              {/* STEP 1: TARGET TRACK SELECTION (THE CORE REQUIREMENT) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  1. Select Target Student Audience <span className="text-rose-500">*</span>
                </label>
                <p className="text-xs text-slate-500 mb-3">
                  Choose which students will see this video on their dashboard according to the fashion track they selected during registration:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Option A: Male Fashion Making */}
                  <div
                    onClick={() => setTargetTrack("male")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      targetTrack === "male"
                        ? "border-blue-600 bg-blue-50/80 ring-2 ring-blue-500/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">👔</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          targetTrack === "male"
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {targetTrack === "male" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-slate-900">Male Fashion Only</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Visible to Male and Dual-track students
                    </p>
                  </div>

                  {/* Option B: Female Fashion Making */}
                  <div
                    onClick={() => setTargetTrack("female")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      targetTrack === "female"
                        ? "border-purple-600 bg-purple-50/80 ring-2 ring-purple-500/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">👗</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          targetTrack === "female"
                            ? "border-purple-600 bg-purple-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {targetTrack === "female" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-slate-900">Female Fashion Only</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Visible to Female and Dual-track students
                    </p>
                  </div>

                  {/* Option C: Both Tracks */}
                  <div
                    onClick={() => setTargetTrack("both")}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all ${
                      targetTrack === "both"
                        ? "border-emerald-600 bg-emerald-50/80 ring-2 ring-emerald-500/20 shadow-sm"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-lg">👔👗</span>
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                          targetTrack === "both"
                            ? "border-emerald-600 bg-emerald-600 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {targetTrack === "both" && <span className="w-1.5 h-1.5 bg-white rounded-full" />}
                      </span>
                    </div>
                    <p className="font-bold text-xs text-slate-900">Both Tracks</p>
                    <p className="text-[10px] text-slate-500 mt-1 leading-snug">
                      Visible to ALL registered students
                    </p>
                  </div>
                </div>
              </div>

              {/* STEP 2: YOUTUBE VIDEO LINK (UNLISTED) */}
              <div>
                <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1.5">
                  2. Unlisted YouTube Video Link or ID <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or youtu.be/..."
                  value={videoUrlInput}
                  onChange={(e) => setVideoUrlInput(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white font-mono"
                />

                {/* YouTube Link Validation Badge & Live Preview */}
                {liveParsedYtId ? (
                  <div className="mt-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div className="flex-1 text-xs">
                      <p className="font-bold text-emerald-900">
                        Valid YouTube Video Detected (ID: {liveParsedYtId})
                      </p>
                      <p className="text-emerald-700 text-[11px]">
                        Video will be wrapped in our secure shielded player. Students will have play/pause controls but no access to the YouTube link.
                      </p>
                    </div>
                  </div>
                ) : videoUrlInput.trim() ? (
                  <div className="mt-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center gap-2 text-xs text-amber-800">
                    <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Please enter a valid YouTube video link or 11-character video ID.</span>
                  </div>
                ) : null}

                {/* Helpful Instruction Tip */}
                <div className="mt-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>Secretary Note:</strong> Make sure the video is saved as <strong>Unlisted</strong> in YouTube Studio so public viewers cannot find it on YouTube search, and only students in your selected track can watch it inside their WMES dashboard.
                  </span>
                </div>
              </div>

              {/* STEP 3: SESSION METADATA */}
              <div className="space-y-4 pt-2 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    3. Session Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Precision Notch Lapel Collar Drafting & Shoulder Pad Fitting"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Uploaded By (Secretary / Staff Name) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Secretary Mary Okafor (Admissions Registry)"
                      value={uploadedBy}
                      onChange={(e) => setUploadedBy(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Instructor / Master Tailor Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Master Tailor Emeka Okeke"
                      value={instructor}
                      onChange={(e) => setInstructor(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Instructor Role / Title
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior Menswear Specialist"
                      value={instructorRole}
                      onChange={(e) => setInstructorRole(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                      Session Duration <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 45 mins, 1 hr 15 mins"
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      required
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    Topic Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white cursor-pointer"
                  >
                    <option value="Pattern Drafting & Construction">Pattern Drafting & Construction</option>
                    <option value="Garment Assembly & Sewing">Garment Assembly & Sewing</option>
                    <option value="Equipment, Ironing & Finishing">Equipment, Ironing & Finishing</option>
                    <option value="Haute Couture Techniques">Haute Couture Techniques</option>
                    <option value="Fashion Business & Pricing">Fashion Business & Pricing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    Video / Lesson Description <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter comprehensive class notes, topics demonstrated in this video, and learning objectives..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-800 uppercase tracking-wide mb-1">
                    Additional Studio Notes / Homework Assignment
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bring 2 yards of calico, tailor chalk, and paper shears for next class"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-slate-300 bg-slate-50 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsUploadOpen(false)}
                  disabled={isSubmitting}
                  className="px-5 py-2.5 rounded-xl bg-slate-150 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={
                    isSubmitting ||
                    !liveParsedYtId ||
                    !title.trim() ||
                    !instructor.trim() ||
                    !duration.trim() ||
                    !description.trim() ||
                    !uploadedBy.trim()
                  }
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Publishing Session...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Publish to Student Dashboard</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────
          MODAL 2: SHIELDED PLAYER PREVIEW MODAL (SECRETARY TESTING)
      ────────────────────────────────────────────────────────── */}
      {previewSession && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-950/80 backdrop-blur-md"
            onClick={() => setPreviewSession(null)}
          />

          <div className="relative w-full max-w-4xl bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 z-10">
            {/* Header info */}
            <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-white">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[9px] uppercase font-bold">
                  {previewSession.target_track === "male"
                    ? "👔 Male Track Only"
                    : previewSession.target_track === "female"
                    ? "👗 Female Track Only"
                    : "👔👗 Both Tracks"}
                </span>
                <span className="text-xs text-slate-300 font-semibold truncate max-w-md">
                  Preview: {previewSession.title}
                </span>
              </div>

              <button
                onClick={() => setPreviewSession(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player */}
            <div className="p-2 sm:p-4 bg-black">
              <ShieldedVideoPlayer
                youtubeId={
                  previewSession.youtube_video_id ||
                  extractClientYouTubeId(previewSession.video_url || "") ||
                  ""
                }
                title={previewSession.title}
                category={previewSession.category}
                duration={previewSession.duration}
                instructor={previewSession.instructor}
                studentMatric="SECRETARY-PREVIEW"
                onClose={() => setPreviewSession(null)}
              />
            </div>

            {/* Footer notes */}
            <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Testing Shielded Player: YouTube link is completely hidden and protected against right-click copying.
                </span>
              </div>
              <button
                onClick={() => setPreviewSession(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
