"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { musicData } from "@/data/music";
import { content } from "@/data/content";

const STORAGE_KEY = "wedding-music-playing";

type WeddingAudioProps = {
  enabled: boolean;
};

export function WeddingAudio({ enabled }: WeddingAudioProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [available, setAvailable] = useState(true);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!enabled) return;

    const audio = new Audio(musicData.src);
    audio.loop = true;
    audio.volume = 0.45;
    audioRef.current = audio;

    const onError = () => setAvailable(false);
    audio.addEventListener("error", onError);

    return () => {
      audio.pause();
      audio.removeEventListener("error", onError);
      audioRef.current = null;
    };
  }, [enabled]);

  const toggle = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio || !available) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
      sessionStorage.setItem(STORAGE_KEY, "false");
      return;
    }

    try {
      await audio.play();
      setPlaying(true);
      sessionStorage.setItem(STORAGE_KEY, "true");
    } catch {
      setPlaying(false);
    }
  }, [playing, available]);

  useEffect(() => {
    if (!enabled || !available) return;
    if (sessionStorage.getItem(STORAGE_KEY) !== "true") return;

    const audio = audioRef.current;
    if (!audio) return;

    audio.play().then(() => setPlaying(true)).catch(() => setPlaying(false));
  }, [enabled, available]);

  if (!enabled) return null;

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 }}
      className="fixed right-4 bottom-4 z-[90] flex flex-col items-end gap-1"
    >
      {!available && (
        <p className="max-w-[200px] rounded-sm bg-ink/85 px-2 py-1 text-[10px] text-white/90">
          {content.music.missingFile}
        </p>
      )}
      <button
        type="button"
        onClick={toggle}
        disabled={!available}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-champagne/40 bg-ink/75 text-champagne shadow-lg backdrop-blur-sm transition hover:bg-pearl disabled:opacity-50"
        aria-pressed={playing}
        aria-label={
          playing ? content.music.pause : content.music.play
        }
      >
        {playing ? (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M6 5h4v14H6V5zm8 0h4v14h-4V5z" />
          </svg>
        ) : (
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7L8 5z" />
          </svg>
        )}
      </button>
    </motion.div>
  );
}
