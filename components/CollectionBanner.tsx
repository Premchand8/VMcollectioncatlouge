"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FullscreenPlayer } from "@/components/FullscreenPlayer";
import { MuteIcon, PauseIcon, PlayIcon, VolumeIcon } from "@/components/icons";
import { videoMimeType } from "@/lib/media";

type CollectionBannerProps = {
  videoUrl: string;
  poster?: string;
  title: string;
  tagline: string;
};

export function CollectionBanner({
  videoUrl,
  poster,
  title,
  tagline,
}: CollectionBannerProps) {
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
  }, [failed, videoUrl]);

  function togglePlay() {
    const video = videoRef.current;
    if (!video || failed) return;
    if (video.paused) void video.play().catch(() => setPaused(true));
    else video.pause();
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
    <section
      aria-label={`${title} film`}
      className="relative left-1/2 w-screen max-w-[100vw] -translate-x-1/2 overflow-hidden"
    >
      <div className="film-frame group relative min-h-[min(78dvh,720px)] w-full bg-card sm:min-h-[min(72dvh,760px)]">
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
          <source src={videoUrl} type={videoMimeType(videoUrl)} />
        </video>

        {poster ? (
          <Image
            src={poster}
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_30%] group-data-[ready=true]:hidden"
          />
        ) : null}

        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-navy-deep/40 to-navy-deep/10"
        />

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex w-full max-w-5xl flex-col px-4 pb-12 pt-32 sm:px-6">
          <p className="animate-rise text-[10px] uppercase tracking-[0.36em] text-gold-fill">
            PMJ Jewels
          </p>
          <h1 className="animate-rise-delay-1 mt-4 font-display text-[3.6rem] leading-[0.9] text-white sm:text-7xl">
            {title}
          </h1>
          <span className="gold-rule mt-5 bg-gold-fill" />
          <p className="animate-rise-delay-2 mt-5 max-w-md text-[0.95rem] leading-relaxed text-white/85">
            {tagline}
          </p>
          <div className="animate-rise-delay-2 mt-9 flex flex-wrap gap-3">
            <a
              href="#pieces"
              className="inline-flex h-12 items-center justify-center bg-gold-fill px-6 text-[11px] font-medium uppercase tracking-[0.2em] text-gold-ink transition-opacity hover:opacity-90"
            >
              See the pieces
            </a>
            <button
              type="button"
              onClick={openPlayer}
              disabled={failed}
              className="inline-flex h-12 items-center justify-center border border-white/50 px-6 text-[11px] uppercase tracking-[0.2em] text-white transition-colors hover:border-white hover:bg-white/10 disabled:opacity-40"
            >
              {failed ? "Film unavailable" : "Watch film"}
            </button>
          </div>
        </div>

        <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-5">
          <button
            type="button"
            onClick={togglePlay}
            disabled={failed}
            aria-label={paused ? "Play film" : "Pause film"}
            aria-pressed={!paused}
            className="inline-flex h-10 w-10 items-center justify-center bg-navy-deep/55 text-white backdrop-blur-sm disabled:opacity-40"
          >
            {paused ? <PlayIcon className="h-4 w-4" /> : <PauseIcon className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            disabled={failed}
            aria-label={muted ? "Unmute film" : "Mute film"}
            aria-pressed={!muted}
            className="inline-flex h-10 w-10 items-center justify-center bg-navy-deep/55 text-white backdrop-blur-sm disabled:opacity-40"
          >
            {muted ? <MuteIcon className="h-4 w-4" /> : <VolumeIcon className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {fullscreen ? (
        <FullscreenPlayer
          src={videoUrl}
          poster={poster}
          title={title}
          backLabel="Back to Gajavali"
          startTime={startTime}
          startMuted={muted}
          onClose={closePlayer}
        />
      ) : null}
    </section>
  );
}
