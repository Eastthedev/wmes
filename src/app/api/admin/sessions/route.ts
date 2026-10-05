import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

// Helper to extract clean 11-char YouTube Video ID
export function extractYouTubeId(urlOrId: string): string | null {
  if (!urlOrId || typeof urlOrId !== "string") return null;
  const trimmed = urlOrId.trim();

  // If already an 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  // Matches watch?v=ID, youtu.be/ID, embed/ID, shorts/ID, live/ID
  const regExp =
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|live\/|watch\?v=|watch\?.+&v=))([\w-]{11})/;
  const match = trimmed.match(regExp);
  return match ? match[1] : null;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const track = searchParams.get("track");

    let query = supabaseAdmin
      .from("recorded_sessions")
      .select("*")
      .order("created_at", { ascending: false });

    if (track && track !== "all") {
      query = query.or(`target_track.eq.${track},target_track.eq.both`);
    }

    const { data: sessions, error } = await query;
    if (error) throw error;

    return NextResponse.json({
      success: true,
      sessions: sessions || [],
    });
  } catch (error: any) {
    console.error("[admin sessions GET error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch sessions" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      videoUrl,
      targetTrack = "both",
      instructor,
      instructorRole = "",
      duration,
      category = "Vocational Tailoring",
      description,
      notes = "",
      uploadedBy,
      actorRole = "Secretary Desk",
    } = body;

    if (!title?.trim()) {
      return NextResponse.json(
        { success: false, error: "Session title is required." },
        { status: 400 }
      );
    }

    if (!instructor?.trim()) {
      return NextResponse.json(
        { success: false, error: "Instructor or Facilitator name is required and must be provided by the secretary." },
        { status: 400 }
      );
    }

    if (!description?.trim()) {
      return NextResponse.json(
        { success: false, error: "Video/Lesson description is required and must be provided by the secretary." },
        { status: 400 }
      );
    }

    if (!duration?.trim()) {
      return NextResponse.json(
        { success: false, error: "Session duration is required (e.g. 45 mins)." },
        { status: 400 }
      );
    }

    if (!videoUrl?.trim()) {
      return NextResponse.json(
        { success: false, error: "YouTube Video URL or Video ID is required." },
        { status: 400 }
      );
    }

    const youtubeId = extractYouTubeId(videoUrl);
    if (!youtubeId) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Invalid YouTube link or ID. Please paste a valid YouTube watch link, youtu.be link, or an 11-character video ID.",
        },
        { status: 400 }
      );
    }

    const validTracks = ["male", "female", "both"];
    const cleanTrack = validTracks.includes(targetTrack?.toLowerCase())
      ? targetTrack.toLowerCase()
      : "both";

    const sessionId = `REC-${Date.now().toString(36).toUpperCase()}-${Math.floor(
      1000 + Math.random() * 9000
    )}`;

    const thumbnailUrl = `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`;
    const cleanVideoUrl = `https://www.youtube-nocookie.com/embed/${youtubeId}`;
    const creatorName = uploadedBy?.trim() || actorRole?.trim() || "Secretary Desk";

    const newSession = {
      id: sessionId,
      title: title.trim(),
      instructor: instructor.trim(),
      instructor_role: instructorRole?.trim() || "",
      duration: duration.trim(),
      category: category?.trim() || "Vocational Tailoring",
      date: new Date().toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      thumbnail_url: thumbnailUrl,
      video_url: cleanVideoUrl,
      youtube_video_id: youtubeId,
      target_track: cleanTrack,
      description: description.trim(),
      notes: notes?.trim() || "",
      created_by: creatorName,
      views: 0,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabaseAdmin
      .from("recorded_sessions")
      .insert(newSession)
      .select()
      .single();

    if (error) throw error;

    // Disseminate targeted notifications to enrolled students
    try {
      const trackLabel =
        cleanTrack === "male"
          ? "Male Fashion Making"
          : cleanTrack === "female"
          ? "Female Fashion Making"
          : "Fashion Masterclass";

      await supabaseAdmin.from("notifications").insert({
        title: `New Session: ${title.trim()}`,
        message: `New demonstration by ${instructor} (${trackLabel}) is now ready in your Recorded Session library.`,
        type: "video_uploaded",
        category: "video",
        link_tab: "recorded",
        read: false,
      });
    } catch (_notifErr) {
      console.warn("Notification insert warning:", _notifErr);
    }

    // Try logging to audit trail if table exists
    try {
      await supabaseAdmin.from("admin_audit_logs").insert({
        action: "RECORDED_SESSION_UPLOADED",
        actor: actorRole || "Secretary Desk",
        details: `Uploaded session "${title.trim()}" targeted to [${cleanTrack.toUpperCase()}] audience (YouTube ID: ${youtubeId}).`,
      });
    } catch (_auditErr) {
      // Audit table might not exist, silently ignore
    }

    return NextResponse.json({
      success: true,
      message: `Recorded session uploaded successfully for ${cleanTrack.toUpperCase()} audience!`,
      session: data,
    });
  } catch (error: any) {
    console.error("[admin sessions POST error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to save session." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const actorRole = searchParams.get("actorRole") || "Secretary Desk";

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Session ID is required." },
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("recorded_sessions")
      .delete()
      .eq("id", id);

    if (error) throw error;

    // Try logging to audit trail
    try {
      await supabaseAdmin.from("admin_audit_logs").insert({
        action: "RECORDED_SESSION_DELETED",
        actor: actorRole,
        details: `Deleted recorded session ID ${id}.`,
      });
    } catch (_e) {}

    return NextResponse.json({
      success: true,
      message: "Session successfully removed from library.",
    });
  } catch (error: any) {
    console.error("[admin sessions DELETE error]:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to delete session." },
      { status: 500 }
    );
  }
}
