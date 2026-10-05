"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  X,
  ShieldCheck,
  Lock,
} from "lucide-react";

interface ShieldedVideoPlayerProps {
  youtubeId: string;
  title: string;
  category?: string;
  duration?: string;
  instructor?: string;
  studentMatric?: string;
  onClose?: () => void;
}

export default function ShieldedVideoPlayer({
  youtubeId,
  title,
  category = "Vocational Masterclass",
  duration = "45 mins",
  instructor = "Lead Atelier Faculty",
  studentMatric = "WMES-STUDENT",
  onClose,
}: ShieldedVideoPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isBuffering, setIsBuffering] = useState(true);
  const [playerReady, setPlayerReady] = useState(false);
  const [watermarkPos, setWatermarkPos] = useState({ top: "12%", left: "10%" });

  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Send command to YouTube iframe via postMessage
  const sendCommand = (func: string, args: any[] = []) => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        JSON.stringify({
          event: "command",
          func,
          args,
        }),
        "*"
      );
    }
  };

  // Toggle Play / Pause
  const togglePlay = () => {
    if (isPlaying) {
      sendCommand("pauseVideo");
      setIsPlaying(false);
    } else {
      sendCommand("playVideo");
      setIsPlaying(true);
    }
  };

  // Seek video
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    sendCommand("seekTo", [newTime, true]);
  };

  // Volume change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVol = parseInt(e.target.value, 10);
    setVolume(newVol);
    if (isMuted && newVol > 0) {
      setIsMuted(false);
      sendCommand("unMute");
    }
    sendCommand("setVolume", [newVol]);
  };

  // Toggle Mute
  const toggleMute = () => {
    if (isMuted) {
      sendCommand("unMute");
      sendCommand("setVolume", [volume || 50]);
      setIsMuted(false);
    } else {
      sendCommand("mute");
      setIsMuted(true);
    }
  };

  // Restart video
  const handleRestart = () => {
    sendCommand("seekTo", [0, true]);
    sendCommand("playVideo");
    setIsPlaying(true);
  };

  // Toggle Fullscreen on player container (not the iframe, to keep controls wrapped)
  const toggleFullscreen = () => {
    if (!containerRef.current) return;

    if (!document.fullscreenElement) {
      containerRef.current
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => console.error("Fullscreen error:", err));
    } else {
      document
        .exitFullscreen()
        .then(() => setIsFullscreen(false))
        .catch((err) => console.error("Exit fullscreen error:", err));
    }
  };

  // Listen for fullscreen change
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  // Listen to postMessages from YouTube player
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      try {
        if (!e.data || typeof e.data !== "string") return;
        const data = JSON.parse(e.data);

        // Player state events
        if (data.event === "onReady" || data.info?.playerState !== undefined) {
          setPlayerReady(true);
          setIsBuffering(false);
        }

        if (data.info) {
          if (data.info.duration) {
            setTotalDuration(data.info.duration);
          }
          if (data.info.currentTime !== undefined) {
            setCurrentTime(data.info.currentTime);
          }
          if (data.info.playerState !== undefined) {
            // 1 = playing, 2 = paused, 0 = ended, 3 = buffering
            if (data.info.playerState === 1) {
              setIsPlaying(true);
              setIsBuffering(false);
            } else if (data.info.playerState === 2) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (data.info.playerState === 0) {
              setIsPlaying(false);
              setIsBuffering(false);
            } else if (data.info.playerState === 3) {
              setIsBuffering(true);
            }
          }
        }
      } catch (_err) {
        // Not a JSON message from YouTube, ignore
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Periodic poll for time update if playing
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying) {
      interval = setInterval(() => {
        // Request info from iframe
        if (iframeRef.current && iframeRef.current.contentWindow) {
          iframeRef.current.contentWindow.postMessage(
            JSON.stringify({
              event: "listening",
            }),
            "*"
          );
        }
        setCurrentTime((prev) => {
          if (totalDuration > 0 && prev < totalDuration) {
            return prev + 1;
          }
          return prev;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, totalDuration]);

  // Anti-piracy watermark shift every 25s
  useEffect(() => {
    const interval = setInterval(() => {
      const positions = [
        { top: "10%", left: "8%" },
        { top: "12%", left: "70%" },
        { top: "75%", left: "10%" },
        { top: "72%", left: "68%" },
      ];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setWatermarkPos(randomPos);
    }, 25000);
    return () => clearInterval(interval);
  }, []);

  // Auto-hide controls after inactivity
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  // Format seconds to mm:ss
  const formatTime = (seconds: number) => {
    if (isNaN(seconds) || seconds < 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const progressPercent = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onContextMenu={(e) => e.preventDefault()}
      className={`relative w-full bg-black select-none overflow-hidden ${
        isFullscreen ? "h-screen rounded-none" : "aspect-video rounded-2xl shadow-2xl"
      }`}
    >
      {/* 1. Underlying YouTube Iframe (pointer-events-none completely blocks clicks to YouTube) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden bg-black pointer-events-none">
        <iframe
          ref={iframeRef}
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?enablejsapi=1&controls=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="w-full h-full scale-[1.03] pointer-events-none"
        />
      </div>

      {/* 2. Transparent Interactive Shield (Captures clicks and toggles play/pause) */}
      <div
        onClick={togglePlay}
        className="absolute inset-0 z-20 cursor-pointer flex items-center justify-center"
      >
        {/* Large Centered Play/Pause Icon Animation */}
        {(!isPlaying || isBuffering) && (
          <div className="w-20 h-20 rounded-full bg-blue-600/90 text-white backdrop-blur-md flex items-center justify-center shadow-2xl transition-transform transform hover:scale-110 active:scale-95">
            {isBuffering && !playerReady ? (
              <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Play className="w-9 h-9 fill-current ml-1" />
            )}
          </div>
        )}
      </div>

      {/* 3. Anti-Piracy Floating Watermark (Restricted LMS stream identity) */}
      <div
        style={{ top: watermarkPos.top, left: watermarkPos.left }}
        className="absolute z-25 pointer-events-none transition-all duration-1000 opacity-30 text-[10px] font-mono tracking-wider text-white bg-black/40 px-2 py-0.5 rounded-full border border-white/10 backdrop-blur-sm"
      >
        🔒 WMES ATELIER · {studentMatric}
      </div>

      {/* 4. Top Overlay Bar (Title, Category, Close button) */}
      <div
        className={`absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent transition-opacity duration-300 flex items-center justify-between ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-600 text-white font-mono text-[9px] uppercase font-bold tracking-wider">
            {category}
          </span>
          <span className="text-white/80 font-mono text-xs font-semibold truncate max-w-sm sm:max-w-md">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 text-white/80 font-mono text-[10px]">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>Protected Stream</span>
          </div>

          {onClose && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isPlaying) sendCommand("pauseVideo");
                onClose();
              }}
              className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {/* 5. Custom WMES Player Controls (Bottom Bar) */}
      <div
        onClick={(e) => e.stopPropagation()}
        className={`absolute bottom-0 inset-x-0 z-30 px-4 py-3 bg-gradient-to-t from-black/95 via-black/75 to-transparent transition-opacity duration-300 ${
          showControls || !isPlaying ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Scrubber Bar */}
        <div className="group relative w-full h-2 mb-3 cursor-pointer flex items-center">
          <div className="w-full h-1.5 bg-white/20 rounded-full overflow-hidden transition-all group-hover:h-2.5">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={totalDuration || 100}
            step="1"
            value={currentTime}
            onChange={handleSeek}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between text-white text-xs">
          {/* Left Controls: Play, Restart, Time */}
          <div className="flex items-center gap-3">
            <button
              onClick={togglePlay}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-current" />
              ) : (
                <Play className="w-4 h-4 fill-current ml-0.5" />
              )}
            </button>

            <button
              onClick={handleRestart}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Restart from beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Time Display */}
            <div className="font-mono text-xs text-white/90 font-medium">
              <span>{formatTime(currentTime)}</span>
              <span className="text-white/40 mx-1">/</span>
              <span>{totalDuration > 0 ? formatTime(totalDuration) : duration}</span>
            </div>
          </div>

          {/* Right Controls: Volume, Stream Protection Badge, Fullscreen */}
          <div className="flex items-center gap-3">
            {/* Volume Control */}
            <div className="flex items-center gap-1.5 group">
              <button
                onClick={toggleMute}
                className="p-1.5 rounded-md hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title={isMuted ? "Unmute" : "Mute"}
              >
                {isMuted || volume === 0 ? (
                  <VolumeX className="w-4 h-4 text-rose-400" />
                ) : (
                  <Volume2 className="w-4 h-4" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-16 h-1 bg-white/20 rounded-lg accent-blue-500 cursor-pointer transition-all"
              />
            </div>

            {/* Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
