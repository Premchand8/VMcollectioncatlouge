"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { MuteIcon, PauseIcon, PlayIcon, ReplayIcon, VolumeIcon } from "@/components/icons";
import { formatClock } from "@/lib/format";
import { videoMimeType } from "@/lib/media";

type FullscreenPlayerProps = {
  src: string;
  poster?: string;
  title: string;
  backLabel?: string;
  startTime: number;
  startMuted: boolean;
  onClose: (time: number) => void;
};

export function FullscreenPlayer({
  src,
  poster,
  title,
  backLabel = "Back to collection",
  startTime,
  startMuted,
  onClose,
}: FullscreenPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const applied = useRef(false);
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(startMuted);
  const [current, setCurrent] = useState(startTime);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!mounted) return;
    const dialog = dialogRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const locked = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const background = Array.from(
      document.body.querySelectorAll<HTMLElement>("header, main, footer"),
    );
    background.forEach((node) => {
      node.inert = true;
    });

    dialog?.querySelector<HTMLElement>("[data-autofocus]")?.focus();

    const player = dialog?.querySelector("video");
    const begin = () => {
      if (!(player instanceof HTMLVideoElement) || applied.current) return;
      applied.current = true;
      if (
        Number.isFinite(player.duration) &&
        startTime > 0 &&
        startTime < player.duration
      ) {
        player.currentTime = startTime;
      }
      player.muted = startMuted;
      void player.play().catch(() => undefined);
    };
    if (player instanceof HTMLVideoElement) {
      if (player.readyState >= 1) begin();
      player.addEventListener("loadedmetadata", begin);
    }

    function close() {
      const video = videoRef.current;
      onClose(video?.currentTime ?? 0);
    }

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key === " " && (event.target as HTMLElement).tagName !== "INPUT") {
        event.preventDefault();
        const video = videoRef.current;
        if (!video) return;
        if (video.paused) void video.play().catch(() => setPaused(true));
        else video.pause();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = dialog.querySelectorAll<HTMLElement>("button, input");
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => {
      if (player instanceof HTMLVideoElement) {
        player.removeEventListener("loadedmetadata", begin);
      }
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = locked;
      background.forEach((node) => {
        node.inert = false;
      });
      previouslyFocused?.focus();
    };
  }, [mounted, onClose, startMuted, startTime]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  }

  function replay() {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = 0;
    void video.play().catch(() => setPaused(true));
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    if (!video.muted) video.volume = 1;
    setMuted(video.muted);
  }

  function onLoaded() {
    const video = videoRef.current;
    if (!video || applied.current) return;
    applied.current = true;
    if (
      startTime > 0 &&
      Number.isFinite(video.duration) &&
      startTime < video.duration
    ) {
      video.currentTime = startTime;
    }
    video.muted = startMuted;
    setMuted(startMuted);
    setDuration(video.duration || 0);
    void video.play().then(() => setPaused(false)).catch(() => setPaused(true));
  }

  if (!mounted) return null;

  return createPortal(
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${title} film`}
      className="fixed inset-0 z-50 flex flex-col bg-black text-white"
    >
      <div className="flex items-center gap-3 px-4 pt-[max(0.75rem,env(safe-area-inset-top))]">
        <button
          type="button"
          data-autofocus
          onClick={() => onClose(videoRef.current?.currentTime ?? 0)}
          className="inline-flex h-11 items-center gap-1 px-1 text-sm"
          aria-label={backLabel}
        >
          Back
        </button>
        <p className="min-w-0 flex-1 truncate text-center font-display text-2xl">
          {title}
        </p>
        <span className="w-14" aria-hidden="true" />
      </div>

      <video
        ref={videoRef}
        poster={poster}
        playsInline
        preload="auto"
        className="min-h-0 w-full flex-1 bg-black object-contain"
        onLoadedMetadata={onLoaded}
        onTimeUpdate={(event) => {
          const video = event.currentTarget;
          setCurrent(video.currentTime);
          if (Number.isFinite(video.duration)) setDuration(video.duration);
        }}
        onDurationChange={(event) =>
          setDuration(event.currentTarget.duration || 0)
        }
        onPlay={() => setPaused(false)}
        onPause={() => setPaused(true)}
        onEnded={() => setPaused(true)}
      >
        <source src={src} type={videoMimeType(src)} />
      </video>

      <div className="px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-3">
        <label className="sr-only" htmlFor="film-progress">
          Playback progress
        </label>
        <input
          id="film-progress"
          className="scrubber"
          type="range"
          min={0}
          max={duration || 0}
          step={0.1}
          value={Math.min(current, duration || 0)}
          disabled={!duration}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration || 0)}
          aria-valuenow={Math.round(current)}
          aria-valuetext={`${formatClock(current)} of ${formatClock(duration)}`}
          onChange={(event) => {
            const next = Number(event.target.value);
            const video = videoRef.current;
            if (video) video.currentTime = next;
            setCurrent(next);
          }}
        />
        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={togglePlay}
            aria-label={paused ? "Play film" : "Pause film"}
            aria-pressed={!paused}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={replay}
            aria-label="Replay film"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            <ReplayIcon className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={toggleMute}
            aria-label={muted ? "Unmute film" : "Mute film"}
            aria-pressed={!muted}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/15"
          >
            {muted ? <MuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
          </button>
          <p className="ml-auto text-sm tabular-nums text-white/80">
            {formatClock(current)} / {formatClock(duration)}
          </p>
        </div>
      </div>
    </div>,
    document.body,
  );
}
