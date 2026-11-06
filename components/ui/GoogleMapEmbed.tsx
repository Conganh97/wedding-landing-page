"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { content } from "@/data/content";
import { buildGoogleMapsEmbedUrl } from "@/lib/google-maps";

type GoogleMapEmbedProps = {
  query: string;
  title: string;
  venueLabel?: string;
  className?: string;
};

function MapPinIcon() {
  return (
    <svg
      className="h-10 w-10 text-champagne"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

export function GoogleMapEmbed({
  query,
  title,
  venueLabel,
  className,
}: GoogleMapEmbedProps) {
  const [revealed, setRevealed] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const wrapperClass =
    className ??
    "relative aspect-[4/3] w-full overflow-hidden rounded-sm border border-champagne/25 bg-pearl";

  if (revealed) {
    const src = buildGoogleMapsEmbedUrl(query);

    return (
      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
        className={wrapperClass}
      >
        <iframe
          title={title}
          src={src}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </motion.div>
    );
  }

  return (
    <div className={wrapperClass}>
      <div
        className="absolute inset-0 bg-linear-to-br from-linen via-pearl to-blush"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 20h20v20H20V20zm-20 0h20v20H0V20z' fill='%23c9a96e' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />
      <div className="relative flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
        <MapPinIcon />
        {venueLabel && (
          <p className="max-w-[240px] text-sm font-medium text-charcoal">
            {venueLabel}
          </p>
        )}
        <p className="text-xs text-charcoal-light">{content.events.mapTapHint}</p>
        <button
          type="button"
          onClick={() => setRevealed(true)}
          className="mt-1 rounded-sm border border-champagne/45 bg-ink/80 px-5 py-2.5 text-sm tracking-wide text-champagne shadow-sm transition hover:bg-champagne hover:text-ink"
        >
          {content.events.showMap}
        </button>
      </div>
    </div>
  );
}
