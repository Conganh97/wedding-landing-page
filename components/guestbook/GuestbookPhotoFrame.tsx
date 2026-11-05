"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GuestbookEntry } from "@/types";
import { guestbookBoard } from "@/data/guestbook";
import { content } from "@/data/content";
import { BlessingPin } from "@/components/guestbook/BlessingPin";

type GuestbookPhotoFrameProps = {
  entries: GuestbookEntry[];
  lastAddedId: string | null;
  placementPreview: {
    dataUrl: string;
    x: number;
    y: number;
  } | null;
  placementMode: boolean;
  onPlacementMove: (x: number, y: number) => void;
  onOpenSign: () => void;
};

export function GuestbookPhotoFrame({
  entries,
  lastAddedId,
  placementPreview,
  placementMode,
  onPlacementMove,
  onOpenSign,
}: GuestbookPhotoFrameProps) {
  const boardRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const [dragging, setDragging] = useState(false);

  const updateFromPointer = useCallback(
    (clientX: number, clientY: number) => {
      const el = boardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.min(
        85,
        Math.max(5, ((clientX - rect.left) / rect.width) * 100),
      );
      const y = Math.min(
        85,
        Math.max(5, ((clientY - rect.top) / rect.height) * 100),
      );
      onPlacementMove(x, y);
    },
    [onPlacementMove],
  );

  const pinsOnBoard = entries.slice(0, guestbookBoard.maxPins);

  return (
    <div className="guestbook-frame-outer mx-auto max-w-md md:max-w-lg">
      <div className="guestbook-frame-border photo-frame-ornate photo-frame-ornate--tilt rounded-sm">
        <span className="photo-frame-corner photo-frame-corner-tl" aria-hidden="true" />
        <span className="photo-frame-corner photo-frame-corner-tr" aria-hidden="true" />
        <span className="photo-frame-corner photo-frame-corner-bl" aria-hidden="true" />
        <span className="photo-frame-corner photo-frame-corner-br" aria-hidden="true" />
        <div
          ref={boardRef}
          className={`photo-frame-inner relative aspect-[3/4] rounded-[2px] ${placementMode ? "cursor-crosshair" : ""}`}
          onPointerDown={(e) => {
            if (!placementMode) return;
            setDragging(true);
            updateFromPointer(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (!placementMode || !dragging) return;
            updateFromPointer(e.clientX, e.clientY);
          }}
          onPointerUp={() => setDragging(false)}
          onPointerLeave={() => setDragging(false)}
        >
          <Image
            src={guestbookBoard.imageSrc}
            alt={guestbookBoard.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 92vw, 448px"
          />
          <div className="guestbook-glass absolute inset-0" aria-hidden="true" />

          {pinsOnBoard.map((entry, index) => (
            <BlessingPin
              key={entry.id}
              entry={entry}
              index={index}
              animateIn={entry.id === lastAddedId}
            />
          ))}

          {placementPreview && placementMode && (
            <div
              className="pointer-events-none absolute z-30"
              style={{
                top: `${placementPreview.y}%`,
                left: `${placementPreview.x}%`,
                transform: "translate(-50%, -50%)",
              }}
            >
              <div className="relative h-14 w-28 md:h-16 md:w-32">
                <Image
                  src={placementPreview.dataUrl}
                  alt=""
                  fill
                  unoptimized
                  className="object-contain drop-shadow-[0_2px_8px_rgba(201,169,110,0.8)]"
                  sizes="128px"
                />
              </div>
            </div>
          )}

          {!placementMode && (
            <div className="absolute inset-x-0 bottom-0 z-20 flex justify-center p-4">
              <motion.button
                type="button"
                onClick={onOpenSign}
                whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
                whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
                className="flex items-center gap-2 rounded-sm border border-champagne/60 bg-pearl/95 px-5 py-2.5 text-sm text-charcoal shadow-lg backdrop-blur-sm"
              >
                <span aria-hidden="true">✎</span>
                {content.guestbook.signCta}
              </motion.button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
