"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import type { GuestbookEntry } from "@/types";
import { slotForIndex } from "@/lib/guestbook-slots";

type BlessingPinProps = {
  entry: GuestbookEntry;
  index: number;
  animateIn?: boolean;
};

export function BlessingPin({ entry, index, animateIn }: BlessingPinProps) {
  const shouldReduceMotion = useReducedMotion();
  const hasSignature = Boolean(entry.signatureDataUrl);
  const slot = hasSignature
    ? {
        top: entry.positionY ?? 40,
        left: entry.positionX ?? 30,
        rotate: -6 + (index % 5) * 3,
      }
    : slotForIndex(entry.slotIndex ?? index);
  const showMessage = entry.message.trim().length > 0;
  const showName = entry.name.trim().length > 0 && !hasSignature;

  return (
    <motion.div
      initial={
        animateIn && !shouldReduceMotion
          ? { opacity: 0, scale: 0.85, y: 8 }
          : false
      }
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="pointer-events-none absolute z-10 max-w-[46%] text-center"
      style={{
        top: `${slot.top}%`,
        left: `${slot.left}%`,
      }}
    >
      <div style={{ transform: `rotate(${slot.rotate}deg)` }}>
        {hasSignature && entry.signatureDataUrl && (
          <div className="relative mx-auto h-14 w-28 md:h-16 md:w-32">
            <Image
              src={entry.signatureDataUrl}
              alt={entry.name || "Chữ ký khách mời"}
              fill
              unoptimized
              className="object-contain drop-shadow-[0_2px_6px_rgba(0,0,0,0.35)]"
              sizes="128px"
            />
          </div>
        )}
        {showName && (
          <p className="guestbook-signature text-[clamp(1rem,4vw,1.45rem)] leading-none text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.55)]">
            {entry.name}
          </p>
        )}
        {showMessage && (
          <p
            className={`mt-1 rounded-sm bg-white/90 px-2 py-1 text-[10px] leading-snug text-charcoal shadow-sm backdrop-blur-sm md:text-xs ${hasSignature ? "max-w-[140px]" : ""}`}
          >
            {entry.message}
          </p>
        )}
      </div>
    </motion.div>
  );
}
