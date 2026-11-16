"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FullscreenPlayer } from "@/components/FullscreenPlayer";
import { MuteIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";
import { videoMimeType } from "@/lib/media";

type VideoBannerProps = {
  src: string;
  poster?: string;
  title: string;
  /** Short label under the title, e.g. Collection film / Piece film */
  filmLabel?: string;
  backLabel?: string;
};

export function VideoBanner({
  src,
  poster,
  title,
  filmLabel = "Collection film",
  backLabel = "Back to collection",
}: VideoBannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || failed) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    video.muted = true;
    const reveal = () => {
      video.parentElement?.setAttribute("data-ready", "true");
    };
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) reveal();
    video.addEventListener("loadeddata", reveal);

    if (reduced) {
      video.pause();
      return () => video.removeEventListener("loadeddata", reveal);
    }

    void video.play().catch(() => undefined);
    return () => video.removeEventListener("loadeddata", reveal);
  }, [failed, src]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused) {
      void video.play().catch(() => setPaused(true));
    } else {
      video.pause();
    }
  }

  function toggleMute() {
    const video = videoRef.current;
    if (!video || failed) return;
    video.muted = !video.muted;
    if (!video.muted) {
      video.volume = 1;
      void video.play().catch(() => setPaused(true));
    }
    setMuted(video.muted);
  }

  function openPlayer() {
    if (failed) return;
    const video = videoRef.current;
    setStartTime(video?.currentTime ?? 0);
    video?.pause();
    setPaused(true);
    setFullscreen(true);
  }

  function closePlayer(time: number) {
    setFullscreen(false);
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = time;
    video.muted = true;
    setMuted(true);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      video.pause();
      setPaused(true);
      return;
    }
    void video.play().then(() => setPaused(false)).catch(() => setPaused(true));
  }

  return (
    <section aria-label={`${title} film`} className="relative">
      <div className="film-frame group relative aspect-video overflow-hidden bg-card">
        <video
          ref={videoRef}
          poster={poster}
          muted={muted}
          playsInline
          loop
          preload="metadata"
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          onPlay={() => setPaused(false)}
          onPause={() => setPaused(true)}
          onError={() => setFailed(true)}
        >
          <source src={src} type={videoMimeType(src)} />
        </video>
        {poster ? (
          <Image
            src={poster}
            alt={`${title} film poster`}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 768px"
            className="object-cover group-data-[ready=true]:hidden"
          />
        ) : null}

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/75 via-black/20 to-transparent p-4 pt-16">
          <p className="font-display text-3xl leading-none text-white">{title}</p>
          <p className="mt-2 text-[11px] uppercase tracking-[0.18em] text-white/80">
            {failed ? "Film unavailable" : filmLabel}
          </p>
        </div>

        <button
          type="button"
          onClick={openPlayer}
          disabled={failed}
          aria-label={failed ? `${title} film is unavailable` : `Watch ${title}`}
          className="absolute inset-0 z-10 disabled:cursor-default"
        />

        <div className="absolute right-3 top-3 z-20 flex gap-2">
          <button
            type="button"
            onClick={togglePlay}
            disabled={failed}
            aria-label={paused ? "Play film" : "Pause film"}
            aria-pressed={!paused}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white disabled:opacity-40"
          >
            {paused ? <PlayIcon className="h-5 w-5" /> : <PauseIcon className="h-5 w-5" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            disabled={failed}
            aria-label={muted ? "Unmute film" : "Mute film"}
            aria-pressed={!muted}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/50 text-white disabled:opacity-40"
          >
            {muted ? <MuteIcon className="h-5 w-5" /> : <VolumeIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {fullscreen ? (
        <FullscreenPlayer
          src={src}
          poster={poster}
          title={title}
          backLabel={backLabel}
          startTime={startTime}
          startMuted={muted}
          onClose={closePlayer}
        />
      ) : null}
    </section>
  );
}
